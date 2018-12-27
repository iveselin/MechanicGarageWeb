const firebaseAdmin = require('firebase-admin');

exports.auth_check = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('../login');
    }
};

