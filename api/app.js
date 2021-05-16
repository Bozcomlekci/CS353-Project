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
var supportRouter = require('./routes/support');
var boxRouter = require('./routes/box');
var phoneRouter = require('./routes/phone');

var addressRouter = require('./routes/address');

var orderRouter = require('./routes/order');
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

app.post('/login', loginRouter.loginOperationRouter);
app.post('/changePassword', loginRouter.changePasswordRouter);



app.post('/signup', signupRouter);
app.get('/loggedin', loggedinRouter);
app.get('/logout', logoutRouter);
app.post('/review/write', reviewRouter.writeReviewRouter);
app.get('/review/get', reviewRouter.getReviewRouter);
app.get('/review/list', reviewRouter.listReviewsRouter);
app.get('/userInfo', userInfoRouter.getUserInfoRouter);
app.get('/restaurant/list_orderables', restaurantRouter.listOrderablesRouter);
app.get('/restaurant/list_restaurants', restaurantRouter.listRestaurantsRouter);
app.get('/restaurant/list_items', restaurantRouter.listItemsRouter);
app.get('/restaurant/get_options', restaurantRouter.getOptionsRouter);
app.post('/restaurant/add_item', restaurantRouter.addItemRouter);

app.post('/support/writeticket', supportRouter.writeTicketRouter);
app.get('/support/getticket', supportRouter.getTicketRouter);
app.get('/support/assignTicket', supportRouter.assignTicketRouter);
app.get('/support/warn', supportRouter.issueWarningRouter);

app.post('/box/add', boxRouter.addToBoxRouter);
app.get('/box/get', boxRouter.getBoxRouter);
app.get('/box/remove', boxRouter.removeFromBoxRouter);
app.get('/box/update', boxRouter.updateBoxRouter);

app.post('/order/create', orderRouter.createOrderRouter);
app.get('/order/customer', orderRouter.getCustomerOrdersRouter);
app.get('/order/customerDetails', orderRouter.getDetailsOfAnOrderRouter);
app.get('/order/restaurant', orderRouter.restaurantOrdersRouter);
app.get('/order/delivery', orderRouter.deliveryPersonOrdersRouter);



app.get('/address/customer', addressRouter.getCustomerAddressRouter);
app.post('/address/customer', addressRouter.addCustomerAddressRouter);
app.get('/address/restaurant', addressRouter.getRestaurantAddressRouter);

app.get('/userinfo/restaurants', userInfoRouter.getRestaurantOfOwnerRotuer);
app.post('/userInfo/set_current_restaurant', userInfoRouter.setCurrentlyManagedRestaurantRouter);

app.get('/phone/customer', phoneRouter.getCustomerPhoneRouter);
app.get('/phone/restaurant', phoneRouter.getRestaurantPhoneRouter);
app.post('/phone/addRestaurant', phoneRouter.addRestaurantPhoneRouter);
app.post('/phone/addCustomer', phoneRouter.addCustomerPhoneRouter);





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
