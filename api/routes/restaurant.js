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
var updateOrderableRouter = express.Router();
var removeOrderableRouter = express.Router();
var addItemToOrderableRouter = express.Router();
var getItemsOfOrderableRouter = express.Router();
var setOrderableItemQuantityRouter =  express.Router();
var getOptionsForItemRouter = express.Router();
var addOptionToItemRouter = express.Router();
var removeOptionFromItemRouter = express.Router();
var addOrderableRouter = express.Router();
const getPool = require('../db');

listRestaurants = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query('SELECT restaurant_id, name, average_rating, is_open, city, county FROM Restaurant NATURAL JOIN Address', (err, result) => {
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
        if (request.query.in_name != undefined) {
            client.query('SELECT option_name FROM (SELECT DISTINCT option_name FROM HasOption NATURAL JOIN Option_ WHERE item_id = $1 AND restaurant_id = $2) AS opts WHERE option_name LIKE $3;', [request.query.item_id, request.session.user.restaurant.restaurant_id, '%' + request.query.in_name + '%'], (err, result) => {
                if (err) {
                    return console.error('Error executing query', err.stack)
                }

                console.log(result.rows,request.query.item_id, request.session.user.restaurant.restaurant_id);
                let options = [];
                for (const option of result.rows) {
                    options.push({name: option.option_name, have_option: true});
                }
                console.log(options, 'OPTTTTTTTTTTTTTTTTTT');
                client.query('SELECT name FROM (SELECT DISTINCT name FROM Option_ WHERE name NOT IN (SELECT DISTINCT option_name FROM HasOption NATURAL JOIN Option_ WHERE item_id = $1 and restaurant_id = $2)) AS opts WHERE name LIKE $3;', [request.query.item_id, request.session.user.restaurant.restaurant_id, '%' + request.query.in_name + '%'], (err, result) => {
                    release()
                    if (err) {
                        return console.error('Error executing query', err.stack)
                    }

                    for (const option of result.rows) {
                        options.push({name: option.name, have_option: false});
                    }
                    response.send(options);
                })
            })
        }
        else {
            client.query('SELECT DISTINCT option_name FROM HasOption NATURAL JOIN Option_ WHERE item_id = $1 AND restaurant_id = $2;', [request.query.item_id, request.session.user.restaurant.restaurant_id], (err, result) => {
                if (err) {
                    return console.error('Error executing query', err.stack)
                }

                console.log(result.rows,request.query.item_id, request.session.user.restaurant.restaurant_id);
                let options = [];
                for (const option of result.rows) {
                    options.push({name: option.option_name, have_option: true});
                }
                console.log(options, 'OPTTTTTTTTTTTTTTTTTT');
                client.query('SELECT name FROM Option_ WHERE name NOT IN (SELECT DISTINCT option_name FROM HasOption NATURAL JOIN Option_ WHERE item_id = $1 and restaurant_id = $2);', [request.query.item_id, request.session.user.restaurant.restaurant_id], (err, result) => {
                    release()
                    if (err) {
                        return console.error('Error executing query', err.stack)
                    }

                    for (const option of result.rows) {
                        options.push({name: option.name, have_option: false});
                    }
                    response.send(options);
                })
            })
        }
    });
}

addOptionToItem = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query('INSERT INTO HasOption VALUES ($1, $2, $3);', [request.session.user.restaurant.restaurant_id, request.body.option_name, request.body.item_id], (err, result) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }

            response.sendStatus(200);
        })
    });
}

removeOptionFromItem = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query('DELETE FROM HasOption WHERE restaurant_id = $1 AND option_name = $2 AND item_id = $3;', [request.session.user.restaurant.restaurant_id, request.body.option_name, request.body.item_id], (err, result) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }

            response.sendStatus(200);
        })
    });
}

addOrderable = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query(`INSERT INTO Orderable Values($1, $2, $3, $4, $5)`, [request.session.user.restaurant.restaurant_id, request.body.orderable_name,request.body.discount, request.body.price, request.body.instock], (err, result) => {
            release();
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            response.sendStatus(200);
        });
    });
}

addItemToOrderable = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query(`INSERT INTO Contain Values($1, $2, $3, $4) ON Conflict (restaurant_id, orderable_name, item_id)
DO UPDATE SET quantity = EXCLUDED.quantity + Contain.quantity`, [request.session.user.restaurant.restaurant_id, request.body.orderable_name, request.body.item_id, request.body.quantity], (err, result) => {
            release();
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            response.sendStatus(200);
        });
    });
}

getItemsOfOrderable = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query(`SELECT * FROM Contain NATURAL JOIN Item WHERE restaurant_id = $1 AND orderable_name = $2`, [request.session.user.restaurant.restaurant_id, request.query.orderable_name], (err, result) => {
            release();
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            response.send(result.rows);
        });
    });
}

setOrderableItemQuantity = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        console.log(request.body.quantity, request.session.user.restaurant.restaurant_id, request.body.orderable_name, request.body.item_id)
        client.query(`UPDATE Contain SET quantity = $1 WHERE restaurant_id = $2 AND orderable_name = $3 AND item_id = $4`, [request.body.quantity, request.session.user.restaurant.restaurant_id, request.body.orderable_name, request.body.item_id], (err, result) => {
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            client.query(`DELETE FROM Contain WHERE quantity = 0`, (err, result) => {
                release();
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
            });
            response.sendStatus(200);
        });
    });
}


removeOrderable = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query("DELETE FROM Contain WHERE orderable_name = $1 AND restaurant_id = $2;", [request.body.orderable_name, request.session.user.restaurant.restaurant_id], (err, result) => {
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            client.query("DELETE FROM Orderable WHERE orderable_name = $1 AND restaurant_id = $2;", [request.body.orderable_name, request.session.user.restaurant.restaurant_id], (err, result) => {
                release();
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
            });
            response.sendStatus(200);
        });
    });
}

updateOrderable = (request, response) => {
    let pool = getPool();
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query("UPDATE Orderable SET discount = $1, price = $2, instock = $3 WHERE orderable_name = $4 AND restaurant_id = $5;", [request.body.discount, request.body.price, request.body.instock, request.body.orderable_name, request.session.user.restaurant.restaurant_id], (err, result) => {
            release();
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            response.sendStatus(200);
        });
    });
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
            client.query(`SELECT Orderable.restaurant_id, Orderable.orderable_name, discount, price, instock, Item.item_id, quantity, name, content, size, itemtype, option_name
            FROM Orderable LEFT OUTER JOIN Contain ON Orderable.restaurant_id = Contain.restaurant_id AND Orderable.orderable_name = Contain.orderable_name
            LEFT OUTER JOIN Item ON Contain.item_id = Item.item_id
            LEFT OUTER JOIN (SELECT * FROM HasOption WHERE restaurant_id = $1) AS RestaurantOptions  ON RestaurantOptions.item_id = Item.item_id
            WHERE Orderable.restaurant_id = $1;`, [request.query.restaurant_id], (err, result) => {
                release()
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
                response.send(formatOrderables(result));
            });
        }
        else {
            client.query(`SELECT Orderable.restaurant_id, Orderable.orderable_name, discount, price, instock, Item.item_id, quantity, name, content, size, itemtype, option_name
            FROM Orderable LEFT OUTER JOIN Contain ON Orderable.restaurant_id = Contain.restaurant_id AND Orderable.orderable_name = Contain.orderable_name
            LEFT OUTER JOIN Item ON Contain.item_id = Item.item_id
            LEFT OUTER JOIN (SELECT * FROM HasOption WHERE restaurant_id = $1) AS RestaurantOptions  ON RestaurantOptions.item_id = Item.item_id
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
addOrderableRouter.post('/restaurant/add_orderable', addOrderable);
listOrderablesRouter.get('/restaurant/list_orderables', listOrderables);
listRestaurantsRouter.get('/restaurant/list_restaurants', listRestaurants);
getOptionsRouter.get('/restaurant/get_options', getOptionsForItem);
addItemRouter.post('/restaurant/add_item', addItem);
listItemsRouter.get('/restaurant/list_items', listItems);
updateOrderableRouter.post('/restaurant/update_orderable', updateOrderable);
removeOrderableRouter.post('/restaurant/remove_orderable', removeOrderable);
addItemToOrderableRouter.post('/restaurant/add_item_to_orderable', addItemToOrderable);
getItemsOfOrderableRouter.get('/restaurant/get_items_of_orderable', getItemsOfOrderable);
setOrderableItemQuantityRouter.post('/restaurant/set_orderable_item_quantity', setOrderableItemQuantity);
getOptionsForItemRouter.get('/restaurant/get_options_for_item', getOptionsForItem);
addOptionToItemRouter.post('/restaurant/add_option_to_item', addOptionToItem);
removeOptionFromItemRouter.post('/restaurant/remove_option_from_item', removeOptionFromItem);
module.exports = {
    listOrderablesRouter,
    listRestaurantsRouter,
    listItemsRouter,
    getOptionsRouter,
    addItemRouter,
    updateOrderableRouter,
    removeOrderableRouter,
    addItemToOrderableRouter,
    getItemsOfOrderableRouter,
    setOrderableItemQuantityRouter,
    getOptionsForItemRouter,
    addOptionToItemRouter,
    removeOptionFromItemRouter,
    addOrderableRouter
};