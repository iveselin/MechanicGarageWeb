var express = require('express');
var router = express.Router();
var firebaseAdmin = require('firebase-admin');


//auth checking middleware
router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect('../login');
  }
});

router.get('/', (req, res) => {
  res.render('admin/admin', { title: 'Restricted Garage access', user: req.user });
});

//to be continued
router.get('/workers', (req, res) => {
  res.send("workers");
});

// gets the data, problem is showing it...
router.get('/requests', (req, res) => {
  var db = firebaseAdmin.firestore();
  var requestsReference = db.collection('requests');
  requestsReference.get().then((querySnapshot) => {
    if (querySnapshot.empty) {
      console.log('No data');
    } else {
      var data = [];
      querySnapshot.docs.map(doc => {
        data.push(doc.data());
      });
      res.render('admin/requests', { user: req.user, data: data });
    }
  })
});

module.exports = router;
