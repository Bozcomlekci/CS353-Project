var express = require('express');
const session = require('express-session');
var getCustomerAddressRouter = express.Router();
var addCustomerAddressRouter = express.Router();
var getRestaurantAddressRouter = express.Router();

const getPool = require('../db');


getCustomerAddresses = (request, response) => {
    sess = request.session;

    if(sess.loggedIn){
        username = sess.user.username;
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
              return console.error('Error acquiring client', err.stack)
            }

            console.log("ad   ", username);
            client.query('SELECT * FROM Address Natural Join HasAddress where username = $1', [username], (err1, result1) => { 
                release();
                if(err1){
                    response.status(401).send("Get Address Unsuccessful");
                }
                else{
                    response.status(200).json(result1.rows);
                }
            })
        })
    }
}

getRestaurantAddress = (request, response) => {
    sess = request.session;
    if(sess.loggedIn){
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
              return console.error('Error acquiring client', err.stack)
            }
    
            client.query('SELECT * FROM Address WHERE address_id IN (SELECT address_id from Restaurant where restaurant_id = $1)',
            [restaurant_id], (err1, result) => {
            if(err1){
                response.status(401).send("Get Address Unsuccessful");
            }
            else{
                response.status(200).json(result.rows);
            }
        })
        })
    }
}


insertCustomerAddress = (request, response) => {
    sess = request.session;
    if(sess.loggedIn){
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }


            explanation = request.body.explanation;
            street =  request.body.street;
            street_number =  request.body.street_number;
            street_name =  request.body.street_name;
            apt_number =  request.body.apt_number;
            city =  request.body.city;
            county =  request.body.county;
            zip =  request.body.zip;

            console.log(explanation, street, street_number);

            client.query('INSERT INTO Address VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8) returning address_id',
            [explanation, street, street_number, street_name, apt_number, city, county, zip], (err1, result) => {
            if(err1){
                console.log(err1);
                response.status(401).send("Insert Address Unsuccessful");
            }
            else{
                username = sess.user.username;
                address_id = result.rows[0].address_id;
                console.log("dadsada", address_id)
                console.log(username);

                address_name  =  request.body.name;
                console.log(address_name);

                client.query("INSERT INTO HasAddress VALUES($1, $2, $3) returning address_id", [address_id, username, address_name], (err2, result2) => {
                    if(err1){
                        response.status(401).send("Insert Address Unsuccessful");
                    }
                    else{
                        console.log(result.rows[0].address_id)
                        response.status(200).send("Insert Address Successful");
                    }
                })
            }
        })
        })
    
    }
}


getCustomerAddressRouter.get('/address/customer', getCustomerAddresses);
addCustomerAddressRouter.post('/address/customer', insertCustomerAddress);
getRestaurantAddressRouter.get('/address/restaurant', getRestaurantAddress);
module.exports = {
    getCustomerAddressRouter,
    addCustomerAddressRouter,
    getRestaurantAddressRouter
};