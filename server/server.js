const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mettler02?',
  database: 'raven_bujo'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.get('/priorities', (req, res) => {
  const query = 'SELECT * FROM priorities';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/tags', (req, res) => {
    const query = 'SELECT * FROM tags';
    connection.query(query, (err, results) => {
      if (err) throw err;
      res.send(results);
    });
});

app.get('/tasks', (req, res) => {
    const query = 'SELECT * FROM tasks';
    connection.query(query, (err, results) => {
      if (err) throw err;
      res.send(results);
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
