var mysql = require('mysql');
const dotenv = require('custom-env').env(true);
console.log(process.env.DB_PORT);
console.log(process.env.DB_HOST);
console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);

function createDBConnection() {
    return mysql.createConnection({
        multipleStatements: true,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD
    });
}
console.log("Conexão ligada" + createDBConnection());
module.exports = function () {
    return createDBConnection;
}