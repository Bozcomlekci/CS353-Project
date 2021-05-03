var express = require('express');
var customerOrdersRouter = express.Router();
var restaurantOrdersRouter = express.Router();
var deliveryPersonOrdersRouter = express.Router();
var createOrderRouter = express.Router();
const getPool = require('../db');


createOrder = (request, response) => {

}

getCustomerOrders = (request, response) => {

}

getRestaurantOrders = (request, response) => {

}

getDeliveryPersonOrders = (request, response) => {

}

customerOrdersRouter.get('/order/customer', getCustomerOrders);
createOrderRouter.get('/order/create', createOrder);
restaurantOrdersRouter.get('/order/restaurant', getRestaurantOrders);
deliveryPersonOrdersRouter.get('/order/restaurant', getDeliveryPersonOrders);
module.exports = {
    customerOrdersRouter,
    restaurantOrdersRouter,
    deliveryPersonOrdersRouter,
    createOrderRouter
};