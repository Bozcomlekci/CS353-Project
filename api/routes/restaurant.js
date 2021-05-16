const { response } = require('express');
var express = require('express');
// to be changed
var listRestaurantsRouter = express.Router();
var writeReviewRouter = express.Router();
var getReviewRouter = express.Router();
var listOrderablesRouter = express.Router();
var getOptionsRouter = express.Router();
var addItemRouter = express.Router();
var listItemsRouter = express.Router();
const getPool = require('../db');

listRestaurants = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query('SELECT restaurant_id, name, average_rating, is_open, city, county FROM Restaurant JOIN Address ON Restaurant.address_id = Address.address_id', (err, result) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            response.send(result.rows);
        })
    });
}

addItem = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query("INSERT INTO Item VALUES (DEFAULT, $1, $2, $3, $4)", [request.body.name, request.body.content, request.body.size, request.body.itemtype], (err, result) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            response.sendStatus(200);
        })
    });
}

addOption = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query('SELECT * FROM Users where username = $1 and password = $2', [username, password], (err, result) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }

            if (result.rows.length == 1) {
                sess.user = { username: username }
                sess.loggedIn = true;
            }
            else {
                sess.loggedIn = false;
            }
            response.send(sess);
        })
    });
}

getOptionsForItem = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query('SELECT option_name FROM HasOption JOIN Option_ ON HasOption.option_name = Option_.name WHERE item_id = $1 and restaurant_id = $2;', [request.query.item_id, request.query.restaurant_id], (err, result) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }

            let options = [];
            for (const option of result.rows) {
                options.push(option.option_name);
            }
            response.send(options);
        })
    });
}

addOptionToItem = (request, response) => {
    // check which restaurant the request is coming from
    // check if restaurant owner, then see which restaurant they are currently operating on
}

removeOptionFromItem = (request, response) => {
    // similar to above
}

addOrderable = (request, response) => {

}

removeOrderable = (request, response) => {

}

updateOrderable = (request, response) => {

}

listItems = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        if (request.query.in_name != undefined) {
            client.query("SELECT * FROM Item WHERE name LIKE $1;", ['%' + request.query.in_name + '%'], (err, result) => {
                release()
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
                console.log(result.rows);
                response.send(result.rows);
            });
        }
        else {
            client.query("SELECT * FROM Item;", (err, result) => {
                release()
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
                response.send(result.rows);
            });
        }
    });
}

function formatOrderables(result) {
    let formatted_result = [];
    let orderable_name = undefined;
    let orderable_item_name = undefined;
    let orderable_item = undefined;
    let orderable = undefined;
    //for (const item of result.rows) {
    console.log(result.rows)
    for (let i = 0; i < result.rows.length;) {
        let item = result.rows[i];
        console.log(item);

        orderable_name = item.orderable_name;
        orderable = {
            orderable_name: item.orderable_name,
            discount: item.discount,
            price: item.price,
            instock: item.instock,
            items: []
        };
        while (orderable_name == item.orderable_name) {
            let b = false;
            orderable_item_name = item.name
            orderable_item = {
                item_id: item.item_id,
                quantity: item.quantity,
                name: item.name,
                content: item.content,
                size: item.size,
                itemtype: item.itemtype,
                options: []
            };
            while (orderable_item_name == item.name) {
                if (item.option_name != null) {
                    orderable_item.options.push(item.option_name)
                }
                i++;
                item = result.rows[i];
                if (i == result.rows.length) {
                    b = true;
                    break;
                }
            }
            orderable.items.push(orderable_item);
            if (b) {
                break;
            }
        }
        formatted_result.push(orderable);
    }
    return formatted_result;
}

listOrderables = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        //client.query(`SELECT Contain.restaurant_id, Contain.orderable_name, discount, price, instock, Item.item_id, quantity, name, content, size, itemtype, option_name
        //FROM Orderable JOIN Contain ON Orderable.restaurant_id = Contain.restaurant_id AND Orderable.orderable_name = Contain.orderable_name
        //JOIN Item ON Contain.item_id = Item.item_id
        //LEFT OUTER JOIN HasOption ON HasOption.item_id = Item.item_id
        //WHERE Orderable.restaurant_id = $1;`, [request.query.restaurant_id], (err, result) => {
        if (request.query.in_name == undefined) {
            client.query(`SELECT Contain.restaurant_id, Contain.orderable_name, discount, price, instock, Item.item_id, quantity, name, content, size, itemtype, option_name
            FROM Orderable JOIN Contain ON Orderable.restaurant_id = Contain.restaurant_id AND Orderable.orderable_name = Contain.orderable_name
            JOIN Item ON Contain.item_id = Item.item_id
            LEFT OUTER JOIN (SELECT * FROM HasOption WHERE restaurant_id = 1) AS RestaurantOptions  ON RestaurantOptions.item_id = Item.item_id
            WHERE Orderable.restaurant_id = $1;`, [request.query.restaurant_id], (err, result) => {
                release()
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
                response.send(formatOrderables(result));
            });
        }
        else {
            client.query(`SELECT Contain.restaurant_id, Contain.orderable_name, discount, price, instock, Item.item_id, quantity, name, content, size, itemtype, option_name
            FROM Orderable JOIN Contain ON Orderable.restaurant_id = Contain.restaurant_id AND Orderable.orderable_name = Contain.orderable_name
            JOIN Item ON Contain.item_id = Item.item_id
            LEFT OUTER JOIN (SELECT * FROM HasOption WHERE restaurant_id = 1) AS RestaurantOptions  ON RestaurantOptions.item_id = Item.item_id
            WHERE Orderable.restaurant_id = $1 AND Contain.orderable_name LIKE $2;`, [request.query.restaurant_id, "%" + request.query.in_name + "%"], (err, result) => {
                release()
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
                response.send(formatOrderables(result));
            });
        }
    });
}

// to be changed
listOrderablesRouter.get('/restaurant/list_orderables', listOrderables);
listRestaurantsRouter.get('/restaurant/list_restaurants', listRestaurants);
getOptionsRouter.get('/restaurant/get_options', getOptionsForItem);
addItemRouter.post('/restaurant/add_item', addItem);
listItemsRouter.get('/restaurant/list_items', listItems);
module.exports = {
    listOrderablesRouter,
    listRestaurantsRouter,
    listItemsRouter,
    getOptionsRouter,
    addItemRouter
};