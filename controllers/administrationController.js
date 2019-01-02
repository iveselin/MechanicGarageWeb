const firebaseAdmin = require('firebase-admin');
const User = require('../model/User');

//auth checking middleware
exports.auth_check = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == "owner") {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in as owner');
        res.redirect('../worker');
    }
};

//administration homepage
exports.admin_index = (req, res) => {
    res.render('admin/admin', { title: 'Restricted Garage access', user: req.user });
}

//additional worker/admin registration page
exports.register_worker_get = (req, res) => {
    res.render('register', { user: req.user });
};

//additional worker registration request process
exports.register_worker_post = (req, res, next) => {
    var email = req.body.username;
    var password = req.body.password;

    // Validation
    req.checkBody('username', 'Email is required').notEmpty();
    req.checkBody('username', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(password);

    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errors: errors
        });

    } else {
        User.register(
            new User({ username: email }), password, (err, user) => {
                if (err) {
                    console.log(err);
                    return res.render('register', { user: req.user });
                } else {
                    res.redirect('/administration');
                }
            });
    }
};

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
    const db = firebaseAdmin.firestore();
    const requestsReference = db.collection('requests');
    const usersReference = db.collection('users');

    var requetsData;

    requestsReference.doc(req.params.id).get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
                return next(new Error('No such document'));
            } else {
                requetsData = doc.data();
                usersReference.doc(requetsData.uid).get()
                    .then(doc => {
                        if (!doc.exists) {
                            console.log('No such document!');
                            return next(new Error('No such document'));
                        } else {
                            res.render('admin/request_details', {
                                user: req.user,
                                request: requetsData,
                                client: doc.data(),
                                title: 'Zahtjev ' + req.params.id
                            });
                        }
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                        return next(err);
                    });
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
            return next(err);
        });
}

exports.schedule_get = (req, res) => {
    res.render('admin/schedule', { user: req.user, title: 'Raspored' });
}

exports.schedule_post = (req, res, next) => {
    var data = req.body;
    console.log(data);

    data = JSON.parse(JSON.stringify(data));

    const db = firebaseAdmin.firestore();
    const scheduleReference = db.collection('schedule');

    scheduleReference.doc().set(data, { merge: true })
        .then(ref => {
            console.log("added doc with ref" + ref);
            res.redirect("/administration");
        })
        .catch(err => {
            return next(err);
        })
}