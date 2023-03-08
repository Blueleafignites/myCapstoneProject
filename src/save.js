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
  - Add animations or something for when a button is clicked
  - Make it so that you have to cancel or close the delete confirmation
  - Hovering over tags and priority should not show drop down
*/

import { useState, useEffect, useRef } from "react";
import './App.css';

const currentDate = new Date();
const month = currentDate.toLocaleString('default', { month: 'long' });
const year = currentDate.getFullYear();

const priorities = [
  { name: "High", color: "#FF4136" },
  { name: "Moderate", color: "#FF851B" },
  { name: "Low", color: "#2ECC40" },
  { name: "None", color: "#0074D9" },
];

const tags = [
  { name: "Personal", color: "#B10DC9" },
  { name: "School", color: "#00afff" },
  { name: "Work", color: "#2ECC40" },
  { name: "Family", color: "#F012BE" },
  { name: "Finance", color: "#FF851B" },
  { name: "Health", color: "#FFCC10" },
];

const lists = ["Today", month, year];

const tasks = [  
  { id: 1, title: "Dentist Appointment", list: lists[0], priority: priorities[0], tags: [tags[5]] },
  { id: 2, title: "Go Grocery Shopping", list: lists[1], priority: priorities[1], tags: [tags[3], tags[1]] },
  { id: 3, title: "Read 50 Books", list: lists[2], priority: priorities[3], tags: [tags[0]] },
  { id: 4, title: "Clean Bedroom", list: lists[2], priority: priorities[2], tags: [tags[0], tags[5]] },
];


/*
const lists = ["Today", month, year];

const tasks = [
  { title: "Dentist Appointment", list: lists[0], priority: priorities[0], tags: [tags[5]] },
  { title: "Go Grocery Shopping", list: lists[1], priority: priorities[1], tags: [tags[3], tags[1]] },
  { title: "Read 50 Books", list: lists[2], priority: priorities[3], tags: [tags[0]] },
  { title: "Clean Bedroom", list: lists[2], priority: priorities[2], tags: [tags[0], tags[5]] },
  { title: "Homework", list: lists[0], priority: priorities[1].name, tags: [tags[1].name] },
];

const tasks = [
  { id: 1, title: "Dentist Appointment", list: "Today", priority: "High", tags: ["Health"] },
  { id: 2, title: "Go Grocery Shopping", list: month, priority: "Moderate", tags: ["Family", "Personal"] },
  { id: 3, title: "Read 50 Books", list: year, priority: "None", tags: ["Personal"] },
  { id: 4, title: "Clean Bedroom", list: year, priority: "Low", tags: ["Personal", "Health"] },
  { id: 5, title: "Homework", list: "Today", priority: "Moderate", tags: ["School"] },
];

*/


function ListContainer({ title }) {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();
  const overlayId = `modalOverlay-${title}`;
  const [currentList] = useState(title);
  const [modalDefaultValue, setModalDefaultValue] = useState('');
  const [modalDefaultPriority, setModalDefaultPriority] = useState([]);
  const [modalDefaultTags, setModalDefaultTags] = useState([]);

  const [otherLists, setOtherLists] = useState([]);
  useEffect(() => {
    const allLists = ["Today", month, year];
    setOtherLists(allLists.filter(list => list !== currentList));
  }, [currentList]);

  const handleOpenModal = (task) => {
    setModalDefaultValue(task.title);
    setModalDefaultPriority([priorities.find(p => p.name === task.priority)]);
    setModalDefaultTags(task.tags);
    setShowModal(true);
    document.getElementById(overlayId).style.display = "block";
  };

  const handleAddTask = () => {
    setModalDefaultValue('');
    setModalDefaultPriority([]);
    setModalDefaultTags([]);
    setShowModal(true);
    document.getElementById(overlayId).style.display = "block";
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.getElementById(overlayId).style.display = "none";
  };
  
  return (
    <div className="list">
      <div className="list-header">
        <div className="add-task">
          <div className="add-btn" onClick={handleAddTask}>
            <span className="material-symbols-outlined">add</span>
          </div>
        </div>
        <p className="list-title">{title}</p>
        <div className="dropdown">
          <div className="drop-btn">
            <span className="material-symbols-outlined">more_horiz</span>
          </div>
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
      {tasks.filter((task) => task.list === currentList).map((task, index) => (
        <div className="task-card" key={index} style={{ backgroundColor: `${priorities.find(p => p.name === task.priority)?.color}80` }} onClick={() => handleOpenModal(task)}>
          <div className="task">
            <p>{task.title}</p>
          </div>
        </div>
      ))}
      {showModal && (
        <>
          <Modal onClose={handleCloseModal} modalRef={modalRef} currentList={currentList} otherLists={otherLists} defaultValue={modalDefaultValue} defaultPriority={modalDefaultPriority} defaultTags={modalDefaultTags}/>
        </>
      )}
      <div id={overlayId} className="modal-overlay" onClick={(event) => handleCloseModal(event)}></div>
    </div>
  );
}

function Modal({ onClose, modalRef, currentList, otherLists, defaultValue, defaultPriority, defaultTags }) {
  const [taskTitle, setTaskTitle] = useState(defaultValue);
  const [selectedTags, setSelectedTags] = useState(defaultTags);
  const [selectedPriority, setSelectedPriority] = useState(defaultPriority);
  const [showConfirmation, setShowConfirmation] = useState(false);


  const handleTagSelection = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handlePrioritySelection = (priority) => {
    if (selectedPriority.some((p) => p.name === priority.name)) {
      setSelectedPriority(selectedPriority.filter((p) => p.name !== priority.name));
    } else {
      setSelectedPriority([priority]);
    }
  };

  function handleDelete() {
    setShowConfirmation(true);
  }

  function handleConfirm() {
    setShowConfirmation(false);
  }

  function handleClose() {
    setShowConfirmation(false);
  }

  return (
    <>
      <div className="modal" ref={modalRef}>
        <div className="modal-content">
          <form>
            <div className="task-header">
              <div className="task-title">
                <input type="text" id="taskName" placeholder="Enter a title for this task..." value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)}/>
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
                    <div className="dropdown-tags">
                      <ul>
                        {priorities.map((priority, index) => (
                          <li key={index}>
                            <label>
                              <input type="checkbox" checked={selectedPriority.some((p) => p.name === priority.name)} onChange={() => handlePrioritySelection(priority)} />
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
                              <div className="priority" key={index} style={{ background: priority.color }}>{priority.name}</div>
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
                              <input type="checkbox" checked={selectedTags.includes(tag)} onChange={() => handleTagSelection(tag)} />
                              <span className="tag">{tag.name}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
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