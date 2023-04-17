const express = require('express');
const cors = require('cors');
const { Sequelize, Model, DataTypes } = require('sequelize');

const app = express();
const port = 3001;

const sequelize = new Sequelize('raven_bujo', 'root', 'Mettler02?', {
    host: 'localhost',
    dialect: 'mysql',
});

app.use(cors());

class Priority extends Model {}
Priority.init({
    priority_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    priority_name: DataTypes.STRING,
    priority_color: DataTypes.STRING
}, { sequelize, modelName: 'Priority', tableName: 'priorities' });

class Tag extends Model {}
Tag.init({
    tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tag_name: DataTypes.STRING,
    tag_color: DataTypes.STRING
}, { sequelize, modelName: 'Tag', tableName: 'tags' });

class List extends Model {}
List.init({
    list_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    list_name: DataTypes.STRING
}, { sequelize, modelName: 'List', tableName: 'lists' });

class Task extends Model {}
Task.init({
    task_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    list_id: DataTypes.INTEGER,
    priority_id: DataTypes.INTEGER,
    tag_id: DataTypes.INTEGER,
    task_title: DataTypes.STRING,
    deadline: DataTypes.DATE
}, { sequelize, modelName: 'Task', tableName: 'tasks' });

app.get('/priorities', async (req, res) => {
    try {
        const priorities = await Priority.findAll({
            attributes: ['priority_name', 'priority_color']
        });
        res.send(priorities);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});

app.get('/tags', async (req, res) => {
    try {
        const tags = await Tag.findAll({
            attributes: ['tag_name', 'tag_color']
        });
        res.send(tags);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});

app.get('/lists', async (req, res) => {
    try {
        const lists = await List.findAll({
            attributes: ['list_name']
        });
        res.send(lists);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL database.');
    } catch (error) {
        console.error('Error connecting to MySQL database:', error);
    }
});
