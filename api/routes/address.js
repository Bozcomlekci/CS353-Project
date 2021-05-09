var express = require('express');
var customerAddressRouter = express.Router();
var restaurantAddressRouter = express.Router();
const getPool = require('../db');


getCustomerAddresses = (request, response) => {
    console.log( request.body );
    username = request.body.username;
  
    let pool = getPool();
    pool.connect((err, client, release) => {
      if (err) {
        return console.error('Error acquiring client', err.stack)
      }
      client.query('SELECT * FROM HasAddress NATURAL JOIN Address where username = $1 AND HasAddress.address_id = Address.address_id', [username], (err, result) => {
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


getRestaurantAddress = (request, response) => {
    console.log( request.body );
    restaurant_id = request.body.restaurant_id;
  
    let pool = getPool();
    pool.connect((err, client, release) => {
      if (err) {
        return console.error('Error acquiring client', err.stack)
      }
      client.query('SELECT * FROM Restaurant NATURAL JOIN Address where restaurant_id = $1 AND Restaurant.address_id = Address.address_id', [restaurant_id], (err, result) => {
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

customerAddressRouter.get('/address/customer', getCustomerAddresses);
restaurantAddressRouter.get('/address/restaurant', getRestaurantAddress);
module.exports = {
    customerAddressRouter,
    restaurantAddressRouter
};