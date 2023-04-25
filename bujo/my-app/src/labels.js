import React, { useState, useEffect } from 'react';

function PriorityDropdown({ task, priorities, setPriorities }) {
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState(task.priority_id ? priorities.find(p => p.priority_id === task.priority_id) : null);

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
                                <span className="material-symbols-outlined edit">edit</span>
                            </li>
                        ))}
                    </ul>
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