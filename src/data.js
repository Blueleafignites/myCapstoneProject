import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListContainer from "./Lists";
import Lists from "./Lists";
import Modal from "./Task";

function MyComponent() {
    const [priorities, setPriorities] = useState([]);
    const [tags, setTags] = useState([]);
    const [lists, setLists] = useState([]);
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
        axios.get('/api/lists')
            .then(response => {
                setLists(response.data);
            })
            .catch(error => console.error('Error retrieving lists:', error));
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
            <ListContainer priorities={priorities} tags={tags} lists={lists} tasks={tasks} />
            <Lists lists={lists} />
            <Modal priorities={priorities} tags={tags} tasks={tasks} />
        </>

    );
}

export default MyComponent;