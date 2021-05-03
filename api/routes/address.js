var express = require('express');
var customerAddressRouter = express.Router();
var restaurantAddressRouter = express.Router();
const getPool = require('../db');


getCustomerAddresses = (request, response) => {

}

getRestaurantAddress = (request, response) => {

}

customerAddressRouter.get('/address/customer', getCustomerAddresses);
restaurantAddressRouter.get('/address/restaurant', getRestaurantAddress);
module.exports = {
    customerAddressRouter,
    restaurantAddressRouter
};