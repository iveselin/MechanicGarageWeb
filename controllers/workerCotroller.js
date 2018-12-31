const firebaseAdmin = require('firebase-admin');
const User = require('../model/User');

exports.auth_check = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in as owner');
        res.redirect('../login');
    }
};

exports.worker_index = (req, res, next) => {
    res.render('admin/admin', { title: 'Worker access', user: req.user });
}