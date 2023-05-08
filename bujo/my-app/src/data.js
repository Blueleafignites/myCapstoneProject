import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lists from './Lists';

function Data() {
  const [priorities, setPriorities] = useState([]);
  const [tags, setTags] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchPriorities = async () => {
      const res = await axios.get('http://localhost:3000/priorities');
      setPriorities(res.data);
    };

    const fetchTags = async () => {
      const res = await axios.get('http://localhost:3000/tags');
      setTags(res.data);
    };

    const fetchTasks = async () => {
      const res = await axios.get('http://localhost:3000/tasks');
      setTasks(res.data);
    };

    fetchPriorities();
    fetchTags();
    fetchTasks();
  }, []);

  const deleteTasksByListId = async (listId) => {
    try {
      await axios.delete(`http://localhost:3000/lists/${listId}/tasks`);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTaskById = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const moveAllTasksToList = async (movedTaskIds, targetListId) => {
    try {
      await axios.put(`http://localhost:3000/lists/${targetListId}/tasks`, {
        taskIds: movedTaskIds,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getTasks = (sortByDueDate, sortAlphabetically) => {
    return axios.get('/tasks', {
      params: {
        sortByDueDate,
        sortAlphabetically
      }
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  };

  const updateTask = async (taskId, updatedTask) => {
    try {
      const res = await axios.put(`http://localhost:3000/tasks/${taskId}`, updatedTask);
      return res.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const addTask = async (newTask) => {
    try {
      const res = await axios.post('http://localhost:3000/tasks', newTask);
      return res.data.taskId;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return (
    <>
      <Lists priorities={priorities} setPriorities={setPriorities} tags={tags} setTags={setTags} tasks={tasks} setTasks={setTasks} deleteTasksByListId={deleteTasksByListId} deleteTaskById={deleteTaskById} moveAllTasksToList={moveAllTasksToList} getTasks={getTasks} updateTask={updateTask} addTask={addTask} />
    </>
  );
}

export default Data;
