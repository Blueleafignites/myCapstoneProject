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

  return (
    <>
      <Lists priorities={priorities} tags={tags} tasks={tasks} />
    </>
  );
}

export default Data;