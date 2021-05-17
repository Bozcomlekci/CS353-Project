var express = require('express');
var router = express.Router();
loginOperationRouter = express.Router();
changePasswordRouter = express.Router();

const getPool = require('../db');


login = (request, response) => {
  
  let sess = request.session;
  console.log(sess, "LOGIN");
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
  
        else if (result.rows.length == 1) {
          console.log(result.rows);
          request.session.loggedIn = true;
          request.session.user = {username: username}
          console.log(request.session);
          //find user type
          //check customer
          client.query('SELECT * FROM Customer where username = $1', [username], (err1, result1) => {
            if(err1){
            }
            
            if(result1.rows.length == 1){
              release();
              request.session.user.type = "Customer";
              request.session.box = [];
              request.session.save();
              response.send(request.session);              
            }
              else {
                //check restaurant owner
                client.query('SELECT * FROM RestaurantOwner where username = $1', [username], (err1, result1) => {
                  if(err1){
                  }
                  
                  if(result1.rows.length == 1){
                    release();
                    request.session.user.type = "RestaurantOwner";
                    request.session.user.restaurant = null;
                    request.session.save();
                    response.send(request.session);           
                  }
                  else {
                    //check support staff
                    client.query('SELECT * FROM SupportStaff where username = $1', [username], (err1, result1) => {
                      if(err1){
                      }
                      
                      if(result1.rows.length == 1){
                        release();
                        request.session.user.type = "SupportStaff";
                        request.session.save();
                        response.send(request.session);
                      }
                      else {
                        //check delivery person
                        client.query('SELECT * FROM DeliveryPerson where username = $1', [username], (err1, result1) => {
                          if(err1){
                          }
                          
                          if(result1.rows.length == 1){
                            release();
                            request.session.user.type = "DeliveryPerson";
                            request.session.save();
                            response.send(request.session);
                          }
                        });
                      }
                    });
                  }
                })
              }
            }
            );
        }
        else {
          release();
          request.session.loggedIn = false;
          request.session.save();
          response.send(request.session);
        }
      })

    });
  }
  else {
    response.send(request.session);
  }
}

changePassword = (request, response) => {
  username = request.body.username;
  oldPassword = request.body.oldPassword;
  newPassword = request.body.newPassword;



  let pool = getPool();
  pool.connect((err, client, release) => {    
    if (err) {
      console.log("burasi");
      return console.error('Error acquiring client', err.stack)
    }
    
    client.query('SELECT * FROM Users where username = $1 and password = $2', [username, oldPassword], (err1, result1) => {

      if (err1) {
        response.status(401).send("Change Password Unsuccessful");
      }
      else if (result1.rows.length == 1){
        client.query('UPDATE Users SET password = $1 WHERE password = $2;', [newPassword, oldPassword], (err2, result2) => {
          if(err2){
            response.status(401).send("Change Password Unsuccessful");
          }
          else{
            response.send("Change Password Succesful");
          }
        })

      }
      else{
        response.status(401).send("Change Password Unsuccessful");
      }
    })
  })

}


loginOperationRouter.post('/login', login);
changePasswordRouter.post('/changePassword', changePassword);

module.exports = {
  loginOperationRouter,
  changePasswordRouter
};