import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lists from "./Lists";

function Data() {
    const [priorities, setPriorities] = useState([]);
    const [tags, setTags] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get('/api/priorities')
            .then(response => {
                setPriorities(response.data);
            })
            .catch(error => console.error('Error retrieving priorities:', error));
    }, []);

    useEffect(() => {
        axios.get('/api/tags')
            .then(response => {
                setTags(response.data);
            })
            .catch(error => console.error('Error retrieving tags:', error));
    }, []);

    useEffect(() => {
        axios.get('/api/tasks')
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => console.error('Error retrieving tasks:', error));
    }, []);

    return (
        <>
            <Lists priorities={priorities} tags={tags} tasks={tasks} />
        </>

    );
}

export default Data;