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

  return (
    <>
      <Lists priorities={priorities} setPriorities={setPriorities} tags={tags} setTags={setTags} tasks={tasks} setTasks={setTasks} deleteTasksByListId={deleteTasksByListId} deleteTaskById={deleteTaskById} />
    </>
  );
}

export default Data;
