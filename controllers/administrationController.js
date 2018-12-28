const firebaseAdmin = require('firebase-admin');

exports.auth_check = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('../login');
    }
};

exports.admin_index = (req, res) => {
    res.render('admin/admin', { title: 'Restricted Garage access', user: req.user });
}

exports.requests_get = (req, res, next) => {
    var db = firebaseAdmin.firestore();
    var requestsReference = db.collection('requests');
    var data = [];

    requestsReference.get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                console.log('No data');
            } else {
                querySnapshot.docs.map(doc => {
                    var dataobject = doc.data();
                    dataobject.object_id = doc.id;
                    data.push(dataobject);
                });
            }
            res.render('admin/requests', {
                user: req.user,
                data: data,
                title: 'Zahtjevi'
            });
        })

        .catch((error) => {
            console.log(error);
            return next(error);
        });
}

exports.request_by_Id_get = (req, res, next) => {
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
}
