import express from "express";
import cors from "cors";
import connection from "./db_config.js";

const app = express();
const port = process.env.PORT || 3001;



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