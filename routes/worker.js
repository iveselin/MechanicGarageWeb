var express = require('express');
var router = express.Router();
var worker_controller = require('../controllers/workerController');

router.use(worker_controller.auth_check);

router.get('/', worker_controller.worker_index);

module.exports = router;