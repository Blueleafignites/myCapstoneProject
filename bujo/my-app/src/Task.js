import { useState, useEffect } from "react";
import './Task.css';

function Modal({ onClose, modalRef, task, priorities, tags, lists, tasks }) {
    const [taskTitle, setTaskTitle] = useState(task.title);
    const [selectedPriority, setSelectedPriority] = useState(priorities.find(p => p.name === task.priority) || null);
    const [selectedTags, setSelectedTags] = useState(task.tags.map(tagName => tags.find(t => t.name === tagName)));
    const [showDatePicker, setShowDatePicker] = useState(false);
    //const [selectedDeadline] = useState(task.deadline || new Date().toISOString().substr(0, 10));
    const [deadlineText, setDeadlineText] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showEditPriorityDropdown, setShowEditPriorityDropdown] = useState(false);
    const [clickedPriority, setClickedPriority] = useState(null);
    const [editedPriorityName, setEditedPriorityName] = useState("");
    const [hasChanges, setHasChanges] = useState(false);

    const [showTagDropdown, setShowTagDropdown] = useState(false);

    const handlePrioritySelection = (priority) => {
        if (selectedPriority != null && selectedPriority.name === priority.name) {
            setSelectedPriority(null);
        } else {
            setSelectedPriority(priority);
        }
    };

    const handleTagSelection = (tag) => {
        if (selectedTags.some((t) => t.name === tag.name)) {
            setSelectedTags(selectedTags.filter((t) => t.name !== tag.name));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleAddPriorityClick = () => {
        if (showTagDropdown) {
            setShowTagDropdown(false);
        }
        setShowPriorityDropdown(!showPriorityDropdown);
    };

    const handleEditPriorityDropdown = (priority) => {
        setClickedPriority(priority);
        setEditedPriorityName(priority.name);
        setShowPriorityDropdown(false);
        setShowEditPriorityDropdown(!showEditPriorityDropdown);
    };

    const handleConfirmEdit = () => {
        if (hasChanges) {
            setHasChanges(false);
        }
        setShowEditPriorityDropdown(false);
        setShowPriorityDropdown(true);
    };

    const handleArrowBackClick = () => {
        setHasChanges(false);
        setEditedPriorityName("");
        setShowEditPriorityDropdown(false);
        setShowPriorityDropdown(!showEditPriorityDropdown);
    };

    const handleCloseEditDropdown = () => {
        setShowEditPriorityDropdown(false);
        setShowPriorityDropdown(false);
    };

    const handleAddTagClick = () => {
        if (showPriorityDropdown) {
            setShowPriorityDropdown(false);
        }
        setShowTagDropdown(!showTagDropdown);
    };

    useEffect(() => {
        document.addEventListener("click", handleDocumentClick);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    const handleDocumentClick = (e) => {
        if (!e.target.closest(".dropdown") && !e.target.closest(".dropdown-tags")) {
            setShowPriorityDropdown(false);
            setShowTagDropdown(false);
            setShowEditPriorityDropdown(false);
        }
    };

    useEffect(() => {
        if (task.deadline) {
            setShowDatePicker(true);
            setDeadlineText(task.deadline.toISOString().substr(0, 10));
        } else {
            setDeadlineText(null);
        }
    }, [task]);

    const handleAddClick = () => {
        if (!task.deadline || deadlineText === null) {
            setDeadlineText(new Date().toISOString().substr(0, 10));
        }
        setShowDatePicker(!showDatePicker);
    };

    const handleRemoveClick = () => {
        setDeadlineText(null);
        setShowDatePicker(false);
    };

    const handleDeadlineChange = (event) => {
        setDeadlineText(event.target.value);
    };

    function handleSaveTask() {

        onClose();
    }

    function handleDelete() {
        setShowConfirmation(true);
        document.addEventListener('click', handleOutsideClick);
        document.body.classList.add('no-click');
    }

    function handleClose() {
        setShowConfirmation(false);
        document.body.classList.remove('no-click');
    }

    function handleConfirm() {
        const index = tasks.findIndex((t) => t.id === task.id);
        tasks.splice(index, 1);
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
                <form>
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
                                <div className="dropdown">
                                    {showPriorityDropdown && (
                                        <div className="dropdown-tags">
                                            <div className="dropdown-header">
                                                <div className="dropdown-title">
                                                    <p>Priorities</p>
                                                </div>
                                                <div className="dropdown-close">
                                                    <span className="material-symbols-outlined" onClick={handleCloseEditDropdown}>close</span>
                                                </div>
                                            </div>
                                            <hr></hr>
                                            <ul>
                                                {priorities.map((priority, index) => (
                                                    <li key={index}>
                                                        <label>
                                                            <input type="checkbox" checked={selectedPriority != null && selectedPriority.name === priority.name} onChange={() => handlePrioritySelection(priority)} />
                                                            <span className="priority" style={{ background: priority.color }}>{priority.name}</span>
                                                        </label>
                                                        <span className="material-symbols-outlined edit" onClick={() => handleEditPriorityDropdown(priority)}>edit</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {showEditPriorityDropdown && (
                                        <div className="dropdown-tags">
                                            <div className="header-container">
                                                <div className="arrow-back">
                                                    <span className="material-symbols-outlined" onClick={handleArrowBackClick}>arrow_back</span>
                                                </div>
                                                <div className="dropdown-title-edit">
                                                    <p>Edit Priority</p>
                                                </div>
                                                <div className="dropdown-close">
                                                    <span className="material-symbols-outlined" onClick={handleCloseEditDropdown}>close</span>
                                                </div>
                                            </div>
                                            <hr></hr>
                                            {clickedPriority && (
                                                <div className="edit-tag">
                                                    <span className="priority" style={{ background: clickedPriority.color }}>
                                                        {clickedPriority.name}
                                                    </span>
                                                </div>
                                            )}
                                            <label>Title
                                                <input
                                                    type="text"
                                                    value={editedPriorityName}
                                                    onChange={(e) => {
                                                        setEditedPriorityName(e.target.value);
                                                        setHasChanges(true);
                                                        if (clickedPriority) {
                                                            const newPriority = { ...clickedPriority, name: e.target.value };
                                                            setClickedPriority(newPriority);
                                                        }
                                                    }}
                                                />
                                            </label>
                                            <div className="dropdown-edit-buttons">
                                                <div>
                                                    <button type="button" onClick={handleConfirmEdit}>Save</button>
                                                </div>
                                                <div className="cancel-btn">
                                                    <button type="button">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="add-tags">
                                        {selectedPriority != null && (
                                            <div className="selected-tags">
                                                <div className="priorities">
                                                    <div className="priority" key="priority" style={{ background: selectedPriority.color }}>{selectedPriority.name}</div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="tagDrop-btn">
                                            <span className="material-symbols-outlined" onClick={handleAddPriorityClick}>add</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="taskTags">
                                <label htmlFor="taskTags" class="tags-label">Tags: </label>
                                <div className="dropdown">
                                    {showTagDropdown && (
                                        <div className="dropdown-tags">
                                            <div className="dropdown-close">
                                                <span className="material-symbols-outlined" onClick={handleCloseEditDropdown}>close</span>
                                            </div>
                                            <hr></hr>
                                            <ul>
                                                {tags.map((tag, index) => (
                                                    <li key={index}>
                                                        <label>
                                                            <input type="checkbox" checked={selectedTags.includes(tag)} onChange={() => handleTagSelection(tag)} />
                                                            <span className="tag" style={{ background: tag.color }}>{tag.name}</span>
                                                        </label>
                                                        <span className="material-symbols-outlined edit">edit</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="add-tags">
                                        {selectedTags.length > 0 && (
                                            <div className="selected-tags">
                                                <div className="tags">
                                                    {selectedTags.map((tag, index) => (
                                                        <div className="tag" key={index} style={{ background: tag.color }}>{tag.name}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="tagDrop-btn">
                                            <span className="material-symbols-outlined" onClick={handleAddTagClick}>add</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="deadline">
                                <label htmlFor="deadline">Deadline:</label>
                                {showDatePicker && (
                                    <input type="date" id="deadline" name="deadline" value={deadlineText} onChange={handleDeadlineChange} />
                                )}
                                <div className="add-deadline-btn">
                                    <span className="material-symbols-outlined" onClick={showDatePicker ? handleRemoveClick : handleAddClick}>
                                        {showDatePicker ? 'remove' : 'add'}
                                    </span>
                                </div>
                            </div>
                            <div className="task-list">
                                <label htmlFor="listSelect">Add to list: </label>
                                <select id="listSelect">

                                </select>
                            </div>
                        </div>
                        <div className="task-actions">
                            <div className="actions-button">
                                <button type="submit">Move</button>
                            </div>
                            <div className="actions-button">
                                <button type="submit">Archive</button>
                            </div>
                            <div className="actions-button delete-task">
                                <div className="delete-confirmation">
                                    <div className="delete-btn">
                                        <button type="button" onClick={handleDelete}>Delete</button>
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
                </form>
            </div>
        </div>
    );
}

export default Modal;