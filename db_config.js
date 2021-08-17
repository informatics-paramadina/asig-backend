import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config()

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD
});
 
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    let sql = "CREATE DATABASE IF NOT EXISTS asig";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
    console.log('connected as id ' + connection.threadId);
});

export default connection
