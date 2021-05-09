var express = require('express');
var router = express.Router();
const getPool = require('../db');


login = (request, response) => {
  console.log(request.body);
  
  let sess = request.session;
  if (!sess.loggedIn) {
    username = request.body.username;
    password = request.body.password;
  
    let pool = getPool();
    pool.connect((err, client, release) => {
      if (err) {
        return console.error('Error acquiring client', err.stack)
      }
      client.query('SELECT * FROM Users where username = $1 and password = $2', [username, password], (err, result) => {
        
        if (err) {
          response.status(401).send("Login Unsuccessful");
        }
  
        if (result.rows.length == 1) {

          console.log("ADS");
          sess.loggedIn = true;
          sess.user = {username: username}

          //find user type
          //check customer
          client.query('SELECT * FROM Customer where username = $1', [username], (err1, result1) => {
            if(err1){
            }
            
            if(result1.rows.length == 1){
              sess.user.type = "Customer";
              response.send(sess);              }
          });


          //check restaurant owner
          client.query('SELECT * FROM RestaurantOwner where username = $1', [username], (err1, result1) => {
            if(err1){
            }
            
            if(result1.rows.length == 1){
              sess.user.type = "RestaurantOwner";
              response.send(sess);           
             }
          });
          

          //check support staff
          client.query('SELECT * FROM SupportStaff where username = $1', [username], (err1, result1) => {
            if(err1){
            }
            
            if(result1.rows.length == 1){
              sess.user.type = "SupportStaff";
              response.send(sess);
            }
          });


          //check delivery person
          client.query('SELECT * FROM DeliveryPerson where username = $1', [username], (err1, result1) => {
            if(err1){
            }
            
            if(result1.rows.length == 1){
              sess.user.type = "DeliveryPerson";
              response.send(sess);
            }
          });    
        }
        else {
          sess.loggedIn = false;
        }
      })

    });
  }
  else {
    response.send(sess);
  }
}

router.post('/login', login);
module.exports = router;