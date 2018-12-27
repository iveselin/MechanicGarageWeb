var passport = require('passport');

exports.index = (req, res) => {
    res.render('index', { title: 'Garage homepage', user: req.user });
};

exports.login_get = (req, res) => {
    res.render('login', { title: "Garage sign-in page", user: req.user });
};

exports.login_post = (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/administration'
    })(req, res, next);
};

exports.about_get = (req, res) => {
    res.render('about', { title: 'Basic info', user: req.user });
};

exports.contact_get = (req, res) => {
    res.render('contact', { title: 'Contact info', user: req.user });
};

exports.logout_get = (req, res) => {
    req.logout();
    res.redirect('/index');
};

