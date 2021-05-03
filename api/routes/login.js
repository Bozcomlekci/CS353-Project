var express = require('express');
var router = express.Router();
const getPool = require('../db');


login = (request, response) => {
  console.log(request.body);
  
  let sess = request.session;
  if (!sess.loggedIn) {
    username = request.body.username;
    password = request.body.password;
  
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
          sess.user = {username: username}
          sess.loggedIn = true;
        }
        else {
          sess.loggedIn = false;
        }
        response.send(sess);
      })
    });
  }
  else {
    response.send(sess);
  }
}

router.post('/login', login);
module.exports = router;