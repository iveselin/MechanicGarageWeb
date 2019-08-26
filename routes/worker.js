var express = require('express');
var router = express.Router();
var worker_controller = require('../controllers/workerController');

//auth middleware
router.use(worker_controller.auth_check);

//worker index
router.get('/', worker_controller.worker_index);

//worker tasks routes
router.route('/tasks/:id')
    .get(worker_controller.task_by_id_get)
    .post(worker_controller.task_by_id_post);

module.exports = router;