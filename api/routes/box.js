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
}

removeFromBox = (request, response) => {
  let box = request.session.box;
  let index = request.query.index;
  if (box.length > index) {
    box.splice(index, 1);
    response.sendStatus(200);
  }
  else {
    response.sendStatus(403);
  }
    // index
}

updateItemQuantity = (request, response) => {
  // index, quantity
  // less than 0 no
  // if 0 remove
  let box = request.session.box;
  let index = request.query.index;
  let qty = request.query.quantity;
  if (box.length > index && qty >= 0) {
    if (qty == 0) {
      box.splice(index, 1);
    }
    else {
      box[index].quantity = qty;
    }
    response.sendStatus(200);
  }
  else {
    response.sendStatus(403);
  }

}

getBoxRouter.get('/box/get', getBox);
addToBoxRouter.post('/box/add', addToBox);
updateBoxRouter.post('/box/update', updateBox);
removeFromBoxRouter.delete('/box/remove', removeFromBox);
module.exports = {
    getBoxRouter,
    addToBoxRouter,
    updateBoxRouter,
    removeFromBoxRouter
};