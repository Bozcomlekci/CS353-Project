var express = require('express');
var router = express.Router();


logout = (request, response) => {
  request.session.loggedIn = false;
  response.send(request.session);
}

router.get('/logout', logout);
module.exports = router;