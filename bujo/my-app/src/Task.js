import { useState } from "react";
import PriorityDropdown from "./labels";
import TagDropdown from "./tags";
import './Task.css';

function Modal({ onClose, modalRef, task, priorities, setPriorities, tags, setTags, lists, tasks }) {
    const [taskTitle, setTaskTitle] = useState(task.task_title);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedList, setSelectedList] = useState(task.list_id);

    const handleListSelection = (event) => {
        const selectedValue = event.target.value;
        setSelectedList(selectedValue);
    };

    function handleSaveTask() {
        onClose();
    }

    function handleDeleteTask() {
        setShowConfirmation(true);
        document.addEventListener('click', handleOutsideClick);
        document.body.classList.add('no-click');
    }

    function handleClose() {
        setShowConfirmation(false);
        document.body.classList.remove('no-click');
    }

    function handleConfirm() {
        onClose();
        setShowConfirmation(false);
        document.body.classList.remove('no-click');
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
                            <PriorityDropdown task={task} priorities={priorities} setPriorities={setPriorities} tags={tags} setTags={setTags} />
                        </div>
                        <div className="taskTags">
                            <label htmlFor="taskTags" class="tags-label">Tags: </label>
                            <TagDropdown task={task} priorities={priorities} setPriorities={setPriorities} tags={tags} setTags={setTags} />
                        </div>
                        <div className="task-list">
                            <label htmlFor="listSelect">Add to list: </label>
                            <select id="listSelect" value={selectedList} onChange={handleListSelection}>
                                {lists.map((list) => (
                                    <option key={list.id} value={list.id}>
                                        {list.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>
                    <div className="task-actions">
                        <div className="actions-button">
                            <button type="submit">Share</button>
                        </div>
                        <div className="actions-button">
                            <button type="submit">Archive</button>
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
                                                <button type="button" onClick={handleConfirm}>Confirm</button>
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
                    <textarea id="taskDescription" placeholder="Add a description..." />
                </div>
                <div className="save-task">
                    <button onClick={handleSaveTask}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;