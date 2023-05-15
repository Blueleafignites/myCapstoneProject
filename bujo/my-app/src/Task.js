import { useState, useEffect } from "react";
import PriorityDropdown from "./priority";
import TagDropdown from "./tags";
import './Task.css';

function Task({ onClose, modalRef, task, priorities, setPriorities, tags, setTags, lists, setTasks, deleteTaskById, updateTask, addTask, updatePriorityName, deleteTag }) {
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

    function handleSaveTask() {
        if (!taskTitle) {
            alert("Task must have a title.")
        } else {
            const updatedTask = {
                task_title: taskTitle,
                priority_id: selectedPriority ? selectedPriority.priority_id : null,
                tags: selectedTags,
                list_id: selectedList,
                deadline: selectedDeadline,
                task_description: taskDescription,
            };
    
            console.log("Title: ", taskTitle);
            console.log("Priority: ", selectedPriority ? selectedPriority.priority_id : null);
            console.log("Tag(s): ", selectedTags);
            console.log("List: ", selectedList);
            console.log("Deadline: ", selectedDeadline);
            console.log("Description: ", taskDescription);
    
            if (task.task_id) {
                updateTask(task.task_id, updatedTask);
            } else {
                addTask(updatedTask);
            }
    
            onClose();
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
            await deleteTaskById(task.task_id);
            setTasks((prevState) => prevState.filter((t) => t.task_id !== task.task_id));

            onClose();
            setShowConfirmation(false);
            document.body.classList.remove('no-click');
        } catch (error) {
            console.error(error);
        }
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
                            <PriorityDropdown task={task} priorities={priorities} setPriorities={setPriorities} selectedPriority={selectedPriority} setSelectedPriority={setSelectedPriority} updatePriorityName={updatePriorityName} />
                        </div>
                        <div className="taskTags">
                            <label htmlFor="taskTags" className="tags-label">Tags: </label>
                            <TagDropdown task={task} tags={tags} setTags={setTags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} deleteTag={deleteTag} />
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