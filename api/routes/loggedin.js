var express = require('express');
var router = express.Router();


loggedin = (request, response) => {
  if (!request.session.loggedIn) {
    request.session.loggedIn = false;
  }
  response.send(request.session);
}

router.get('/loggedin', loggedin);
module.exports = router;