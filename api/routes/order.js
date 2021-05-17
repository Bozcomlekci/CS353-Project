var express = require('express');
var getCustomerOrdersRouter = express.Router();
var getDetailsOfAnOrderRouter = express.Router();
var restaurantOrdersRouter = express.Router();
var deliveryPersonOrdersRouter = express.Router();
var createOrderRouter = express.Router();
const getPool = require('../db');


createOrder = (request, response) => {
    let box = request.session.box;
    let restaurant_id = request.session.box[0].restaurant_id;
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        console.log("TIME TO DELIVER: ", request.body.time_to_deliver);
        client.query("INSERT INTO Orders Values(DEFAULT, 'restaurant_approval', current_timestamp, $1, null, $2, $3) RETURNING order_id", [request.body.time_to_deliver, request.body.has_plastic, request.body.note], (err, result) => {
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            let order_id = result.rows[0].order_id;
            
            for (let i = 0; i < box.length; i++) {
                console.log("ASDASDASDASDASDASDAS", box[i].orderable_name, restaurant_id);
                client.query("SELECT item_id FROM contain WHERE orderable_name = $1 AND restaurant_id = $2", [box[i].orderable_name, restaurant_id], (err, result) => {
                    if (err) {
                        return console.error('Error executing query', err.stack)
                    }
                    console.log("ROWS: ", result.rows);
                    let item_ids = result.rows;

                    console.log("ITEM IDS: ", item_ids);
                    for (let j = 0; j < box[i].options.length; j++) {
                        if (box[i].options[j] != "None") {
                            client.query("INSERT INTO Specify Values($1, $2, $3, $4, $5, $6, true)", [item_ids[j].item_id, box[i].options[j], order_id, restaurant_id, box[i].orderable_name, j], (err, result) => {
                                if (err) {
                                    return console.error('Error executing query', err.stack)
                                }
                            });
                        }
                    }
                });
            }
            client.query("INSERT INTO CompleteOrder Values($1, $2, $3)", [order_id, request.session.user.username, restaurant_id], (err, result) => {
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
            });
            client.query("INSERT INTO DeliveredTo Values($1, $2)", [order_id, request.body.address_id], (err, result) => {
                release()
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
            });
        });
    });
    response.sendStatus(200);
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

            client.query("SELECT * FROM Orders NATURAL JOIN CompleteOrder "
            + "NATURAL JOIN Restaurant NATURAL JOIN ConsistOf NATURAL JOIN Address " 
            + "NATURAL JOIN Orderable where username = $1",
            [username], (err1, result1) => {
            if(err1){

                console.log("alo");
                console.log(err1);
                response.status(401).send("List Order Unsuccessful");
            }
            else{
                client.query( "SELECT order_id, sum(price) FROM Orders NATURAL JOIN CompleteOrder NATURAL JOIN ConsistOf NATURAL JOIN Orderable " 
                + " where username = $1 group by(order_id)", [username], (err2, result2) => {
                    if(err2){
                        console.log("alo2");

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
        order_id = request.query.order_id
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }          
            client.query( "SELECT * FROM Orders NATURAL JOIN Orderable NATURAL JOIN ConsistOf " 
            + "NATURAL JOIN Contain NATURAL JOIN CompleteOrder NATURAL JOIN Restaurant NATURAL JOIN "
            + "Address NATURAL JOIN Item NATURAL JOIN Option_ NATURAL JOIN "
            + "HasOption NATURAL JOIN DeliveredTo where order_id = $2", [order_id], (err1, result1) => {
                if(err1){
                    return console.error('Error acquiring client', err.stack)
                }
                response.status(200).json(result1); 
            })
        })
    }
}

getRestaurantOrders = (request, response) => {
    sess = request.session;
    if(sess.loggedIn){
        restaurant_id = request.query.restaurant_id;
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }

            client.query("SELECT * FROM Orders NATURAL JOIN CompleteOrder "
            + "NATURAL JOIN Restaurant NATURAL JOIN ConsistOf NATURAL JOIN Address " 
            + "NATURAL JOIN Orderable where restaurant_id = $1",
            [restaurant_id], (err1, result1) => {
            if(err1){
                console.log(err1);
                response.status(401).send("List Order Unsuccessful");
            }
            else{
                client.query( "SELECT order_id, sum(price) FROM Orders NATURAL JOIN CompleteOrder NATURAL JOIN ConsistOf NATURAL JOIN Orderable " 
                + "where restaurant_id = $1 group by(order_id)", [restaurant_id], (err2, result2) => {
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

getDeliveryPersonOrders = (request, response) => {
    sess = request.session;
    if(sess.loggedIn){
        username = sess.user.username;
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }

            client.query("SELECT * FROM delivery_person_order_view username = $1",
            [username], (err1, result1) => {
                if(err1){
                    response.status(401).send("List Order Unsuccessful");
                }
                else{
                    response.json(result1.rows);
                }
            })
        })
    }
}

getCustomerOrdersRouter.get('/order/customer', getCustomerOrders);
getDetailsOfAnOrderRouter.get('/order/customerDetails', getDetailsOfAnOrder);
createOrderRouter.post('/order/create', createOrder);
restaurantOrdersRouter.get('/order/restaurant', getRestaurantOrders);
deliveryPersonOrdersRouter.get('/order/delivery', getDeliveryPersonOrders);
module.exports = {
    getCustomerOrdersRouter,
    restaurantOrdersRouter,
    getDetailsOfAnOrderRouter,
    deliveryPersonOrdersRouter,
    createOrderRouter
};

