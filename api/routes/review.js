var express = require('express');
var writeReviewRouter = express.Router();
var getReviewRouter = express.Router();
var getRestaurantReviewsRouter = express.Router();
const getPool = require('../db');


writeReview = (request, response) => {

}

getReview = (request, response) => {

}

getRestaurantReviews = (request, response) => {

}

writeReviewRouter.post('/review/write', writeReview);
getReviewRouter.get('/review/get', getReview);
listReviewsRouter.get('/review/list', getRestaurantReviews);
module.exports = {
    writeReviewRouter,
    getReviewRouter,
    listReviewsRouter
};