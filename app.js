const express = require("express");
const cors = require("cors");

const knex = require("knex");
const projectRoutes = require("./routes/project.routes");
const usersRoutes = require("./routes/users.routes");
const eventRoutes = require("./routes/event.routes");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static('images'));

app.get('/', (req, res) => {
  res.send(`
    <h2>buat test</h2>
    <p><strong>get:</strong> /test</p>
    <p><strong>post:</strong> /test-upload (key=logo)</p>`)
})

app.use('/', [projectRoutes, usersRoutes, eventRoutes]);

// wildcard 404
app.use("*", (req, res) => res.status(404).send('<h1>Sorry, page not found!</h1>'));

app.use(function errorHandler (err, req, res, next) {
  if (err.message === "bad") res.status(400).send('failed');
  else res.status(500).send(`<h1>Sorry, something is not right!</h1><p>${err}</p>`);
})

app.listen(port, () => {
  console.log(`ASIG app listening at http://localhost:${port}`)
})