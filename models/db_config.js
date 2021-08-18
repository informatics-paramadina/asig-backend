// import mysql from "mysql2";
import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config()

// async function connection() {
//     const conn = await mysql.createConnection({
//         host     : process.env.DB_HOST,
//         user     : process.env.DB_USER,
//         password : process.env.DB_PASSWORD,
//         database : 'asig'
//     })
    
//     const sql = `CREATE TABLE IF NOT EXISTS user 
//     ( 
//        id           INT PRIMARY KEY auto_increment,
//        uuid         VARCHAR(255) UNIQUE NOT NULL,
//        email        VARCHAR(200) UNIQUE NOT NULL, 
//        phone_number VARCHAR(25) NOT NULL, 
//        name         VARCHAR(200) NOT NULL,
//        password     VARCHAR(255) NOT NULL
//        role         ENUM('admin', 'user', 'player'),
//     )`;
    
//     await conn.execute(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//     })
// }

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : 'asig'
});

const sql = `CREATE TABLE IF NOT EXISTS user 
( 
   id           INT PRIMARY KEY auto_increment,
   uuid         VARCHAR(255) UNIQUE NOT NULL,
   email        VARCHAR(200) UNIQUE NOT NULL, 
   phone_number VARCHAR(25) NOT NULL, 
   name         VARCHAR(200) NOT NULL,
   password     VARCHAR(255) NOT NULL,
   role         ENUM('admin', 'user', 'player') NOT NULL
)`;

connection.execute(
    sql, function (err, result) {
        if (err) throw err;
        console.log(result);
});

export default connection
