var express = require('express');
var router = express.Router();
const getPool = require('../db');


signup = (request, response) => {
  console.log(request.body);
  
  
  let pool = getPool();
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }

    username = request.body.username;
    first_name = request.body.first_name;
    last_name = request.body.last_name;
    birthdate = request.body.birthdate;
    email = request.body.email;
    password = request.body.password;

    console.log(username, first_name, last_name, birthdate, email, password);
    
    client.query("INSERT INTO Users VALUES($1, $2, $3, $4, $5, $6)", 
    [username, first_name, last_name, birthdate, email, password], (err, result) => {

      if (err) {
        response.status(401).send("Signup Unsuccessful");
      }

    
      else {
        type = request.body.type;
        
        //if type is customer insert into Customer
        if(type.localeCompare("Customer") == 0){
            client.query("INSERT INTO Customer VALUES($1, 0)", [username], (err1, result1) => {
                console.log(result1);
                if(err) {
                    response.status(401).send("Signup Unsuccessful");
                }
                else {
                    response.send("Signup Succesful");
                }
            })
        }


        //if type is restaurant owner insert into RestaurantOwner
        else if(type.localeCompare("RestaurantOwner") == 0){
            client.query("INSERT INTO RestaurantOwner VALUES($1, 0)", [username], (err1, result1) => {
                if(err) {
                    response.status(401).send("Signup Unsuccessful");
                }
                else {
                    response.send("Signup Succesful");
                }
            })
        }

        //if type is support staff insert into SupportStaff
        else if(type.localeCompare("SupportStaff") == 0){
            client.query("INSERT INTO SupportStaff VALUES($1, 0, true, NULL)", [username], (err1, result1) => {
                if(err) {
                    response.status(401).send("Signup Unsuccessful");
                }
                else {
                    response.send("Signup Succesful");
                }
            })
        }

        //if type is delivery person insert into DeliveryPerson
        else if(type.localeCompare("DeliveryPerson") == 0){
            client.query("INSERT INTO DeliveryPerson VALUES($1, 0, false)", [username], (err1, result1) => {
                if(err) {
                    response.status(401).send("Signup Unsuccessful");
                }
                else {
                    response.send("Signup Succesful");
                }
            })
        }   
    }       
    })
  });

}

router.post('/signup', signup);
module.exports = router;