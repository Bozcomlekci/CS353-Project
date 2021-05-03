var express = require('express');
var getBoxRouter = express.Router();
var addToBoxRouter = express.Router();
var removeFromBoxRouter = express.Router();
var updateBoxRouter = express.Router();
const getPool = require('../db');

getBox = (request, response) => {

}

addToBox = (request, response) => {

}

removeFromBox = (request, response) => {

}

updateBox = (request, response) => {

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