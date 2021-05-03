var express = require('express');
// to be changed
var writeReviewRouter = express.Router();
var getReviewRouter = express.Router();
var getRestaurantReviewsRouter = express.Router();
const getPool = require('../db');


addItem = (request, response) => {

}

addOption  = (request, response) => {

}

addOptionToItem = (request, response) => {

}

removeOptionFromItem = (request, response) => {

}

addOrderable = (request, response) => {

}

removeOrderable = (request, response) => {

}

updateOrderable = (request, response) => {

}

listOrderables = (request, response) => {

}

// to be changed
writeReviewRouter.post('/restaurant/write', writeReview);
getReviewRouter.get('/restaurant/get', getReview);
listReviewsRouter.get('/restaurant/list', getRestaurantReviews);
module.exports = {
    writeReviewRouter,
    getReviewRouter,
    listReviewsRouter
};