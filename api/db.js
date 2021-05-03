const { Pool } = require('pg');
const conf = {
    user: 'postgres',
    host: 'localhost',
    database: 'CS353Project',
    password: 'cs353dbpw',
    port: 5432,
}

let pool;

function getPool() {
    if (pool) {
        console.log("DB pool already exists, returning it");
    }
    else {
        console.log("Creating DB pool");        
        pool = new Pool(conf);
    }
    return pool;
}

module.exports = getPool;