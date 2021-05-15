var express = require('express');
var customerOrdersRouter = express.Router();
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
        client.query("INSERT INTO Orders Values(DEFAULT, 'goingon', current_timestamp, null, $1, $2) RETURNING order_id", [request.body.has_plastic, request.body.note], (err, result) => {
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

}

getRestaurantOrders = (request, response) => {

}

getDeliveryPersonOrders = (request, response) => {

}

customerOrdersRouter.get('/order/customer', getCustomerOrders);
createOrderRouter.post('/order/create', createOrder);
restaurantOrdersRouter.get('/order/restaurant', getRestaurantOrders);
deliveryPersonOrdersRouter.get('/order/restaurant', getDeliveryPersonOrders);
module.exports = {
    customerOrdersRouter,
    restaurantOrdersRouter,
    deliveryPersonOrdersRouter,
    createOrderRouter
};