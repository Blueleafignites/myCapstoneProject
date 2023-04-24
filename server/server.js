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
  const query = `
    SELECT tasks.*, priorities.priority_color, GROUP_CONCAT(DISTINCT tags.tag_color ORDER BY tags.tag_id SEPARATOR ', ') AS tag_colors
    FROM tasks
    LEFT JOIN priorities ON tasks.priority_id = priorities.priority_id
    LEFT JOIN task_tags ON tasks.task_id = task_tags.task_id
    LEFT JOIN tags ON task_tags.tag_id = tags.tag_id
    GROUP BY tasks.task_id
  `;

  connection.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.delete('/lists/:listId/tasks', (req, res) => {
  const listId = req.params.listId;
  const deleteTagsQuery = `DELETE FROM task_tags WHERE task_id IN (SELECT task_id FROM tasks WHERE list_id = ${listId})`;
  const deleteTasksQuery = `DELETE FROM tasks WHERE list_id = ${listId}`;

  connection.query(deleteTagsQuery, (err, results) => {
    if (err) throw err;
    connection.query(deleteTasksQuery, (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
