const { Pool } = require('pg');
const conf = {
    user: 'postgres',
    host: 'localhost',
    database: 'CS353Project',
    password: 'cs353dbpw',
    port: 5432,
}

let pool = new Pool(conf);

async function dropTables() {
    const tables = [
        'ConsistOf','Contain', 'HasOption', 'Specify',  'HasReview', 'CompleteOrder', 'SeeReview', 'HasAddress', 'IssueWarning', 'AssignedToTicket', 'SubmitTicket', 'HasTicket', 'Favorite', 'Contact', 'RestaurantContact', 'Owns', 'CreateReview', 'RequestForDelivery', 'DeliveredBy', 'DeliveredTo', 'SupportStaff', 'SupportTicket', 'DeliveryPerson', 'Review', 'Orderable', 'Option_', 'Item', 'Orders', 'Customer', 'RestaurantOwner', 'Restaurant', 'Address', 'Phone', 'Users'
       ]
    const client = await pool.connect();
    for (const tableName of tables) {
      try {
        const res = await client.query('DROP TABLE IF EXISTS ' + tableName);
      } catch (err) {
        console.log(err.stack);
      }
   }
   client.end();
}

async function createTables() {
    const client = await pool.connect();
    try {
        await client.query(`CREATE TABLE Item ( item_id SERIAL PRIMARY KEY, name VARCHAR, 
            content VARCHAR, size VARCHAR, itemtype VARCHAR);`);

        await client.query(`CREATE TABLE Option_ ( name VARCHAR, PRIMARY KEY ( name ));`);

        await client.query(`CREATE TABLE Orders ( order_id SERIAL PRIMARY KEY, 
                    status VARCHAR, order_time TIMESTAMP, time_to_deliver TIMESTAMP, 
                    delivery_time TIMESTAMP, has_plastic BOOLEAN, note VARCHAR);`);

        await client.query(`CREATE TABLE Review ( review_id SERIAL PRIMARY KEY, delivery_rating FLOAT, restaurant_rating FLOAT, 
                    restaurant_comment VARCHAR, delivery_comment VARCHAR, restaurant_response VARCHAR, 
                    order_id INTEGER UNIQUE, 
                    FOREIGN KEY (order_id) REFERENCES Orders(order_id));`);

        await client.query(`CREATE TABLE Address ( address_id SERIAL PRIMARY KEY, explanation VARCHAR, street VARCHAR, 
                    street_number INTEGER, apt_number INTEGER, city VARCHAR, 
                    county VARCHAR, zip VARCHAR);`);

        await client.query(`CREATE TABLE Restaurant ( restaurant_id SERIAL PRIMARY KEY, name VARCHAR, money FLOAT, 
                    average_rating FLOAT, is_open BOOLEAN, address_id INTEGER UNIQUE,
                    FOREIGN KEY(address_id) references Address(address_id));`);

        await client.query(`CREATE TABLE Orderable ( restaurant_id INTEGER, orderable_name VARCHAR, discount FLOAT, 
                    price FLOAT, instock BOOLEAN, 
                    PRIMARY KEY ( restaurant_id, orderable_name), 
                    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(restaurant_id));`);

        await client.query(`CREATE TABLE Users ( username VARCHAR, first_name VARCHAR, 
                    last_name VARCHAR, birthdate DATE, email VARCHAR, 
                    password VARCHAR, PRIMARY KEY ( username ));`);

        await client.query(`CREATE TABLE DeliveryPerson (username VARCHAR , average_rating FLOAT, is_busy BOOLEAN,
                            PRIMARY KEY(username),
                            FOREIGN KEY (username) references Users(username));`);

        await client.query(`CREATE TABLE Customer ( username VARCHAR, credit FLOAT, 
                    PRIMARY KEY ( username ), 
                    FOREIGN KEY (username) REFERENCES Users (username));`);

        await client.query(`CREATE TABLE RestaurantOwner ( username VARCHAR, warning_count INTEGER, 
                    PRIMARY KEY ( username ), 
                    FOREIGN KEY (username) REFERENCES Users (username));`);

  

        await client.query(`CREATE TABLE SupportTicket ( ticket_id SERIAL PRIMARY KEY, date DATE, subject VARCHAR, 
                    content VARCHAR, response VARCHAR);`);

        await client.query(`CREATE TABLE SupportStaff ( username VARCHAR, rank INTEGER, is_free BOOLEAN, current_ticket_id INTEGER, 
                 PRIMARY KEY ( username ), 
                FOREIGN KEY (username) REFERENCES Users (username),
                FOREIGN KEY (current_ticket_id) REFERENCES SupportTicket(ticket_id));`);

        await client.query(`CREATE TABLE Phone ( phone_number VARCHAR, PRIMARY KEY ( phone_number ));`);

        await client.query(`CREATE TABLE Contain ( restaurant_id INTEGER, orderable_name VARCHAR, 
                    item_id INTEGER, quantity INTEGER, 
                    PRIMARY KEY ( restaurant_id, orderable_name, item_id ), 
                    FOREIGN KEY (orderable_name, restaurant_id) references Orderable(orderable_name, restaurant_id), 
                    FOREIGN KEY (item_id) references Item(item_id));`);

        await client.query(`CREATE TABLE HasOption ( restaurant_id INTEGER, option_name VARCHAR, 
                    item_id INTEGER, 
                    PRIMARY KEY ( restaurant_id, option_name, item_id ), 
                    FOREIGN KEY (restaurant_id ) references Restaurant (restaurant_id),
                    FOREIGN KEY (option_name) references Option_(name), 
                    FOREIGN KEY (item_id) references Item(item_id));`);

        await client.query(`CREATE TABLE Specify ( item_id INTEGER, option_name VARCHAR, 
                    order_id INTEGER, restaurant_id INTEGER, orderable_name VARCHAR, in_order_index INTEGER,
                    PRIMARY KEY ( item_id, option_name, order_id, restaurant_id, orderable_name, in_order_index ), 
                    FOREIGN KEY (item_id) references Item(item_id), 
                    FOREIGN KEY (option_name) references Option_(name),
                    FOREIGN KEY (order_id) references Orders(order_id),
                    FOREIGN KEY (orderable_name, restaurant_id) references Orderable(orderable_name, restaurant_id));`);

        await client.query(`CREATE TABLE ConsistOf (order_id INTEGER, restaurant_id INTEGER, orderable_name VARCHAR, in_order_index INTEGER, quantity INTEGER,
                        PRIMARY KEY (order_id, restaurant_id, orderable_name, in_order_index),
                        FOREIGN KEY (order_id) references Orders (order_id),
                        FOREIGN KEY (orderable_name, restaurant_id) references Orderable(orderable_name, restaurant_id));`);

        await client.query(`CREATE TABLE HasReview ( restaurant_id INTEGER, review_id INTEGER,
                        PRIMARY KEY(review_id),
                        FOREIGN KEY (restaurant_id) references Restaurant (restaurant_id),
                        FOREIGN KEY (review_id) references Review (review_id));`);

        await client.query(`CREATE TABLE CompleteOrder (order_id INTEGER, username VARCHAR, restaurant_id INTEGER,
                            PRIMARY KEY(order_id),
                            FOREIGN KEY(username) references Customer(username),
                            FOREIGN KEY(restaurant_id) references Restaurant(restaurant_id),
                            FOREIGN KEY(order_id) references Orders(order_id));`);

        await client.query(`CREATE TABLE SeeReview(review_id INTEGER, username VARCHAR,
                        PRIMARY KEY (review_id),
                        FOREIGN KEY (review_id) references Review(review_id),
                        FOREIGN KEY (username) references DeliveryPerson (username));`);

        await client.query(`CREATE TABLE HasAddress(address_id INTEGER, username VARCHAR, name VARCHAR,
                        PRIMARY KEY(address_id),
                        FOREIGN KEY(username) references Customer(username),
                        FOREIGN KEY(address_id) references Address(address_id));`);

        await client.query(`CREATE TABLE IssueWarning (support_staff_username VARCHAR, restaurant_owner_username VARCHAR, issue_time TIMESTAMP,
                            PRIMARY KEY(support_staff_username, restaurant_owner_username, issue_time),
                            FOREIGN KEY(support_staff_username) references SupportStaff(username),
                            FOREIGN KEY(restaurant_owner_username) references RestaurantOwner(username));`);

        await client.query(`CREATE TABLE AssignedToTicket(ticket_id INTEGER, username VARCHAR,
                                PRIMARY KEY(ticket_id),
                                FOREIGN KEY(username) references SupportStaff(username),
                                FOREIGN KEY(ticket_id) references SupportTicket(ticket_id));`);

        await client.query(`CREATE TABLE SubmitTicket(ticket_id INTEGER, username VARCHAR,
                                PRIMARY KEY(ticket_id, username),
                                FOREIGN KEY(username) references Customer(username),
                                FOREIGN KEY(ticket_id) references SupportTicket(ticket_id));`);

        await client.query(`CREATE TABLE HasTicket(ticket_id INTEGER, order_id INTEGER,
                                PRIMARY KEY(ticket_id, order_id),
                                FOREIGN KEY(order_id) references Orders(order_id),
                                FOREIGN KEY(ticket_id) references SupportTicket(ticket_id));`);

        await client.query(`CREATE TABLE Favorite(username VARCHAR, restaurant_id INTEGER,
                                PRIMARY KEY(username, restaurant_id),
                                FOREIGN KEY(username) references Customer(username),
                                FOREIGN KEY(restaurant_id) references Restaurant(restaurant_id));`);

        await client.query(`CREATE TABLE Contact(username VARCHAR, phone_number VARCHAR, name VARCHAR,
                    PRIMARY KEY(username, phone_number),
                    FOREIGN KEY(username) references Customer(username),
                    FOREIGN KEY(phone_number) references Phone(phone_number));`);

        await client.query(`CREATE TABLE RestaurantContact(restaurant_id INTEGER, phone_number VARCHAR,
                    PRIMARY KEY(restaurant_id, phone_number),
                    FOREIGN KEY(restaurant_id) references Restaurant(restaurant_id),
                    FOREIGN KEY(phone_number) references Phone(phone_number));`);

        await client.query(`CREATE TABLE Owns(restaurant_id INTEGER, username VARCHAR,
                    PRIMARY KEY(restaurant_id),
                    FOREIGN KEY(restaurant_id) references Restaurant(restaurant_id),
                    FOREIGN KEY(username) references RestaurantOwner(username));`);

        await client.query(`CREATE TABLE CreateReview(review_id INTEGER, username VARCHAR,
                    PRIMARY KEY(review_id),
                    FOREIGN KEY(review_id) references Review(review_id),
                    FOREIGN KEY(username) references Customer(username));`);

        await client.query(`CREATE TABLE RequestForDelivery(username VARCHAR, order_id INTEGER, acceptance BOOLEAN,
                    PRIMARY KEY(username, order_id),
                    FOREIGN KEY(username) references DeliveryPerson(username),
                    FOREIGN KEY(order_id) references Orders(order_id));`);

        await client.query(`CREATE TABLE DeliveredBy(order_id INTEGER, username VARCHAR,
                    PRIMARY KEY(order_id),
                    FOREIGN KEY(order_id) references Orders(order_id),
                    FOREIGN KEY(username) references DeliveryPerson(username));`);

        await client.query(`CREATE TABLE DeliveredTo(order_id INTEGER, address_id INTEGER,
                    PRIMARY KEY(order_id),
                    FOREIGN KEY(address_id) references Address(address_id),
                    FOREIGN KEY(order_id) references Orders(order_id));`);
        
        await client.query('CREATE INDEX CompleteOrderUsernameIndex ON CompleteOrder (username);'); 

        await client.query('CREATE INDEX CompleteOrderRestaurantIdIndex ON CompleteOrder (restaurant_id);');  
        
        await client.query('CREATE INDEX SeeReviewIndex ON SeeReview (username)');

        await client.query('CREATE VIEW delivery_person_order_view as '
        + ' with Delivery_Person_Orders AS ( '
        + ' SELECT username, Orders.order_id, Rest_Address.address_id as rest_address_id,  '
        + ' Rest_Address.explanation as rest_explanation, Rest_Address.street as rest_street, Rest_Address.street_number as rest_street_no, '
        + ' Rest_Address.apt_number rest_apt_no, Rest_Address.city as rest_city_no, Rest_Address.county rest_county, Rest_Address.zip rest_zip,  '
        + ' Cust_Addresss.address_id, '
        + ' Cust_Addresss.explanation, Cust_Addresss.street, Cust_Addresss.street_number,'
        + ' Cust_Addresss.apt_number, Cust_Addresss.city, Cust_Addresss.county, Cust_Addresss.zip '
        + ' FROM Orders NATURAL JOIN Restaurant NATURAL JOIN DeliveredBy, Address Rest_Address, Address Cust_Addresss, DeliveredTo delTo '
        + ' WHERE Rest_Address.address_id = Restaurant.address_id and Cust_Addresss.address_id = delTo.address_id ), '
        + ' Delivery_Person_Orders_Prices AS ( '
        + ' SELECT order_id as oid, sum(price*quantity) as totalPrice FROM Orders NATURAL JOIN ConsistOf NATURAL JOIN Orderable '
        + ' group by(order_id) ) '
        + ' select * from Delivery_Person_Orders_Prices d1, Delivery_Person_Orders d2 ' 
        + ' where d1.oid = d2.order_id; ');

        await client.query(`CREATE OR REPLACE FUNCTION assigned_ticket_insertion()
        RETURNS TRIGGER
        AS
        $$
            DECLARE support_username VARCHAR;
        
        BEGIN
        IF EXISTS (SELECT * FROM SupportStaff WHERE is_free = true) THEN
            
            SELECT username into support_username FROM SupportStaff WHERE is_free=true LIMIT 1;
            
            UPDATE SupportStaff SET is_free = false, current_ticket_id = NEW.ticket_id WHERE username = support_username;
            INSERT INTO AssignedToTicket VALUES(NEW.ticket_id, support_username);
        END IF;
        RETURN NEW;
        END;
        $$
        LANGUAGE 'plpgsql';
        
        
        CREATE TRIGGER assign_new_ticket
          AFTER INSERT ON
          SupportTicket
          FOR EACH ROW
          EXECUTE PROCEDURE assigned_ticket_insertion();
          
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        CREATE OR REPLACE FUNCTION assign_update()
        RETURNS TRIGGER
        AS
        $$
            DECLARE ticket_id_var INTEGER;
        
        BEGIN
        IF EXISTS (SELECT * FROM SupportTicket S WHERE S.ticket_id NOT IN (select ASA.ticket_id from AssignedToTicket ASA)) THEN
            
            SELECT S.ticket_id into ticket_id_var FROM SupportTicket S 
                   WHERE S.ticket_id NOT IN (select ASA.ticket_id from AssignedToTicket ASA) LIMIT 1;
            
                  
            UPDATE SupportStaff SET is_free = false, current_ticket_id = ticket_id_var WHERE username = NEW.username;
            INSERT INTO AssignedToTicket VALUES(ticket_id_var, NEW.username);
        END IF;
        RETURN NEW;
        END;
        $$
        LANGUAGE 'plpgsql';
        
        
        
        CREATE TRIGGER assign_existing_ticket AFTER UPDATE OF is_free ON SupportStaff
        FOR EACH ROW
        WHEN (pg_trigger_depth() = 0)
        EXECUTE PROCEDURE assign_update();`);

        

        

        
    } catch (err) {
        console.log(err.stack);
    }
    client.end();
}

async function addRecords() {
    const client = await pool.connect();
    try {
        await client.query("INSERT INTO Users VALUES ('admin', 'admin', 'admin', '2000-03-18', 'admin@gmail.com', 'admin');");
        await client.query("INSERT INTO Customer VALUES ('admin', 200);");
        await client.query("INSERT INTO Item VALUES (DEFAULT, 'burger', 'patty', 'normal', 'food');");
        await client.query("INSERT INTO Item VALUES (DEFAULT, 'cola', '1 can', '330 ml', 'beverage');");
        await client.query("INSERT INTO Address VALUES (1, 'Burger King Address', 'jump street', '21', '21', 'ankara', 'cankaya', '06000');");
        await client.query("INSERT INTO Restaurant VALUES (DEFAULT, 'Burger King', '0', '8.5', true, '1');");
        await client.query("INSERT INTO Orderable VALUES ('1', 'burger menu', '0', '20', 'true');");
        await client.query("INSERT INTO Contain VALUES ('1', 'burger menu', '1', '1');");
        await client.query("INSERT INTO Contain VALUES ('1', 'burger menu', '2', '1');");
        await client.query("INSERT INTO Option_ VALUES ('hot sauce');");
        await client.query("INSERT INTO Option_ VALUES ('bbq sauce');");
        await client.query("INSERT INTO Option_ VALUES ('cheese');");
        await client.query("INSERT INTO Option_ VALUES ('zero');");
        await client.query("INSERT INTO Option_ VALUES ('cherry');");
        await client.query("INSERT INTO Hasoption VALUES ('1', 'bbq sauce', '1');");
        await client.query("INSERT INTO Hasoption VALUES ('1', 'cheese', '1');");
        await client.query("INSERT INTO Hasoption VALUES ('1', 'zero', '2');");
        
        
        await client.query("INSERT INTO Address VALUES (2, 'Good Restaurant Address', 'Street 19', '21', '21', 'ankara', 'cankaya', '06400');");
        await client.query("INSERT INTO Restaurant VALUES (DEFAULT, 'Good Restaurant', '0', '9.9', true, '2');");
        await client.query("INSERT INTO Orderable VALUES ('2', 'menu1', '15', '40', 'true');");
        await client.query("INSERT INTO Item VALUES (DEFAULT, 'chicken burger', 'chicken patty, bread', 'normal', 'food');");
        await client.query("INSERT INTO Contain VALUES ('2', 'menu1', '3', '2');");
        await client.query("INSERT INTO Contain VALUES ('2', 'menu1', '2', '2');");
        await client.query("INSERT INTO Orderable VALUES ('2', 'menu2', '15', '15', 'true');");
        await client.query("INSERT INTO Item VALUES (DEFAULT, 'vegetable wrap', 'vegetables in a wrap', 'normal', 'food');");
        await client.query("INSERT INTO Contain VALUES ('2', 'menu2', '4', '1');");

        await client.query("INSERT INTO Hasoption VALUES ('2', 'hot sauce', '3');");
        await client.query("INSERT INTO Hasoption VALUES ('2', 'hot sauce', '4');");
        await client.query("INSERT INTO Hasoption VALUES ('2', 'cheese', '3');");
        await client.query("INSERT INTO Hasoption VALUES ('2', 'cherry', '2');");


        await client.query("INSERT INTO Users VALUES ('Joe', 'Joe', 'Joe', '2016-03-03', 'Joe@gmail.com', 'Joe');");
        await client.query("INSERT INTO RestaurantOwner VALUES ('Joe', 0);");
        await client.query("INSERT INTO Owns VALUES (1, 'Joe');");
        await client.query("INSERT INTO Owns VALUES (2, 'Joe');");
        await client.query("INSERT INTO Users VALUES ('ABC', 'ABC', 'ABC', '2016-03-03', 'ABC@gmail.com', 'ABC');");
        await client.query("INSERT INTO SupportStaff VALUES ('ABC', 1, true);");
        await client.query("INSERT INTO Users VALUES ('Delivery1', 'Delivery1', 'Delivery1', '2016-03-03', 'Delivery1@gmail.com', 'Delivery1');");
        await client.query("INSERT INTO DeliveryPerson VALUES ('Delivery1', 10, false);");
        
    } catch (err) {
        console.log(err.stack);
    }
    client.end();
}

dropTables()
    .then(success => createTables())
    .then(success => addRecords())
    .then(success => pool.end());
