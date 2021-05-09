var express = require('express');
var getUserInfoRouter = express.Router();
const getPool = require('../db');

getInfo = (request, response) => {
    let sess = request.session;
    if(sess.loggedIn){
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
              return console.error('Error acquiring client', err.stack)
            }

            client.query('SELECT * FROM Users where username = $1', [username], (err1, result1) => { 
                if(err1){
                    response.status(401).send("Get Info Unsuccessful");
                }
                else{
                    
                    userType = sess.user.type;

                    //customer
                    if(userType.localeCompare("Customer") == 0){
                        client.query('SELECT * from Customer where username = $1', [username], (err, result2) => {          
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
                        client.query('SELECT * from RestaurantOwner where username = $1', [username], (err, result2) => {          
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
                        client.query('SELECT * from RestaurantOwner where username = $1', [username], (err, result2) => {          
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
                        client.query('SELECT * from SupportStaff where username = $1', [username], (err, result2) => {          
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
                        client.query('SELECT * from DeliveryPerson where username = $1', [username], (err, result2) => {          
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

getUserInfoRouter.get('/userInfo', getInfo);
module.exports = {
    getUserInfoRouter,
};