var express = require('express');
var getUserInfoRouter = express.Router();
var getRestaurantOfOwnerRotuer = express.Router();
var setCurrentlyManagedRestaurantRouter = express.Router();
var getCurrentlyManagedRestaurantRouter = express.Router();
var topUpCreditRouter = express.Router();
const getPool = require('../db');

getInfo = (request, response) => {
    let sess = request.session;
    if(sess.loggedIn){
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
              return console.error('Error acquiring client', err.stack)
            }

            client.query('SELECT * FROM Users where username = $1', [sess.user.username], (err1, result1) => { 
                if(err1){
                    response.status(401).send("Get Info Unsuccessful");
                }
                else{
                    
                    userType = sess.user.type;

                    //customer
                    if(userType.localeCompare("Customer") == 0){
                        client.query('SELECT * from Customer where username = $1', [sess.user.username], (err, result2) => {          
                            release();
                            if (err) {
                              response.status(401).send("Get Info Unsuccessful");
                            }
                            else {
                                toBeReturned = (result1.rows).concat(result2.rows);
                                response.status(200).json(toBeReturned); 
                            }
                          })
                    }

                    //Restaurant Owner
                    else if(userType.localeCompare("RestaurantOwner") == 0){
                        client.query('SELECT * from RestaurantOwner where username = $1', [sess.user.username], (err, result2) => {          
                            if (err) {
                              response.status(401).send("Get Info Unsuccessful");
                            }
                            else {
                                toBeReturned = (result1.rows).concat(result2.rows);
                                response.status(200).json(toBeReturned); 
                            }
                          })
                    }

                     //Restaurant Owner
                     else if(userType.localeCompare("RestaurantOwner") == 0){
                        client.query('SELECT * from RestaurantOwner where username = $1', [sess.user.username], (err, result2) => {          
                            if (err) {
                              response.status(401).send("Get Info Unsuccessful");
                            }
                            else {
                                toBeReturned = (result1.rows).concat(result2.rows);
                                response.status(200).json(toBeReturned); 
                            }
                          })
                    }

                    //Support Staff
                    else if(userType.localeCompare("SupportStaff") == 0){
                        client.query('SELECT * from SupportStaff where username = $1', [sess.user.username], (err, result2) => {          
                            if (err) {
                              response.status(401).send("Get Info Unsuccessful");
                            }
                            else {
                                toBeReturned = (result1.rows).concat(result2.rows);
                                response.status(200).json(toBeReturned); 
                            }
                          })
                    }
                
                    //Delivery Person
                    else if(userType.localeCompare("DeliveryPerson") == 0){
                        client.query('SELECT * from DeliveryPerson where username = $1', [sess.user.username], (err, result2) => {          
                            if (err) {
                              response.status(401).send("Get Info Unsuccessful");
                            }
                            else {
                                toBeReturned = (result1.rows).concat(result2.rows);
                                response.status(200).json(toBeReturned); 
                            }
                          })
                    }

                    else {
                        response.status(401).send("Get Info Unsuccessful");
                    }

                }
            })                    
        })
    } 
    else {
        response.status(401).send("Not logged in.")
    }   
}

getRestaurantsOfOwner = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
          return console.error('Error acquiring client', err.stack)
        }
        client.query('SELECT * FROM Owns NATURAL JOIN Restaurant  WHERE username = $1', [request.session.user.username], (err, result) => {
            release();
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            response.send(result.rows);
        })
      });
}

setCurrentlyManagedRestaurant = (request, response) => {
    request.session.user.restaurant = request.body.restaurant;
    response.send(request.session.user.restaurant);
}

topUpCredit = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
          return console.error('Error acquiring client', err.stack)
        }
        console.log("SESSSSSION", request.session);
        client.query('UPDATE Customer SET credit = credit + $1 WHERE username = $2', [request.query.amount, request.session.user.username], (err, result) => {
            release();
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            response.sendStatus(200);
        })
    });
}

topUpCreditRouter.get('/userInfo/top_up_credit', topUpCredit);
getUserInfoRouter.get('/userInfo', getInfo);
getRestaurantOfOwnerRotuer.get('/userInfo/restaurants', getRestaurantsOfOwner);
setCurrentlyManagedRestaurantRouter.post('/userInfo/set_current_restaurant', setCurrentlyManagedRestaurant);
module.exports = {
    getUserInfoRouter,
    getRestaurantOfOwnerRotuer,
    setCurrentlyManagedRestaurantRouter,
    topUpCreditRouter
};