var express = require('express');
var router = express.Router();
var index_controller = require('../controllers/indexController');

//homepage route(no auth needed)
router.get(['/', '/index'], index_controller.index);

//login routes
router.route('/login')
    .get(index_controller.login_get)
    .post(index_controller.login_post);

router.get('/about', index_controller.about_get);

//logout request handling
router.get('/logout', index_controller.logout_get);

module.exports = router;
