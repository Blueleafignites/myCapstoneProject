/*
  Want to work on:
  - User should be able to add tags, delete tags, or edit them. Set colors as well
  - Maybe make it so that the user can remove a tag when hovering over it, an x appear and user can click on it
  - Hovering over tags and priority should not show drop down

  - Resize lists for smaller screens
  - Fix the tasks so that it doesn't break when a task does not have a tag
  - Make the default task card color the same as none
  - Make it so that a user can add a deadline to a task
  - Make it  so that editing a task and then pressing save doesn't add a new task
  - Make it so that adding a task to the list, but then changing the list with the select menu, adds the task to the list that was selected, rather than where the add-btn was pressed.
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
  { name: "None", color: "#00AFFF" },
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
  { id: 1, title: "Dentist Appointment", list: lists[0], priority: priorities[0].name, tags: [tags[5].name] },
  { id: 2, title: "Go Grocery Shopping", list: lists[1], priority: priorities[1].name, tags: [tags[3].name, tags[0].name] },
  { id: 3, title: "Read 50 Books", list: lists[2], priority: priorities[3].name, tags: [tags[0].name] },
  { id: 4, title: "Clean Bedroom", list: lists[1], priority: priorities[2].name, tags: [tags[0].name, tags[5].name] },
  { id: 5, title: "Homework", list: lists[0], priority: priorities[1].name, tags: [tags[1].name] },
  { id: 6, title: "Water the Plants", list: lists[1], priority: priorities[2].name, tags: [tags[0].name] },
];

/*
const tasks = [
  { id: 1, title: "Dentist Appointment", list: lists[0], priority: priorities[0].name, tags: [tags[5].name], deadline: new Date("2023-03-11") },
  { id: 2, title: "Go Grocery Shopping", list: lists[1], priority: priorities[1].name, tags: [tags[3].name, tags[0].name], deadline: new Date("2023-03-12") },
  { id: 3, title: "Read 50 Books", list: lists[2], priority: priorities[3].name, tags: [tags[0].name] },
  { id: 4, title: "Clean Bedroom", list: lists[1], priority: priorities[2].name, tags: [tags[0].name, tags[5].name] },
  { id: 5, title: "Homework", list: lists[0], priority: priorities[1].name, tags: [tags[1].name], deadline: new Date("2023-03-13") },
  { id: 6, title: "Water the Plants", list: lists[1], priority: priorities[2].name },
];
*/


function ListContainer({ title }) {
  const modalRef = useRef();
  const overlayId = `modalOverlay-${title}`;

  const [showModal, setShowModal] = useState(false);
  const [currentList] = useState(title);
  const [otherLists, setOtherLists] = useState([]);
  const [task, setTask] = useState({title: '', priority: [], tags: []});

  useEffect(() => {
    const allLists = ["Today", month, year];
    setOtherLists(allLists.filter(list => list !== currentList));
  }, [currentList]);

  const handleEditTask = (task) => {
    setTask(task);
    setShowModal(true);
    document.getElementById(overlayId).style.display = "block";
  }; 

  const handleAddTask = () => {
    setTask({title: '', priority: [], tags: []});
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
        <div className="task-card" key={index} style={{ backgroundColor: `${priorities.find(p => p.name === task.priority)?.color}80` }} onClick={() => handleEditTask(task)}>
          <div className="task">
            <p>{task.title}</p>
          </div>
        </div>
      ))}
      {showModal && (
        <>
          <Modal onClose={handleCloseModal} modalRef={modalRef} currentList={currentList} otherLists={otherLists} task={task}/>
        </>
      )}
      <div id={overlayId} className="modal-overlay" onClick={() => handleCloseModal()}></div>
    </div>
  );
}

function Modal({ onClose, modalRef, currentList, otherLists, task }) {
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [selectedPriority, setSelectedPriority] = useState(priorities.find(p => p.name === task.priority) || null);
  const [selectedTags, setSelectedTags] = useState(task.tags.map(tagName => tags.find(t => t.name === tagName)));
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleTagSelection = (tag) => {
    if (selectedTags.some((t) => t.name === tag.name)) {
      setSelectedTags(selectedTags.filter((t) => t.name !== tag.name));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handlePrioritySelection = (priority) => {
    if (selectedPriority != null && selectedPriority.name === priority.name) {
      setSelectedPriority(null);
    } else {
      setSelectedPriority(priority);
    }
  };

  function handleSaveTask() {
    const newTask = {
      id: tasks.length + 1,
      title: taskTitle,
      list: currentList,
      priority: selectedPriority?.name || null,
      tags: selectedTags.map(tag => tag.name),
    };
  
    tasks.push(newTask);
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
                              <input type="checkbox" checked={selectedPriority != null && selectedPriority.name === priority.name} onChange={() => handlePrioritySelection(priority)} />
                              <span className="priority">{priority.name}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="add-tags">
                      {selectedPriority != null && (
                        <div className="selected-tags">
                          <div className="priorities">
                            <div className="priority" key="priority" style={{ background: selectedPriority.color }}>{selectedPriority.name}</div>
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
              <button onClick={handleSaveTask}>Save</button>
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