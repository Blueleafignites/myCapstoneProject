const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenBlacklist = new Set();
require('dotenv').config();

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

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request:', email, password);

  const checkEmailQuery = `SELECT * FROM users WHERE email = ?`;
  connection.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Error executing database query:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    console.log('Query results:', results);

    if (results.length === 0) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      console.log('Password comparison result:', isMatch);

      if (!isMatch) {
        console.log('Invalid password');
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY);

      console.log('Login successful');
      res.json({ message: 'Login successful', token });
    });
  });
});

app.post('/logout', (req, res) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const tokenWithoutBearer = token.slice(7);
  const decodedToken = jwt.decode(tokenWithoutBearer);

  if (!decodedToken) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (tokenBlacklist.has(tokenWithoutBearer)) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  tokenBlacklist.add(tokenWithoutBearer);

  res.json({ message: 'Logout successful' });
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
  SELECT 
  tasks.task_id,
  tasks.list_id,
  tasks.priority_id,
  tasks.task_title,
  tasks.deadline,
  tasks.task_description,
  priorities.priority_color,
  GROUP_CONCAT(tags.tag_id) AS tag_ids,
  GROUP_CONCAT(tags.tag_color) AS tag_colors
  FROM 
    tasks
  LEFT JOIN 
    priorities
  ON 
    tasks.priority_id = priorities.priority_id
  LEFT JOIN 
    task_tags
  ON 
    tasks.task_id = task_tags.task_id
  LEFT JOIN 
    tags
  ON 
    task_tags.tag_id = tags.tag_id
  GROUP BY 
    tasks.task_id;
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

app.delete('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const deleteTagsQuery = `DELETE FROM task_tags WHERE task_id = ${taskId}`;
  const deleteTaskQuery = `DELETE FROM tasks WHERE task_id = ${taskId}`;

  connection.query(deleteTagsQuery, (err, results) => {
    if (err) throw err;
    connection.query(deleteTaskQuery, (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
});

app.put('/lists/:listId/tasks', (req, res) => {
  const targetListId = req.params.listId;
  const taskIds = req.body.taskIds;
  const taskIdsStr = taskIds && taskIds.length ? taskIds.join(',') : '';

  const moveTasksQuery = `UPDATE tasks SET list_id = ${targetListId} WHERE task_id IN (${taskIdsStr})`;

  connection.query(moveTasksQuery, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.put('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const updatedTask = req.body;

  const updateTaskQuery = `
    UPDATE tasks
    SET 
      task_title = '${updatedTask.task_title}',
      priority_id = ${updatedTask.priority_id},
      list_id = ${updatedTask.list_id},
      deadline = ${updatedTask.deadline !== null ? `'${updatedTask.deadline}'` : null},
      task_description = '${updatedTask.task_description}'
    WHERE task_id = ${taskId}
  `;

  const deleteTaskTagsQuery = `
    DELETE FROM task_tags WHERE task_id = ${taskId}
  `;

  const insertTaskTagsQuery = updatedTask.tags && updatedTask.tags.length > 0
    ? `INSERT INTO task_tags (task_id, tag_id)
     VALUES ${updatedTask.tags.map(tagId => `(${taskId}, ${tagId})`).join(',')}`
    : '';


  connection.query(updateTaskQuery, (err, updateResult) => {
    if (err) throw err;
    connection.query(deleteTaskTagsQuery, (err, deleteResult) => {
      if (err) throw err;

      if (updatedTask.tags && updatedTask.tags.length > 0) {
        connection.query(insertTaskTagsQuery, (err, insertResult) => {
          if (err) throw err;

          const selectTaskQuery = `
              SELECT 
                tasks.task_id,
                tasks.list_id,
                tasks.priority_id,
                tasks.task_title,
                tasks.deadline,
                tasks.task_description,
                priorities.priority_color,
                GROUP_CONCAT(tags.tag_id) AS tag_ids,
                GROUP_CONCAT(tags.tag_color) AS tag_colors
              FROM 
                tasks
              LEFT JOIN 
                priorities
              ON 
                tasks.priority_id = priorities.priority_id
              LEFT JOIN 
                task_tags
              ON 
                tasks.task_id = task_tags.task_id
              LEFT JOIN 
                tags
              ON 
                task_tags.tag_id = tags.tag_id
              WHERE tasks.task_id = ${taskId}
              GROUP BY 
                tasks.task_id;
            `;

          connection.query(selectTaskQuery, (err, selectResult) => {
            if (err) throw err;

            res.send(selectResult[0]);
          });
        });
      } else {
        // No tags to insert, proceed with selecting the task
        const selectTaskQuery = `
            SELECT 
              tasks.task_id,
              tasks.list_id,
              tasks.priority_id,
              tasks.task_title,
              tasks.deadline,
              tasks.task_description,
              priorities.priority_color,
              GROUP_CONCAT(tags.tag_id) AS tag_ids,
              GROUP_CONCAT(tags.tag_color) AS tag_colors
            FROM 
              tasks
            LEFT JOIN 
              priorities
            ON 
              tasks.priority_id = priorities.priority_id
            LEFT JOIN 
              task_tags
            ON 
              tasks.task_id = task_tags.task_id
            LEFT JOIN 
              tags
            ON 
              task_tags.tag_id = tags.tag_id
            WHERE tasks.task_id = ${taskId}
            GROUP BY 
              tasks.task_id;
          `;

        connection.query(selectTaskQuery, (err, selectResult) => {
          if (err) throw err;

          res.send(selectResult[0]);
        });
      }
    });
  });
});

app.post('/tasks', (req, res) => {
  const task = req.body;

  const query = `
    INSERT INTO tasks (list_id, priority_id, task_title, deadline, task_description)
    VALUES (?, ?, ?, ?, ?);
  `;
  const values = [task.list_id, task.priority_id, task.task_title, task.deadline, task.task_description];

  connection.query(query, values, (err, results) => {
    if (err) throw err;
    const taskId = results.insertId;

    if (task.tag_ids && task.tag_ids.length) {
      const tagIds = task.tag_ids.split(',');
      const insertTagQuery = `
        INSERT INTO task_tags (task_id, tag_id)
        VALUES ?
      `;
      const tagValues = tagIds.map(tagId => [taskId, tagId]);

      connection.query(insertTagQuery, [tagValues], (err, results) => {
        if (err) throw err;
        res.send({ taskId });
      });
    } else {
      res.send({ taskId });
    }
  });
});

app.put('/priorities/:id', (req, res) => {
  const priorityId = req.params.id;
  const updatedPriorityName = req.body.priority_name;
  const updatePriorityQuery = `
    UPDATE priorities
    SET
      priority_name = '${updatedPriorityName}'
    WHERE
      priority_id = ${priorityId}
  `;
  connection.query(updatePriorityQuery, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.delete('/tags/:tagId', (req, res) => {
  const tagId = req.params.tagId;
  const deleteTaskTagsQuery = `DELETE FROM task_tags WHERE tag_id = ${tagId}`;
  const deleteTagsQuery = `DELETE FROM tags WHERE tag_id = ${tagId}`;

  connection.query(deleteTaskTagsQuery, (err, taskTagsResults) => {
    if (err) throw err;
    connection.query(deleteTagsQuery, (err, tagsResult) => {
      if (err) throw err;
      res.send(tagsResult);
    });
  });
});

app.post('/tags', (req, res) => {
  const tag = req.body;

  const query = `
    INSERT INTO tags (tag_name, tag_color)
    VALUES (?, ?);
  `;
  const values = [tag.tag_name, tag.tag_color];

  connection.query(query, values, (err, results) => {
    if (err) throw err;
    const tagId = results.insertId;

    res.send({ tagId });
  });
});

app.put('/tags/:id', (req, res) => {
  const tagId = req.params.id;
  const updatedTag = req.body;
  const updateTagQuery = `
    UPDATE tags
    SET
      tag_name = '${updatedTag.tag_name}',
      tag_color = '${updatedTag.tag_color}'
    WHERE
      tag_id = ${tagId}
  `;

  connection.query(updateTagQuery, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.put('/priorities/color/:id', (req, res) => {
  const id = req.params.id;
  const color = req.body.color;
  const sql = 'UPDATE priorities SET priority_color = ? WHERE priority_id = ?';

  connection.query(sql, [color, id], (err, results, fields) => {
    if (err) throw err;
    res.send(results);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
