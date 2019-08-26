const createError = require('http-errors');
const express = require('express');
const expressValidator = require('express-validator');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const workerRouter = require('./routes/worker');
const firebaseAdmin = require('firebase-admin');



const app = express();
app.use(expressValidator());

app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//basic middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://iveselin:fanta99@ds139614.mlab.com:39614/garage_administration', { useNewUrlParser: true });
}
mongoose.Promise = global.Promise;

app.use(require('express-session')({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


//setting up passport for authentication
app.use(passport.initialize());
app.use(passport.session());

const User = require('./model/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//seting up firestore
const serviceAccount = require('./model/firebase_cred.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://mechanicgarage-6fdfa.firebaseio.com"
});

//setting routes
app.use('/', indexRouter);
app.use('/administration', adminRouter);
app.use('/worker', workerRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
