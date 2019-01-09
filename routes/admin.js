var express = require('express');
var router = express.Router();
var administration_controller = require('../controllers/administrationController');

//auth checking middleware
router.use(administration_controller.auth_check);

router.get('/', administration_controller.admin_index);

//get all pending requests
router.get('/requests', administration_controller.requests_get);

//gets the data of clicked job_request by id
router.route('/requests/:id')
  .get(administration_controller.request_by_Id_get)
  //assigning a worker to request
  .post(administration_controller.request_by_Id_post);

//register routes 
router.route('/register')
  .get(administration_controller.register_worker_get)
  .post(administration_controller.register_worker_post);

//schedule routes
router.route('/schedule')
  .get(administration_controller.schedule_get)
  .post(administration_controller.schedule_post);

router.get('/week', administration_controller.requests_by_week_get);

module.exports = router;