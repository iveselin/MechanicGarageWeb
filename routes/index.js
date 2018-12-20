var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../model/User');

//homepage route(no auth needed)
router.get(['/', '/index'], (req, res) => {
    res.render('index', { title: 'Garage homepage', user: req.user });
});

//login routes
router.route('/login')

    .get((req, res) => {
        res.render('login', { title: "Garage sign-in page", user: req.user });
    })

    .post(passport.authenticate('local'), (req, res) => {
        res.redirect('/administration/');
    });




//register routes ----> should move to administration
router.route('/register')

    .get((req, res) => {
        res.render('register');
    })

    .post((req, res) => {
        var email = req.body.username;
        var password = req.body.password;

        // Validation
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
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
                        return res.render('register', { user: user });
                    } else {
                        res.render('login');
                    }
                });
        }
    });


//logout request handling
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/index');
});

module.exports = router;
