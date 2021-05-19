var express = require('express');
var getBoxRouter = express.Router();
var addToBoxRouter = express.Router();
var removeFromBoxRouter = express.Router();
var updateBoxRouter = express.Router();
const getPool = require('../db');

getBox = (request, response) => {
    response.send(request.session.box);
}

addToBox = (request, response) => {
    // check if options are
    // quantity
    let orderable = request.body.orderable;
    console.log("AAAAAAAAAAAAAAAAAA", orderable);
    let exists = false;
    console.log(exists);
    console.log(request.session.box);
    for (let i = 0; i < request.session.box.length && !exists; i++) {
        console.log("i = ", i);
        console.log(orderable.orderable_name);
        console.log(request.session.box[i].orderable_name);
        console.log(orderable.options);
        console.log(request.session.box[i].options);
        console.log(orderable.options.toString() == request.session.box[i].options.toString());
        if (orderable.orderable_name == request.session.box[i].orderable_name
            && orderable.options.toString() == request.session.box[i].options.toString()) {
                request.session.box[i].quantity += orderable.quantity;
                exists = true;
        }
    }
    console.log(exists);
    if (exists) {
        console.log("HERE76");
        request.send(request.session.box);
    }
    else {
        let pool = getPool();
        console.log("POOL: ", pool);
        console.log("ABC123", orderable.restaurant_id, orderable.orderable_name);
        
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            console.log("ABC123", orderable.restaurant_id, orderable.orderable_name);
            client.query(`SELECT HasOption.item_id, HasOption.option_name
            FROM (SELECT restaurant_id, item_id FROM Contain WHERE restaurant_id = $1 AND orderable_name = $2) AS RestaurantOptions
            JOIN HasOption ON RestaurantOptions.restaurant_id = HasOption.restaurant_id AND RestaurantOptions.item_id = HasOption.item_id`, [orderable.restaurant_id, orderable.orderable_name], (err, result) => {
                if (err) {
                    return console.error('Error executing query', err.stack);
                }
                let options = result.rows;
                console.log(options, "OPTIIIIIIS");
                console.log(orderable.options, "OPTIS2");
                console.log(orderable.options.length, options.length, "LEN");
                let invalid = false;
                for (let i = 0; i < orderable.options.length; i++) {
                    let found = false;
                    if (orderable.options[i] == "None") {
                        found = true;
                        break;
                    }
                    else {
                        for (let j = 0; j < options.length; j++) {
                            console.log((i + 1), options[j].item_id, orderable.options[i], options[j].option_name);
                            if (orderable.options[i] === options[j].option_name) {
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found) {
                        invalid = true;
                        break;
                    }
                }
                if (invalid) {
                    release()
                    response.sendStatus(403);
                    console.log('INVALIDDDDDDDDDd');
                }
                else {
                    // The box is valid
                    client.query('SELECT price FROM Orderable where orderable_name = $1', [orderable.orderable_name], (err, result) => {
                        release()
                        if (err) {
                            return console.error('Error executing query', err.stack)
                        }
                        console.log("ZAAAAAAAAAAAAAAAAAAAAA", result.rows[0].price);
                        orderable.price = result.rows[0].price;
                        request.session.box.push(orderable);
                        console.log("XD", orderable);
                        response.send(request.session.box);
                    })
                    console.log("XDDDD", orderable);
                    console.log('VALIDDDDDDDDDDDDDDDDDd');
                }
                console.log(request.body.restaurant_id, request.body.orderable_name);
                console.log(result.rows);
            })
        });
    }

    //console.log(request.body);
    //response.sendStatus(200);
}

removeFromBox = (request, response) => {
    let box = request.session.box;
    let index = request.query.index;
    if (box.length > index) {
        box.splice(index, 1);
    }
    response.send(request.session.box);
}

updateItemQuantity = (request, response) => {
    // index, quantity
    // less than 0 no
    // if 0 remove
    let box = request.session.box;
    let index = request.query.index;
    let qty = request.query.quantity;
    console.log("INDEX", index,"QTY", qty);
    if (box.length > index && qty >= 0) {
        console.log("A1");
        if (qty == 0) {
            box.splice(index, 1);
            console.log("A2");
        }
        else {
            console.log("A3");
            box[index].quantity = qty;
        }
    }
    console.log("A4");

    response.send(request.session.box);
}



getBoxRouter.get('/box/get', getBox);
addToBoxRouter.post('/box/add', addToBox);
updateBoxRouter.get('/box/update', updateItemQuantity);
removeFromBoxRouter.get('/box/remove', removeFromBox);
module.exports = {
    getBoxRouter,
    addToBoxRouter,
    updateBoxRouter,
    removeFromBoxRouter
};