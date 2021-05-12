var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var loggedinRouter = require('./routes/loggedin');
var logoutRouter = require('./routes/logout');
var signupRouter = require('./routes/signup');
var reviewRouter = require('./routes/review');
var userInfoRouter = require('./routes/userInfo');


var restaurantRouter = require('./routes/restaurant');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
  secret: 'lmao secret',
  resave: false,
  saveUninitialized: true
}));

//app.use(cors());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.post('/login', loginRouter);
app.post('/signup', signupRouter);
app.get('/loggedin', loggedinRouter);
app.get('/logout', logoutRouter);
app.post('/review/write', reviewRouter.writeReviewRouter);
app.get('/review/get', reviewRouter.getReviewRouter);
app.get('/review/list', reviewRouter.listReviewsRouter);
app.get('/userInfo', userInfoRouter.getUserInfoRouter);
app.get('/restaurant/list_orderables', restaurantRouter.listOrderables);
app.get('/restaurant/list_restaurants', restaurantRouter.listRestaurants);
app.get('/restaurant/get_options', restaurantRouter.getOptionsForItem);
app.post('/restaurant/add_item', restaurantRouter.addItem);
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
