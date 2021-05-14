var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


const {sequelize} = require('./models');

var app = express();

(async () => {
  //await sequelize.sync({force:true});
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

app.use((req,res,next)=>{
  const err = new Error("Page not found :(");
  err.status=404;
  next(err)   
});

app.use((err, req,res,next)=>{
  res.locals.error= err;

  if (err.status ===404) {
      res.status(err.status);
      err.message="That page does not exist :("
      console.log(err.message);
      return res.render('page-not-found', {err});
  } else {
      err.status = 500;
      res.status(err.status);
      err.message="Server made an oops :( Try again"
      console.log(err.message);
      return res.render('error', {err});
  }
});

module.exports = app;
