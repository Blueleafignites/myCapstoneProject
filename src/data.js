import React, { useState, useEffect } from 'react';
import Lists from './Lists';
const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize('raven_bujo', 'root', 'Mettler02?', {
  host: 'localhost',
  dialect: 'mysql',
});

class Priority extends Model {}
Priority.init(
  {
    priority_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    priority_name: DataTypes.STRING,
    priority_color: DataTypes.STRING,
  },
  { sequelize, modelName: 'Priority', tableName: 'priorities' },
);

class Tag extends Model {}
Tag.init(
  {
    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tag_name: DataTypes.STRING,
    tag_color: DataTypes.STRING,
  },
  { sequelize, modelName: 'Tag', tableName: 'tags' },
);

class List extends Model {}
List.init(
  {
    list_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    list_name: DataTypes.STRING,
  },
  { sequelize, modelName: 'List', tableName: 'lists' },
);

class Task extends Model {}
Task.init(
  {
    task_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    list_id: DataTypes.INTEGER,
    priority_id: DataTypes.INTEGER,
    tag_id: DataTypes.INTEGER,
    task_title: DataTypes.STRING,
    deadline: DataTypes.DATE,
  },
  { sequelize, modelName: 'Task', tableName: 'tasks' },
);

function Data() {
  const [priorities, setPriorities] = useState([]);
  const [tags, setTags] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const priorityData = await Priority.findAll({
          attributes: ['priority_name', 'priority_color'],
        });
        setPriorities(priorityData);
      } catch (error) {
        console.error('Error retrieving priorities:', error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const tagData = await Tag.findAll({
          attributes: ['tag_name', 'tag_color'],
        });
        setTags(tagData);
      } catch (error) {
        console.error('Error retrieving tags:', error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const taskData = await Task.findAll();
        setTasks(taskData);
      } catch (error) {
        console.error('Error retrieving tasks:', error);
      }
    })();
  }, []);

  return (
    <>
      <Lists priorities={priorities} tags={tags} tasks={tasks} />
    </>
  );
}

export default Data;