import { useState, useEffect } from "react";
import axios from 'axios';
import PriorityDropdown from "./priority";
import TagDropdown from "./tags";
import "./Task.css";

function Task({ onClose, modalRef, tasks, task, priorities, setPriorities, tags, setTags, lists, setTasks }) {
    const [taskTitle, setTaskTitle] = useState(task.task_title);
    const [selectedPriority, setSelectedPriority] = useState(task.priority_id ? priorities.find(p => p.priority_id === task.priority_id) : null);
    const [selectedTags, setSelectedTags] = useState(task.tag_ids ? task.tag_ids.split(",") : []);
    const [selectedList, setSelectedList] = useState(task.list_id || lists[0].id);
    const [selectedDeadline, setSelectedDeadline] = useState(null);
    const [taskDescription, setTaskDescription] = useState(task.task_description);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleListSelection = (event) => {
        const selectedValue = event.target.value;
        setSelectedList(selectedValue);
    };

    useEffect(() => {
        if (task.deadline) {
            setShowDatePicker(true);
            const deadlineDate = new Date(task.deadline);
            setSelectedDeadline(deadlineDate.toISOString().split('T')[0]);
        } else {
            setSelectedDeadline(null);
        }
    }, [task]);

    const handleAddClick = () => {
        if (!task.deadline === null) {
            setSelectedDeadline(new Date().toISOString().split('T')[0]);
        }
        setShowDatePicker(!showDatePicker);
    };

    const handleRemoveClick = () => {
        setSelectedDeadline(null);
        setShowDatePicker(false);
    };

    const handleDeadlineChange = (event) => {
        setSelectedDeadline(event.target.value);
    };

    async function handleSaveTask() {
        if (taskTitle.trim() === "") {
            alert("Task must have a title.");
        } else {
            const newTask = {
                task_title: taskTitle,
                priority_id: selectedPriority ? selectedPriority.priority_id : null,
                tags: selectedTags,
                list_id: selectedList,
                deadline: selectedDeadline,
                task_description: taskDescription,
            };

            try {
                if (task.task_id) {
                    const updatedTask = {
                        ...task,
                        ...newTask,
                    };

                    const updatedTasks = tasks.map((t) => {
                        if (t.task_id === task.task_id) {
                            return updatedTask;
                        }
                        return t;
                    });
                    setTasks(updatedTasks);

                    await axios.put(`http://localhost:3000/tasks/${task.task_id}`, updatedTask);
                } else {
                    const res = await axios.post('http://localhost:3000/tasks', newTask);
                    const addedTask = res.data.taskId;

                    setTasks((prevState) => [...prevState, addedTask]);
                }

                onClose();
                window.location.reload();
            } catch (error) {
                console.error(error);
            }
        }
    }

    function handleDeleteTask() {
        setShowConfirmation(!showConfirmation);
        document.addEventListener('click', handleOutsideClick);
        document.body.classList.add('no-click');
    }

    function handleClose() {
        setShowConfirmation(!showConfirmation);
        document.body.classList.remove('no-click');
    }

    async function handleConfirmDelete() {
        try {
            const res = await axios.delete(`http://localhost:3000/tasks/${task.task_id}`);
            const deletedTaskId = res.data.task_id;

            setTasks((prevState) => prevState.filter((task) => task.task_id !== deletedTaskId));
            onClose();
            setShowConfirmation(false);
            document.body.classList.remove('no-click');
        } catch (error) {
            console.error(error);
        }

        window.location.reload()
    }

    let confirmationOpened = false;

    function handleOutsideClick(event) {
        const confirmationContent = document.querySelector('.confirmation-content');
        const deleteBtn = document.querySelector('.delete-btn button');

        if (confirmationOpened && confirmationContent && !confirmationContent.contains(event.target) && event.target !== deleteBtn) {
            confirmationContent.classList.add('animation');
            setTimeout(() => confirmationContent.classList.remove('animation'), 500);
        }
    }

    document.addEventListener('click', () => {
        confirmationOpened = true;
    });

    return (
        <div className="modal" ref={modalRef}>
            <div className="modal-content">
                <div className="task-header">
                    <div className="task-title">
                        <input type="text" id="taskName" placeholder="Enter a title for this task..." value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
                    </div>
                    <div className="close-btn">
                        <span className="material-symbols-outlined" onClick={onClose}>close</span>
                    </div>
                </div>
                <div className="task-container">
                    <div className="task-info">
                        <div className="taskPriority">
                            <label htmlFor="taskPriority" className="priority-label">Priority:</label>
                            <PriorityDropdown task={task} priorities={priorities} setPriorities={setPriorities} selectedPriority={selectedPriority} setSelectedPriority={setSelectedPriority} />
                        </div>
                        <div className="taskTags">
                            <label htmlFor="taskTags" className="tags-label">Tags: </label>
                            <TagDropdown task={task} tags={tags} setTags={setTags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                        </div>
                        <div className="task-list">
                            <label htmlFor="listSelect">Add to list: </label>
                            <select id="listSelect" value={selectedList} onChange={handleListSelection}>
                                {lists.map((list) => (
                                    <option key={list.id} value={list.id}>{list.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="deadline">
                            <label htmlFor={`deadline-${task.task_id}`}>Deadline:</label>
                            {showDatePicker && (
                                <input type="date" id={`deadline-${task.task_id}`} name="deadline" value={selectedDeadline || ''} onChange={handleDeadlineChange} />
                            )}
                            <div className="add-deadline-btn">
                                <span className="material-symbols-outlined" onClick={showDatePicker ? handleRemoveClick : handleAddClick}>
                                    {showDatePicker ? "remove" : "add"}
                                </span>
                            </div>
                        </div>

                    </div>
                    <div className="task-actions">
                        <div className="actions-button">
                            <button>Share</button>
                        </div>
                        <div className="actions-button">
                            <button>Archive</button>
                        </div>
                        <div className="actions-button delete-task">
                            <div className="delete-confirmation">
                                <div className="delete-btn">
                                    <button type="button" onClick={handleDeleteTask}>Delete</button>
                                </div>
                                {showConfirmation && (
                                    <div className="confirmation-content">
                                        <div className="close-confirmation">
                                            <span className="material-symbols-outlined" onClick={handleClose}>close</span>
                                        </div>
                                        <p>Are you sure you want to delete this task? It's irreversible.</p>
                                        <div className="confirmation-buttons">
                                            <div>
                                                <button type="button" onClick={handleConfirmDelete}>Confirm</button>
                                            </div>
                                            <div className="cancel-btn">
                                                <button type="button" onClick={handleClose}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="task-description">
                    <label htmlFor="taskDescription">Description</label>
                    <textarea id="taskDescription" placeholder="Add a description..." value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
                </div>
                <div className="save-task">
                    <button onClick={handleSaveTask}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default Task;