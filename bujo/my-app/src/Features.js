import React from 'react';
import './features.css';

function Features() {
    return (
        <div className="features-body">
            <h1>What is Raven BuJo?</h1>
            <div>
                Glad you asked!<br></br>
                Raven Bujo is a web-based to-do app inspired by the bullet journal method. 
                It features a user-friendly three-column view, consisting of lists for the current day, month, and year. 
                Users have the flexibility to easily add, edit, or delete tasks within each list. 
                Additionally, Raven Bujo allows users to assign priorities to tasks, add relevant tags 
                for better organization, set deadlines, and provide detailed descriptions for each task.
            </div>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/FMgd993450I" frameborder="0"></iframe>
        </div>
    );
}

export default Features;