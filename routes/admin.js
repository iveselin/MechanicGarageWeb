var express = require('express');
var router = express.Router();
var firebaseAdmin = require('firebase-admin');
var administration_controller = require('../controllers/administrationController');


//auth checking middleware
router.use(administration_controller.auth_check);

router.get('/', administration_controller.admin_index);

//to be continued
router.get('/workers', (req, res) => {
  res.send("workers");
});

//get all pending requests(add pending part)
router.get('/requests', administration_controller.requests_get);


//gets the data of clicked job_request by position, try to find doc Id and then query the data
router.get('/requests/:id', administration_controller.request_by_Id_get);

module.exports = router;