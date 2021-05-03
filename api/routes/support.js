var express = require('express');
var writeTicketRouter = express.Router();
var getTicketRouter = express.Router();
var issueWarningRouter = express.Router();
const getPool = require('../db');


writeTicket = (request, response) => {

}

getTicket = (request, response) => {

}

issueWarning = (request, response) => {

}

writeTicketRouter.post('/support/writeticket', writeTicket);
getTicketRouter.get('/support/getticket', getTicket);
issueWarningRouter.get('/support/warn', issueWarning);
module.exports = {
    writeTicketRouter,
    getTicketRouter,
    issueWarningRouter
};