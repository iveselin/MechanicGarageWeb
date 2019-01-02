var express = require('express');
var router = express.Router();
var administration_controller = require('../controllers/administrationController');

//auth checking middleware
router.use(administration_controller.auth_check);

router.get('/', administration_controller.admin_index);

//to be continued
router.get('/workers', (req, res) => {
  res.send("workers");
});

//get all pending requests
router.get('/requests', administration_controller.requests_get);

//gets the data of clicked job_request by id
router.get('/requests/:id', administration_controller.request_by_Id_get);

//register routes 
router.route('/register')
  .get(administration_controller.register_worker_get)
  .post(administration_controller.register_worker_post);

router.route('/schedule')
  .get(administration_controller.schedule_get)
  .post(administration_controller.schedule_post);

module.exports = router;