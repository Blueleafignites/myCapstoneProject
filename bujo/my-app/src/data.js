import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lists from './Lists';

/*
  https://www.digitalocean.com/community/tutorials/react-axios-react

  Fetches data from my API using Axios and sets the fetched data into state variables for priorities, tags, and tasks. 
  The fetched data is then passed as props to another component called "Lists."
*/
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
      <Lists priorities={priorities} setPriorities={setPriorities} tags={tags} setTags={setTags} tasks={tasks} setTasks={setTasks} />
    </>
  );
}

export default Data;
