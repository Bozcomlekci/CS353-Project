const e = require('express');
var express = require('express');
const session = require('express-session');
var searchRouter = express.Router();

const getPool = require('../db');


search_method = (request, response) => {
    sess = request.session;
    if(sess.loggedIn){
        search_value = request.query.search_value;
        what_to_search =request.query.what_to_search;
        let pool = getPool();
        pool.connect((err, client, release) => {
            if (err) {

              return console.error('Error acquiring client', err.stack)
            }

            if(what_to_search.localeCompare("Item") == 0){
                search_value = '%' + search_value + '%';
                client.query("select * from Orderable Natural Join Contain NATURAL JOIN Item join Restaurant on Restaurant.restaurant_id = Orderable.restaurant_id where Item.name like $1 or Orderable_name like $1;", 
                [search_value], (err1, result1) => { 
                    if(err1){
                        console.log(err1);
                        release();
                        response.status(401).send("Get Info Unsuccessful");
                    }
                    else{

                        
                        release();
                        response.status(200).json(result1.rows);
                    }
                    })
            }
            
            
            else if (what_to_search.localeCompare("Restaurant") == 0){
                search_value = '%' + search_value + '%';
                client.query("select * from Restaurant NATURAL JOIN Orderable NATURAL JOIN Address where restaurant.name like $1 ;", 
                [search_value], (err1, result1) => { 
                    if(err1){
                        console.log(err1);
                        release();
                        response.status(401).send("Get Info Unsuccessful");
                    }
                    else{
                        release();
                        response.status(200).json(result1.rows);
                    }
                })
            }
            else if(what_to_search.localeCompare("Address") == 0){
                client.query("select * from Restaurant NATURAL JOIN Orderable NATURAL JOIN Address where street like $1 or city like $1 or county like $1;", 
                [search_value], (err1, result1) => { 
                    if(err1){
                        release();
                        response.status(401).send("Get Info Unsuccessful");
                    }
                    else{
                        release();
                        response.status(200).json(result1.rows);
                    }
                })
            }
            else{
                release();
                response.status(401).send("Get Info Unsuccessful");
            }
        })
    }
}


searchRouter.get('/search', search_method);
module.exports = {
    searchRouter,
};