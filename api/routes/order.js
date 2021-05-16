var express = require('express');
var customerOrdersRouter = express.Router();
var restaurantOrdersRouter = express.Router();
var deliveryPersonOrdersRouter = express.Router();
var createOrderRouter = express.Router();
const getPool = require('../db');


createOrder = (request, response) => {
    
}

getCustomerOrders = (request, response) => {
    sess = request.session;
    if(sess.loggedIn){
        username = sess.user.username;
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }

            client.query("SELECT * FROM Orders NATURAL JOIN CompleteOrder"
            + "NATURAL JOIN Restaurant NATURAL JOIN ConsistOf NATURAL JOIN Address" 
            + "NATURAL JOIN Orderable where username = $1",
            [username], (err1, result1) => {
            if(err1){
                console.log(err1);
                response.status(401).send("List Order Unsuccessful");
            }
            else{
                client.query( "SELECT order_id, sum(price) FROM Orders NATURAL JOIN CompleteOrder NATURAL JOIN ConsistOf NATURAL JOIN Orderable" 
                + "where username = $1 group by(order_id)", [username], (err2, result2) => {
                    if(err2){
                        console.log(err2);
                        response.status(401).send("List Order Unsuccessful");
                    }
                    else{
                        toBeReturned = (result1.rows).concat(result2.rows);
                        response.status(200).json(toBeReturned); 
                    }
                })       
            }
        })
        })
    }  
}

getDetailsOfAnOrder = (request, response) => {
    sess = request.session;
    if(sess.loggedIn){
        username = sess.user.username;
        order_id = request.query.order_id
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }          
            client.query( "SELECT * FROM Orders NATURAL JOIN Orderable NATURAL JOIN ConsistOf" 
            + "NATURAL JOIN Contain CompleteOrder NATURAL JOIN Restaurant NATURAL JOIN"
            + "Address NATURAL JOIN Item NATURAL JOIN Option_ NATURAL JOIN"
            + "HasOption NATURAL JOIN DeliveredBy WHERE username = $1 and order_id = $2", [username, order_id], (err1, result1) => {
                if(err1){
                    return console.error('Error acquiring client', err.stack)
                }
                response.status(200).json(result1); 
            })
        })
    }
}

getRestaurantOrders = (request, response) => {
    
}

getDeliveryPersonOrders = (request, response) => {

}

customerOrdersRouter.get('/order/customer', getCustomerOrders);
createOrderRouter.get('/order/create', createOrder);
restaurantOrdersRouter.get('/order/restaurant', getRestaurantOrders);
deliveryPersonOrdersRouter.get('/order/restaurant', getDeliveryPersonOrders);
module.exports = {
    customerOrdersRouter,
    restaurantOrdersRouter,
    deliveryPersonOrdersRouter,
    createOrderRouter
};