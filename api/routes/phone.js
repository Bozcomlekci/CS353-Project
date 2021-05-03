var express = require('express');
var customerPhoneRouter = express.Router();
var restaurantPhoneRouter = express.Router();
const getPool = require('../db');


getCustomerPhone = (request, response) => {

}

getRestaurantPhone = (request, response) => {

}

customerPhoneRouter.get('/phone/customer', getCustomerPhone);
restaurantPhoneRouter.get('/plistReviewsRouterhone/restaurant', getRestaurantPhone);
module.exports = {
    customerPhoneRouter,
    restaurantPhoneRouter
};