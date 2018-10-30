var mysql = require('mysql');

function createDBConnection(){
    return mysql.createConnection({
        host: process.env.Host,
        port: process.env.Port,
        user: 'azure',
        database:'studyja',
        password: process.env.Password
    });
}
console.log("Conexão ligada" + createDBConnection());
module.exports=function(){
    return createDBConnection;
}