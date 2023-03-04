import { useState } from 'react';
import { useEffect, useRef } from "react";
import './App.css';

/*
  Want to work on:
  - Maybe make it so that adding a task puts a task card on list, add title, then user can edit task to see the rest of the details?
  - Need more time on resizing lists for smaller screens
  - Still need to create the delete task confirmation
  - User should be able to add tags, delete tags, or edit them. Set colors as well
  - Maybe make it so that the user can remove a tag when hovering over it, an x appear and user can click on it
  - Priority and Tags drop down needs more time and work
  - Resize Add/Edit task view for smaller screens
  - Allow the user to add subtasks
  - Need to figure out what I want for task card default color and priority colors
  - Learn more about APIs and start to work on the database
*/

// Get the current month and year 
const currentDate = new Date();
const month = currentDate.toLocaleString('default', { month: 'long' });
const year = currentDate.getFullYear();

// Testing. Start for next sprint
const tasks = [
  { title: "Task 1", list: "Today" },
  { title: "Task 2", list: year },
  { title: "Task 3", list: year },
];

// Testing for Add/Editing tasks UI. Start for next sprint
const tags = ["Personal", "School", "Work", "Family", "Finance", "Health"];
const colors = ["#FF4136", "#0074D9", "#2ECC40", "#FF851B", "#B10DC9", "#FFDC00", "#F012BE", "#00afff"];

// Testing for Add/Editing tasks UI. Start for next sprint
const priorities = [
  { name: "High", color: "#FF4136" },
  { name: "Moderate", color: "#FF851B" },
  { name: "Low", color: "#2ECC40" },
  { name: "None", color: "#0074D9" },
];


function ListContainer({ title }) {
  const [showModal, setShowModal] = useState(false); // By default, the Add/Edit view is not seen
  const modalRef = useRef(); // Overlay
  const overlayId = `modalOverlay-${title}`; // Overlay. There should be only one Add/Edit view opened at a time for the list that was clicked on.
  const [currentList] = useState(title); // List that the add task button was clicked on

  const [otherLists, setOtherLists] = useState([]);
  useEffect(() => {
    const allLists = ["Today", month, year];
    setOtherLists(allLists.filter(list => list !== currentList));
  }, [currentList]);

  const handleOpenModal = () => {
    if (!showModal) {
      setShowModal(true);
      document.getElementById(overlayId).style.display = "block";
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.getElementById(overlayId).style.display = "none";
  };

  return (
    <div className="list">
      <div className="list-header">
        <div className="add-task">
          <div className="add-btn" onClick={handleOpenModal}>
            <span className="material-symbols-outlined">add</span>
          </div>
        </div>
        <p className="list-title">{title}</p>
        <div className="dropdown">
          <div className="drop-btn">
            <span className="material-symbols-outlined">more_horiz</span>
          </div>
          {/* This drop down does nothing for now. I want to work on it next sprint or later */}
          <div className="dropdown-content">
            <ul>
              <li>Sort List</li>
              <li>Move All</li>
              <li>Archive All</li>
              <li className="delete">Delete All</li>
            </ul>
          </div>
        </div>
      </div>
      <hr />
      { /* Tasks should only be seen in the list that they were added to, not duplicated across all lists */}
      {tasks.filter((task) => task.list === currentList).map((task, index) => (
        <div className="task-card" key={index}>
          <div className="task">
            <p>{task.title}</p>
          </div>
        </div>
      ))}
      {showModal && (
        <>
          <Modal onClose={handleCloseModal} modalRef={modalRef} currentList={currentList} otherLists={otherLists} />
        </>
      )}
      <div id={overlayId} className="modal-overlay" onClick={(event) => handleCloseModal(event)}></div>
    </div>
  );
}

function Modal({ onClose, modalRef, currentList, otherLists }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState([]);

  const handleTagSelection = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePrioritySelection = (priority) => {
    if (selectedPriority.some((p) => p.name === priority.name)) {
      setSelectedPriority([]);
    } else {
      setSelectedPriority([priority]);
    }
  };

  return (
    <>
      <div className="modal" ref={modalRef}>
        <div className="modal-content">
          <form>
            <div className="task-header">
              <div className="task-title">
                <input type="text" id="taskName" placeholder="Enter a title for this task..." />
              </div>
              <span className="material-symbols-outlined" onClick={onClose}>close</span>
            </div>
            <div className="task-container">
              <div className="task-info">
                <div className="taskPriority">
                  <label htmlFor="taskPriority" className="priority-label">Priority:</label>
                  <div className="dropdown">
                    <div className="dropdown-tags">
                      <ul>
                        {priorities.map((priority, index) => (
                          <li key={index}>
                            <label>
                              <input type="checkbox" checked={selectedPriority.some((p) => p.name === priority.name)}onChange={() => handlePrioritySelection(priority)} />
                              <span className="priority">{priority.name}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="add-tags">
                      {selectedPriority.length > 0 && (
                        <div className="selected-tags">
                          <div className="priorities">
                            {selectedPriority.map((priority, index) => (
                              <div className="priority" key={index} style={{ "--color": priority.color }}>{priority.name}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="tagDrop-btn">
                        <span className="material-symbols-outlined">add</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="taskTags">
                  <label htmlFor="taskTags" class="tags-label">Tags: </label>
                  <div className="dropdown">
                    <div className="dropdown-tags">
                      <ul>
                        {tags.map((tag, index) => (
                          <li key={index}>
                            <label>
                              <input type="checkbox" checked={selectedTags.includes(tag)}onChange={() => handleTagSelection(tag)} />
                              <span className="tag">{tag}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                    { /* I want to make the drop down not hover, but click open and click anywhere outside to close */ }
                    <div className="add-tags">
                      {selectedTags.length > 0 && (
                        <div className="selected-tags">
                          <div className="tags">
                            {selectedTags.map((tag, index) => (
                              <div className="tag" key={index} style={{ "--color": colors[Math.floor(Math.random() * colors.length)] }}>{tag}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="tagDrop-btn">
                        <span className="material-symbols-outlined">add</span>
                      </div>
                    </div> 
                  </div>
                </div>
                <div className="deadline">
                  <label htmlFor="dueDate">Deadline: </label>
                  <input type="date" id="dueDate" />
                </div>
                <div className="task-list">
                  <label htmlFor="listSelect">Add to list: </label>
                  <select id="listSelect">
                    <option value={currentList}>{currentList}</option>
                    {otherLists.map((list) => (
                      <option value={list} key={list}>
                        {list}
                      </option>
                    ))}
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
                  <button type="submit">Delete</button>
                </div>
              </div>
            </div>
            <div className="task-description">
              <label htmlFor="taskDescription">Description</label>
              <textarea  id="taskDescription" placeholder="Add a description..." />
            </div>
            <div className="save-task">
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// Set list titles
function Lists() {
  return (
    <>
      <ListContainer title="Today" />
      <ListContainer title={month} />
      <ListContainer title={year} />
    </>
  );
}

export default Lists;