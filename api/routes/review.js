var express = require('express');
var writeReviewRouter = express.Router();
var getReviewRouter = express.Router();
var listReviewsRouter = express.Router();
var responseRouter = express.Router();
const getPool = require('../db');


writeReview = (request, response) => {

    restaurant_comment = request.body.restaurantComment;
    delivery_comment = request.body.deliveryComment;
    restaurant_rating = request.body.restaurantRating;
    driver_rating = request.body.driverRating;
    order_id = request.body.order_id;

    let sess = request.session;
    if(sess.loggedIn){// to be changed

        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
              return console.error('Error acquiring client', err.stack)
            }
            client.query('INSERT INTO Review '
            + 'VALUES(DEFAULT, $1, $2, $3, $4, NULL, $5) returning review_id', [driver_rating, restaurant_rating, restaurant_comment, delivery_comment, order_id], (err, result) => {
              
              if (err) {
                response.status(401).send("Add Review Unsuccessful");
              }

              else {//diger tablolara da eklencek order id lazim ve has reviews tablosu creat review delivery review
                newlyInsertedReviewId = result.rows[0].review_id;

                //has review
                //get restaurant id for the order
                client.query('SELECT restaurant_id from completeOrder where order_id = $1', [order_id] , (err1, result1) => {
                    if(err1) {
                        response.status(401).send("Add Review Unsuccessful");
                    }
                    else {
                        restaurant_id = result1.rows[0].restaurant_id;
                        console.log("alo",restaurant_id);
                        client.query('INSERT INTO HasReview VALUES($1, $2)', [restaurant_id, newlyInsertedReviewId], (err2, result2) => {
                            if(err2){
                                response.status(401).send("Add Review Unsuccessful");
                            }   
                        });
                    }
                });

                

                //create review
                //get restaurant id for the order
                client.query('SELECT restaurant_id from completeOrder where order_id = $1', [order_id] , (err1, result1) => {
                    if(err1) {
                        response.status(401).send("Add Review Unsuccessful");
                    }
                    else {
                        username = result.rows[0].username;

                        client.query('INSERT INTO CreateReview VALUES($1, $2)', [newlyInsertedReviewId, username], (err2, result2) => {
                            if(err2){
                                response.status(401).send("Add Review Unsuccessful");
                            }
                        });
                    }
                });



                //delivery review
                 //get delivery person username for the order
                 client.query('SELECT username from DeliveredBy where order_id = $1', [order_id] , (err1, result1) => {
                    if(err1) {
                        response.status(401).send("Add Review Unsuccessful");
                    }
                    else {
                        username = result.rows[0].username;

                        client.query('INSERT INTO SeeReview VALUES($1, $2)', [newlyInsertedReviewId, username], (err2, result2) => {
                            if(err2){
                                response.status(401).send("Add Review Unsuccessful");
                            }  
                        });
                    }
                });
              }
            })
        })
        response.send("Add Review Successful");

    } 
    else {
        response.status(401).send("Not logged in.")
    }
}

getReview = (request, response) => {

    order_id = request.query.order_id;
    let sess = request.session;
    if(sess.loggedIn){
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
              return console.error('Error acquiring client', err.stack)
            }
            else{
                client.query('SELECT R.name, R.average_rating, address.street, address.street_number, address.street_name, '
                + 'address.apt_number, address.city, address.county, address.zip, R.average_rating, Rev.restaurant_comment, '
                + 'Rev.delivery_comment, Rev.restaurant_rating, Rev.delivery_rating, Rev.restaurant_response '
                + 'FROM Restaurant R, Address address, Review Rev, CompleteOrder CompOrder '
                + 'WHERE Rev.order_id = $1 AND CompOrder.order_id = Rev.order_id  AND CompOrder.restaurant_id = R.restaurant_id '
                + 'AND R.address_id = address.address_id', [order_id], (err, result) => {
                  
                  if (err) {
                    response.status(401).send("See Review Unsuccessful");
                  }
                  else  {    
                    response.status(200).json(result.rows);
                  }
                })
            }       
        })
    }     
}

getRestaurantReviews = (request, response) => {
    
    let restaurant_id = request.query.restaurant_id;
    console.log(request.query);
    let sess = request.session;
    console.log(sess.loggedIn, 'LOGGGEDIN', restaurant_id);
    //if(sess.loggedIn){
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
              return console.error('Error acquiring client', err.stack)
            }
            client.query('SELECT Rev.review_id, Rev.delivery_rating, Rev.restaurant_rating, Rev.restaurant_comment, '
            + 'Rev.delivery_comment, Rev.restaurant_response '
           + 'FROM HasReview HRev NATURAL JOIN Review Rev '
           + 'WHERE HRev.restaurant_id = $1', [restaurant_id], (err, result) => {
              release();
              if (err) {
                  return console.error('Error acquiring client', err.stack)
                  response.status(401).send("List Reviews Unsuccessful");
              }

              else {
                response.status(200).json(result.rows);
              }
            })
        })
    //} 
    //else {
    //    response.status(401).send("Not logged in.")
    //}   
}

restaurantWriteResponse = (request, response) => {
    let sess = request.session;
    if(sess.loggedIn){
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
              return console.error('Error acquiring client', err.stack)
            }
            else{
                review_id = request.body.review_id;
                restaurant_response = request.body.restaurant_response;

                console.log(request.body);
                client.query('UPDATE Review SET restaurant_response = $1 where review_id = $2', [restaurant_response, review_id], (err, result) => {
                  
                  if (err) {
                    response.status(401).send("Insert Response Unsuccessful");
                  }
    
                  else {
                    response.status(200).send("Insert Response Succesful");
                  }
            })
        }
    })
    
    }
}



writeReviewRouter.post('/review/write', writeReview);
getReviewRouter.get('/review/get', getReview);
listReviewsRouter.get('/review/list', getRestaurantReviews);
responseRouter.post('/review/response', restaurantWriteResponse);
module.exports = {
    writeReviewRouter,
    getReviewRouter,
    listReviewsRouter,
    responseRouter
};