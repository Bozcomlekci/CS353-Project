var express = require('express');
var getCustomerPhoneRouter = express.Router();
var getRestaurantPhoneRouter = express.Router();
var addCustomerPhoneRouter = express.Router();
var addRestaurantPhoneRouter = express.Router();

const getPool = require('../db');


getCustomerPhone = (request, response) => {
  sess = request.session;
  type = sess.user.type;
  if(sess.loggedIn && (type.localeCompare("Customer") == 0)){
    username = sess.user.username;
  
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
        response.send(result.rows);
      })
    });
  }
}

getRestaurantPhone = (request, response) => {
  sess = request.session;
  if(sess.loggedIn){
    restaurant_id = request.query.restaurant_id;
    
  
    let pool = getPool();
    pool.connect((err, client, release) => {
      if (err) {
        return console.error('Error acquiring client', err.stack)
      }
      client.query('SELECT * FROM RestaurantContact where restaurant_id = $1', [restaurant_id], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        response.send(result.rows);
      })
    });
  }
}

addCustomerPhone = (request, response) => {
  sess = request.session;
  type = sess.user.type;
  if(sess.loggedIn && (type.localeCompare("Customer") == 0)){
    username = sess.user.username;
    phone = request.body.phone;
    name_ = request.body.name;
    let pool = getPool();
    pool.connect((err, client, release) => {
      if (err) {
        return console.error('Error acquiring client', err.stack)
      }
      client.query('SELECT * FROM Phone where phone_number = $1', [phone], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        else {
          if(result.rows.length == 0){
            client.query('INSERT INTO  PHONE VALUES($1)', [phone], (err1, result1) => {
                if(err1){
                  return console.error('Error executing query', err.stack)
                }
            })
          }

          client.query('INSERT INTO Contact VALUES($1, $2, $3)', [username, phone, name_], (err2, result2) => {
            if(err2){
              return console.error('Error executing query', err.stack)
            }
            else{
              response.send("Add Phone Succesful");
            }          
          })
        }
      })
    });
  }
}


addRestaurantPhone = (request, response) => {
  sess = request.session;
  type = sess.user.type;
  if(sess.loggedIn && (type.localeCompare("RestaurantOwner") == 0)){
    restaurant_id = request.body.restaurant_id;
    phone = request.body.phone;    
    let pool = getPool();
    pool.connect((err, client, release) => {
      if (err) {
        return console.error('Error acquiring client', err.stack)
      }
      client.query('SELECT * FROM Phone where phone_number = $1', [phone], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        else {
          if(result.rows.length == 0){
            client.query('INSERT INTO  PHONE VALUES($1)', [phone], (err1, result1) => {
                if(err1){
                  return console.error('Error executing query', err1.stack)
                }
            })
          }
  
          client.query('INSERT INTO  RestaurantContact VALUES($1, $2)', [restaurant_id, phone], (err2, result2) => {
            if(err2){
              return console.error('Error executing query', err2.stack)
            }
            else{
              response.send("Add Phone Succesful");
            }          
          })
        }
      })
    });
  
  }
  
}


getCustomerPhoneRouter.get('/phone/customer', getCustomerPhone);
getRestaurantPhoneRouter.get('/phone/restaurant', getRestaurantPhone);
addCustomerPhoneRouter.post('/phone/addCustomer', addCustomerPhone);
addRestaurantPhoneRouter.post('/phone/addRestaurant', addRestaurantPhone);

module.exports = {
  getCustomerPhoneRouter,
  getRestaurantPhoneRouter,
  addCustomerPhoneRouter,
  addRestaurantPhoneRouter
};