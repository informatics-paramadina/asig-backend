const express = require("express");
const cors = require("cors");

const knex = require("knex");
// const path = require("path");

const db = knex({
  client: 'mysql2',
  connection: {
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : 'asig'
  }
});

const app = express();
const port = process.env.PORT || 3001;

// connection();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// wildcard 404
app.use("*", (req, res) => res.status(404).send('<h1>Sorry, page not found!</h1>'));

app.listen(port, () => {
  console.log(`ASIG app listening at http://localhost:${port}`)
})