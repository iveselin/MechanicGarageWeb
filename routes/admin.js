var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../model/User');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  } else {
      //req.flash('error_msg','You are not logged in');
      res.redirect('../login');
  }
}

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('admin/admin', { title: 'Restricted Garage access', user: req.user });
});

module.exports = router;
