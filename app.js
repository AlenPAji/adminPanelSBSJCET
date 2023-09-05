var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
//const bodyParser = require('body-parser'); 
var passport = require('passport');
var db=require("./config/connection");
//var session=require("express-session")
db.connect();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var passportLocalMongoose = require('passport-local-mongoose');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();
// Parse JSON-encoded request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: false }));

//app.use(bodyParser.urlencoded({ extended: false }));
const hbs = require('hbs'); // Import the Handlebars module

// Custom Handlebars helper to check for equality
hbs.registerHelper('isEqual', function (value1, value2, options) {
  if (value1 === value2) {
    return options.fn(this); // Values are equal, execute the content inside the block
  } else {
    return options.inverse(this); // Values are not equal, execute the content inside the else block (if provided)
  }
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
require('dotenv').config();
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,

}))

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
