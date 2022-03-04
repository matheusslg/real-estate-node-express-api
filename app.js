var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var cors = require('cors');
var corsConfig = require('./src/app/controllers/corsController');

var indexRouter = require('./src/app/routes/index');
var authRouter = require('./src/app/routes/auth');
var usersRouter = require('./src/app/routes/users');
var propertiesRouter = require('./src/app/routes/properties');
var categoriesRouter = require('./src/app/routes/categories');
var locationsRouter = require('./src/app/routes/locations');
var typesRouter = require('./src/app/routes/types');
var tagsRouter = require('./src/app/routes/tags');
var imagesRouter = require('./src/app/routes/images');
var citiesRouter = require('./src/app/routes/cities');
var slugTypesRouter = require('./src/app/routes/slugTypes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('combined'));
app.use(helmet());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// allow OPTIONS on all resources
app.options('*', cors(corsConfig))

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/properties', propertiesRouter);
app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);
app.use('/types', typesRouter);
app.use('/tags', tagsRouter);
app.use('/images', imagesRouter);
app.use('/cities', citiesRouter);
app.use('/slugTypes', slugTypesRouter);

// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  next(createError(404, 'An unknown error has occurred'));
  console.log(err);
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
