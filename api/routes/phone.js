var express = require('express');
var customerPhoneRouter = express.Router();
var restaurantPhoneRouter = express.Router();
const getPool = require('../db');


getCustomerPhone = (request, response) => {
    console.log( request.body );
    username = request.body.username;
  
    let pool = getPool();
    pool.connect((err, client, release) => {
      if (err) {
        return console.error('Error acquiring client', err.stack)
      }
      client.query('SELECT * FROM Contact where username = $1', [username], (err, result) => {
        release()
        if (err) {
          return console.error('Error executing query', err.stack)
        }
  
        /*if (result.rows.length == 1) {
          sess.user = {username: username}
          sess.loggedIn = true;
        }
        else {
          sess.loggedIn = false;
        }*/
        console.log( result);
      })
    });
}

getRestaurantPhone = (request, response) => {
    console.log( request.body );
    restaurant_id = request.body.restaurant_id;
  
    let pool = getPool();
    pool.connect((err, client, release) => {
      if (err) {
        return console.error('Error acquiring client', err.stack)
      }
      client.query('SELECT * FROM Contact where restaurant-id = $1', [restaurant_id], (err, result) => {
        release()
        if (err) {
          return console.error('Error executing query', err.stack)
        }
  
        /*if (result.rows.length == 1) {
          sess.user = {username: username}
          sess.loggedIn = true;
        }
        else {
          sess.loggedIn = false;
        }*/
        console.log(result);
        response.send(sess);
      })
    });

}

customerPhoneRouter.get('/phone/customer', getCustomerPhone);
restaurantPhoneRouter.get('/plistReviewsRouterhone/restaurant', getRestaurantPhone);
module.exports = {
    customerPhoneRouter,
    restaurantPhoneRouter
};