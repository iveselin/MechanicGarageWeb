var express = require('express');
var router = express.Router();
var index_controller = require('../controllers/indexCotroller');

//homepage route(no auth needed)
router.get(['/', '/index'], index_controller.index);

//login routes
router.route('/login')
    .get(index_controller.login_get)
    .post(index_controller.login_post);

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

router.get('/about', index_controller.about_get);

router.get('/contact', index_controller.contact_get);

//logout request handling
router.get('/logout', index_controller.logout_get);

module.exports = router;
