import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Renders a dropdown interface for users to select a priority for a task and allows users to edit a priority's name
function PriorityDropdown({ task, priorities, setPriorities, selectedPriority, setSelectedPriority }) {
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showEditPriorityDropdown, setShowEditPriorityDropdown] = useState(false);
    const [clickedPriority, setClickedPriority] = useState(null);
    const [editedPriorityName, setEditedPriorityName] = useState("");
    const [hasChanges, setHasChanges] = useState(false);

    const handleAddPriorityClick = () => {
        setShowPriorityDropdown(!showPriorityDropdown);
    };

    const handlePrioritySelection = (priority) => {
        if (selectedPriority != null && selectedPriority.priority_id === priority.priority_id) {
            setSelectedPriority(null);
            task.priority_id = null;
        } else {
            setSelectedPriority(priority);
            task.priority_id = priority.priority_id;
        }
    };
    const defaultPriority = task.priority_id;

    useEffect(() => {
        document.addEventListener("click", handleDocumentClick);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    const handleDocumentClick = (e) => {
        if (!e.target.closest(".dropdown") && !e.target.closest(".dropdown-tags")) {
            setShowPriorityDropdown(false);
        }
    };

    const handleEditPriorityDropdown = (priority) => {
        setClickedPriority(priority);
        setEditedPriorityName(priority.priority_name);

        setShowPriorityDropdown(false);
        setShowEditPriorityDropdown(!showEditPriorityDropdown);
    };
    
    const handleSaveClick = async () => {
        if (!hasChanges) {
            return;
        }
        if (!editedPriorityName.trim()) {
            alert('Priority name cannot be empty.');
            return;
        }

        const updatedPriority = {
            priority_name: editedPriorityName,
        };

        try {
            const res = await axios.put(`http://localhost:3000/priorities/${clickedPriority.priority_id}`, updatedPriority);
            const updatedPriorities = priorities.map((priority) => {
                if (priority.priority_id === clickedPriority.priority_id) {
                    return { ...priority, priority_name: editedPriorityName };
                }
                return priority;
            });

            setPriorities(updatedPriorities);
            if (selectedPriority && selectedPriority.priority_id === clickedPriority.priority_id) {
                setSelectedPriority({ ...selectedPriority, priority_name: editedPriorityName });
            }

            setClickedPriority(null);
            setEditedPriorityName("");
            setHasChanges(false);

            setShowEditPriorityDropdown(false);

            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const handleGoBackClick = () => {
        setHasChanges(false);
        setEditedPriorityName("");

        setShowEditPriorityDropdown(false);
        setShowPriorityDropdown(true);
    };

    return (
        <div className="dropdown">
            {showPriorityDropdown && (
                <div className="dropdown-tags">
                    <div className="dropdown-header">
                        <div className="dropdown-title">
                            <p>Priorities</p>
                        </div>
                        <div className="dropdown-close">
                            <span className="material-symbols-outlined" onClick={() => setShowPriorityDropdown(false)}>close</span>
                        </div>
                    </div>
                    <hr />
                    <ul>
                        {priorities.map((priority) => (
                            <li key={priority.priority_id}>
                                <label>
                                    <input type="checkbox" value={priority.priority_id} checked={defaultPriority === priority.priority_id} onChange={() => handlePrioritySelection(priority)} />
                                    <span className="priority" style={{ background: priority.priority_color }}>{priority.priority_name}</span>
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
                            <span className="material-symbols-outlined" onClick={handleGoBackClick}>arrow_back</span>
                        </div>
                        <div className="dropdown-title-edit">
                            <p>Edit Priority</p>
                        </div>
                        <div className="dropdown-close">
                            <span className="material-symbols-outlined" onClick={() => setShowEditPriorityDropdown(false)}>close</span>
                        </div>
                    </div>
                    <hr />
                    {clickedPriority && (
                        <div className="edit-tag">
                            <span className="priority" style={{ background: clickedPriority.priority_color }}>
                                {clickedPriority.priority_name}
                            </span>
                        </div>
                    )}
                    <label><b>Title</b>
                        <input className="label-input" type="text" value={editedPriorityName}
                            onChange={(e) => {
                                setEditedPriorityName(e.target.value);
                                setHasChanges(true);
                                if (clickedPriority) {
                                    const newPriority = { ...clickedPriority, priority_name: e.target.value };
                                    setClickedPriority(newPriority);
                                }
                            }}
                        />
                    </label>
                    <div className="dropdown-edit-buttons">
                        <div>
                            <button type="button" onClick={handleSaveClick}>Save</button>
                        </div>
                        <div className="cancel-btn">
                            <button type="button" onClick={handleGoBackClick}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="add-tags">
                <div className="selected-priority">
                    {selectedPriority != null && (
                        <span className="priority" style={{ background: selectedPriority.priority_color }}>{selectedPriority.priority_name}</span>
                    )}
                </div>
                <div className="tagDrop-btn">
                    <span className="material-symbols-outlined" onClick={handleAddPriorityClick}>add</span>
                </div>
            </div>
        </div>
    );
}

export default PriorityDropdown;