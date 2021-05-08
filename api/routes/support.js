var express = require('express');
var writeTicketRouter = express.Router();
var getTicketRouter = express.Router();
var issueWarningRouter = express.Router();
var assignTicketRouter = express.Router();
const getPool = require('../db');
var pool = getPool();

writeTicket = (request, response) => {
    ticket_id = request.body.ticket_id;
    date = request.body.date;
    subject = request.body.subject;
    content = request.body.content;
    username = request.body.username;
    type = request.body.type;
    

    if (type.localeCompare("Customers") == 0) {
        pool.query("INSERT INTO SupportTickets VALUES($1, $2, $3, $4, NULL)", [ticket_id, date, subject, content], (error, result) => {
            if (error) {
                response.status(401).send("Error Creating Support Ticket");
            }
            else {
                pool.query("INSERT INTO SubmitTicket VALUES($1, $2)", [ticket_id, username], (error1, result) => {
                    if (error1) {
                        response.status(401).send("Error Creating Support Ticket");
                    }
                    else {
                        response.status(200).send("Support Ticket Successfully Created");
                        assignTicket(request, response); // May want to call later
                    }
                } )
                response.status(200).send("Error Creating Support Ticket");
            }
        } )
    }
    else {
        supportResponse = request.body.supportResponse;
        pool.query("UPDATE SupportTickets SET response = $1 WHERE EXISTS(SELECT * FROM AssignedToTicket NATURAL JOIN SupportTicket WHERE response = NULL AND username = $2)",
            [supportResponse, username], (error, result) => {
                if (error) {
                    response.status(401).send("Error Creating Support Ticket")
                }
                else {
                    response.status(200).send("Response Sent for the Support Ticket");
                }
            })
    }
}

assignTicket = (request, response) => {
    username = request.body.username;
    pool.query("SELECT FIRST(username) FROM SupportStaff WHERE is_free = 1", (error1, freeSupport) => {
        if (error1) {
            response.status(401).send("Error Assigning Support Ticket")
        }
        else {
            pool.query("UPDATE SupportStaff SET is_free = 0 WHERE username = $1", [freeSupport], (error2, result2) => {
                if (error2) {
                    response.status(401).send("Error Assigning Support Ticket")
                }
                else {
                    pool.query("INSERT INTO AssignedToTicket VALUES($1, $2)", [ticket_id, freeSupport], (error3, result3) => {
                        if (error3) {
                            response.status(401).send("Error Assigning Support Ticket")
                        }
                        else {
                            response.status(200).send("Support Ticket Successfully Assigned");
                        }
                    })
                }
            })
        }
    } )
}

getTicket = (request, response) => {
    ticket_id = request.body.ticket_id;
    pool.query("SELECT * FROM SupportTickets WHERE ticked_id = $1", [ticket_id], (error, result) => {
        if (error) {
            response.status(401).send("Error Returning Support Ticket")
        }
        else {
            response.status(200).send("Support Ticket Successfully Retrieved");
            return result;
        }
    })
}

issueWarning = (request, response) => {
    username = request.body.username;
    ownername = request.body.ownername;
    issue_time = request.body.issue_time;
    pool.query("INSERT INTO IssueWarning VALUES($1, $2, $3)", [username, ownername, issue_time], (error, result) => {
        if (error) {
            response.status(401).send("Error Issuing Warning")
        }
        else {
            pool.query("UPDATE RestaurantOwner SET warning_count = warning_count + 1 WHERE username = ownername", [ownername], (error2, result2) => {
                if (error2) {
                    response.status(401).send("Error Issuing Warning")
                }
                else {
                    response.status(200).send("Warning Successfully Issued");
                }
            })
        }
    })
}

writeTicketRouter.post('/support/writeticket', writeTicket);
getTicketRouter.get('/support/getticket', getTicket);
issueWarningRouter.get('/support/warn', issueWarning);
assignTicketRouter.get('/support/assignTicket', assignTicket);

module.exports = {
    writeTicketRouter,
    getTicketRouter,
    issueWarningRouter,
    assignTicketRouter
};