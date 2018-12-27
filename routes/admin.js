var express = require('express');
var router = express.Router();
var firebaseAdmin = require('firebase-admin');
var administration_controller = require('../controllers/administrationController');


//auth checking middleware
router.use(administration_controller.auth_check);

router.get('/', (req, res) => {
  res.render('admin/admin', { title: 'Restricted Garage access', user: req.user });
});

//to be continued
router.get('/workers', (req, res) => {
  res.send("workers");
});

//get all pending requests(add pending part)
router.get('/requests', (req, res) => {
  var db = firebaseAdmin.firestore();
  var requestsReference = db.collection('requests');

  requestsReference.get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log('No data');
      } else {
        var data = [];
        querySnapshot.docs.map(doc => {
          var dataobject = doc.data();
          dataobject.object_id = doc.id;
          data.push(dataobject);
        });

        res.render('admin/requests', {
          user: req.user,
          data: data,
          title: 'Zahtjevi'
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});


//gets the data of clicked job_request by position, try to find doc Id and then query the data
router.get('/requests/:id', (req, res, next) => {
  var db = firebaseAdmin.firestore();
  var requestsReference = db.collection('requests');

  requestsReference.doc(req.params.id).get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
        return next(new Error('No such document'));
      } else {
        res.render('admin/request_details', {
          user: req.user,
          data: doc.data(),
          title: 'Zahtjev ' + req.params.id
        });
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
      return next(err);
    });
});

module.exports = router;