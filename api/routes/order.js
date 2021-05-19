const { request } = require('express');
var express = require('express');
var getCustomerOrdersRouter = express.Router();
var getDetailsOfAnOrderRouter = express.Router();
var restaurantOrdersRouter = express.Router();
var deliveryPersonOrdersRouter = express.Router();
var createOrderRouter = express.Router();
var getNotReviewedRouter = express.Router();
var requestDeliveryPersonForDeliveryRouter = express.Router();
var approveOrderRouter = express.Router();
var getDeliveryRequestsRouter = express.Router();
var respondToDeliveryRequestRouter = express.Router();
var completeDeliveryRouter = express.Router();
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
                            client.query("INSERT INTO Specify Values($1, $2, $3, $4, $5, $6)", [item_ids[j].item_id, box[i].options[j], order_id, restaurant_id, box[i].orderable_name, i], (err, result) => {
                                if (err) {
                                    return console.error('Error executing query', err.stack)
                                }
                            });
                        }
                    }
                });
                client.query("INSERT INTO ConsistOf Values($1, $2, $3, $4, $5)", [order_id, restaurant_id, box[i].orderable_name, i, box[i].quantity], (err, result) => {
                    if (err) {
                        return console.error('Error executing query', err.stack)
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

getUserNotReviewedOrders = (request, response) => {
    sess = request.session;
    if(sess.loggedIn){
        username = sess.user.username;
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }

            client.query("SELECT order_id FROM Orders NATURAL JOIN CompleteOrder "
            + " where username = $1 and order_id not in (select order_id from Review) AND Orders.status = 'complete'",
            [username], (err1, result1) => {
            release();
            if(err1){
                return console.error('Error acquiring client', err.stack)
            }
            else{
                response.json(result1.rows);
            }
        })
    })
}
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
                release();
                if(err1){
                    console.log("alo");
                    console.log(err1);
                    response.status(401).send("List Order Unsuccessful");
                 }
                 console.log(username, result1.rows);
                let orders = [];
                let order_id = undefined;
                let order = undefined;
                for (let i = 0; i < result1.rows.length;) {
                    let orderable = result1.rows[i];
                    let b = false;
                    console.log(orderable);
                    order_id = orderable.order_id;
                    order = {
                        order_id: orderable.order_id,
                        address_id: orderable.address_id,
                        status: orderable.status,
                        order_time: orderable.order_time,
                        time_to_deliver: orderable.time_to_deliver,
                        has_plastic: orderable.has_plastic,
                        note: orderable.note,
                        name: orderable.name,
                        total_price: 0,
                        orderables: []
                    };
                    while (order_id == orderable.order_id) {
                        order_orderable = {
                            orderable_name: orderable.orderable_name,
                            in_order_index: orderable.in_order_index,
                            quantity: orderable.quantity
                        }
                        order.orderables.push(order_orderable);
                        order.total_price += orderable.price * orderable.quantity;
                        i++;
                        orderable = result1.rows[i];
                        if (i == result1.rows.length) {
                            b = true;
                            break;
                        }
                    }
                    orders.push(order);
                    if (b) {
                        break;
                    }
                }
                response.send(orders);
                        //toBeReturned = (result1.rows).concat(result2.rows);
                        //response.status(200).json(toBeReturned); 
            });
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
                release();
                if(err1){
                    return console.error('Error acquiring client', err.stack)
                }
                response.status(200).json(result1); 
            })
        })
    }
}

getRestaurantOrders = (request, response) => {
    let sess = request.session;
    if(sess.loggedIn){
        console.log(sess.user);
        let restaurant_id = 1;
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
            let orders = [];
                let order_id = undefined;
                let order = undefined;
                for (let i = 0; i < result1.rows.length;) {
                    let orderable = result1.rows[i];
                    let b = false;
                    console.log(orderable);
                    order_id = orderable.order_id;
                    order = {
                        username: orderable.username,
                        order_id: orderable.order_id,
                        address_id: orderable.address_id,
                        status: orderable.status,
                        order_time: orderable.order_time,
                        time_to_deliver: orderable.time_to_deliver,
                        has_plastic: orderable.has_plastic,
                        note: orderable.note,
                        name: orderable.name,
                        total_price: 0,
                        address: {
                            explanation: orderable.explanation,
                            street: orderable.street,
                            street_number: orderable.street_number,
                            street_name: orderable.street_name,
                            apt_number: orderable.apt_number,
                            city: orderable.city,
                            county: orderable.county,
                            zip: orderable.zip
                        },
                        orderables: []
                    };
                    while (order_id == orderable.order_id) {
                        order_orderable = {
                            orderable_name: orderable.orderable_name,
                            in_order_index: orderable.in_order_index,
                            quantity: orderable.quantity
                        }
                        order.orderables.push(order_orderable);
                        order.total_price += orderable.price;
                        i++;
                        orderable = result1.rows[i];
                        if (i == result1.rows.length) {
                            b = true;
                            break;
                        }
                    }
                    orders.push(order);
                    if (b) {
                        break;
                    }
                }
                release();
                response.send(orders);
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
                    release();
                    response.status(401).send("List Order Unsuccessful");
                }
                else{
                    release();
                    response.json(result1.rows);
                }
            })
        })
    }
}

requestDeliveryPersonForDelivery = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query("SELECT username FROM deliveryperson WHERE is_busy = false", (err, result) => {
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            console.log(result.rows, "REQUEST FOR DELIVERY");
            if (result.rows.length > 0) {
                client.query("INSERT INTO RequestForDelivery VALUES ($1, $2, null)",[result.rows[0].username, request.query.order_id], (err, result) => {
                    if (err) {
                        return console.error('Error executing query', err.stack)
                    }
                });
                client.query("UPDATE Orders SET status='request_delivery' WHERE order_id = $1",[request.query.order_id], (err, result) => {
                    if (err) {
                        release();
                        return console.error('Error executing query', err.stack)
                    }
                });
                release();
                response.sendStatus(200);
            }
            else {
                release();
                response.sendStatus(403);
            }
        });
    });
}

approveOrder = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query("UPDATE Orders SET status='assign_delivery' WHERE order_id = $1",[request.query.order_id], (err, result) => {
            if (err) {
                release();
                return console.error('Error executing query', err.stack)
            }
        });
        release();
        response.sendStatus(200);
    });
}

getDeliveryRequests = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query("SELECT * FROM RequestForDelivery NATURAL JOIN DeliveredTo NATURAL JOIN Address  NATURAL JOIN (SELECT order_id, status FROM Orders) AS ord WHERE username = $1 AND status !='complete'",[request.session.user.username], (err, result) => {
            if (err) {
                release();
                return console.error('Error executing query', err.stack)
            }
            release();
            response.send(result.rows);
        });
    });
}

respondToDeliveryRequest = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        console.log(request.session, "SESSION");
        if (request.query.accept) {
            client.query("UPDATE RequestForDelivery SET acceptance = true WHERE username = $1 AND order_id = $2",[request.session.user.username, request.query.order_id], (err, result) => {
                if (err) {
                    return console.error('Error executing query1', err.stack)
                }
            });
            client.query("UPDATE DeliveryPerson SET is_busy=true WHERE username = $1" ,[request.session.user.username], (err, result) => {
                if (err) {
                    return console.error('Error executing query2', err.stack)
                }
            });
            client.query("UPDATE Orders SET status='in_delivery' WHERE order_id = $1" ,[request.query.order_id], (err, result) => {
                if (err) {
                    return console.error('Error executing query3', err.stack)
                }
            });
            client.query("INSERT INTO DeliveredBy VALUES($2, $1)" ,[request.session.user.username, request.query.order_id], (err, result) => {
                release();
                if (err) {
                    console.log(request.session.user.username, request.query.order_id);
                    return console.error('Error executing query4', err.stack)
                }
                response.sendStatus(200);
            });
        }
        else {
            client.query("UPDATE RequestForDelivery SET acceptance = false WHERE username = $1 AND order_id = $2",[request.session.user.username, request.query.order_id], (err, result) => {
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
            });
            client.query("UPDATE Orders SET status='assign_delivery' WHERE order_id = $1" ,[request.query.order_id], (err, result) => {
                release();
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
                response.send(result.rows);
            });
        }
        
    });
}

completeDelivery = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query("UPDATE Orders SET status='complete' WHERE order_id = $1",[request.query.order_id], (err, result) => {
            if (err) {
                release();
                return console.error('Error executing query', err.stack)
            }
        });
        response.sendStatus(200);
    });
}

completeDeliveryRouter.get('/order/complete_delivery', completeDelivery);
respondToDeliveryRequestRouter.get('/order/respond_to_delivery', respondToDeliveryRequest)
getDeliveryRequestsRouter.get('/order/get_delivery_requests', getDeliveryRequests);
approveOrderRouter.get('/order/approve', approveOrder);
getCustomerOrdersRouter.get('/order/customer', getCustomerOrders);
getDetailsOfAnOrderRouter.get('/order/customerDetails', getDetailsOfAnOrder);
createOrderRouter.post('/order/create', createOrder);
restaurantOrdersRouter.get('/order/restaurant', getRestaurantOrders);
deliveryPersonOrdersRouter.get('/order/delivery', getDeliveryPersonOrders);
getNotReviewedRouter.get('/order/getNotReviewed', getUserNotReviewedOrders);
requestDeliveryPersonForDeliveryRouter.get('/order/request_delivery', requestDeliveryPersonForDelivery);
module.exports = {
    getCustomerOrdersRouter,
    restaurantOrdersRouter,
    getDetailsOfAnOrderRouter,
    deliveryPersonOrdersRouter,
    createOrderRouter,
    getNotReviewedRouter,
    requestDeliveryPersonForDeliveryRouter,
    approveOrderRouter,
    getDeliveryRequestsRouter,
    respondToDeliveryRequestRouter,
    completeDeliveryRouter
};

