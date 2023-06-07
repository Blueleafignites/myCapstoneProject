import { useState, useRef } from "react";
import axios from 'axios';
import Task from "./Task";
import './App.css';

/*
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString

  ListContainer is responsible for rendering three lists and their respective tasks. It utilizes the useState hook 
  to manage different features and actions within each list. These features include the visibility of the 
  Task Modal, sorting and moving tasks, and confirming task deletion through a dialog.
*/

function ListContainer({ listId, title, priorities, setPriorities, tags, setTags, lists, tasks, setTasks }) {
  const modalRef = useRef();
  const overlayId = `modalOverlay-${title}`;

  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState({ title: '', priority: [], tags: [], deadline: null });

  const [showListActions, setShowListActions] = useState(false);

  const [showSortList, setShowSortList] = useState(false);
  const [sortByDueDate, setSortByDueDate] = useState(false);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);

  const [showMoveAll, setShowMoveAll] = useState(false);
  const [selectedList, setSelectedList] = useState('');
  const [availableLists, setAvailableLists] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleEditTask = (task) => {
    setTask(task);
    setShowModal(true);
    document.getElementById(overlayId).style.display = "block";
  };

  const handleAddTask = () => {
    setTask({ title: '', priority: [], tags: [], deadline: null });
    setShowModal(true);
    document.getElementById(overlayId).style.display = "block";
  };

  const handleListActionsClick = () => {
    setShowListActions(!showListActions);
  };

  const handleSortListClick = () => {
    setShowSortList(true);
  };

  function handleSaveSort() {
   
  }

  const handleMoveAllClick = () => {
    const otherLists = lists.filter(l => l.title !== title);
    setAvailableLists(otherLists);
    setShowMoveAll(true);
  }

  const handleSaveClick = async () => {
    const targetList = availableLists.find((list) => list.title === selectedList);
    const movedTasks = tasks.filter((task) => task.list_id === listId);
    const movedTaskIds = movedTasks.map((task) => task.task_id);
  
    try {
      if (targetList) {
        await axios.put(`http://localhost:3000/lists/${targetList.id}/tasks`, {
          taskIds: movedTaskIds,
        });
  
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            movedTaskIds.includes(task.id)
              ? { ...task, list_id: targetList.id }
              : task
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  
    setShowMoveAll(false);
    window.location.reload();
  };
  
  const handleDeleteAllClick = async () => {
    setShowConfirmation(true);
    document.addEventListener('click', handleOutsideClick);
    document.body.classList.add('no-click');
  };

  function handleClose() {
    setShowConfirmation(!showConfirmation);
    document.body.classList.remove('no-click');
  }

  let confirmationOpened = false;
  function handleOutsideClick(event) {
    const confirmationContent = document.querySelector('.delete-confirmation-content');
    const deleteBtn = document.querySelector('.delete-btn button');

    if (confirmationOpened && confirmationContent && !confirmationContent.contains(event.target) && event.target !== deleteBtn) {
      confirmationContent.classList.add('animation');
      setTimeout(() => confirmationContent.classList.remove('animation'), 500);
    }
  }

  document.addEventListener('click', () => {
    confirmationOpened = true;
  });

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/lists/${listId}/tasks`);
      setTasks((prevState) => prevState.filter((t) => t.list_id !== listId));
      setShowConfirmation(false);
    } catch (error) {
      console.error(error);
    }
    document.body.classList.remove('no-click');
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    document.getElementById(overlayId).style.display = "none";
  };

  const nonePriority = priorities.find(p => p.priority_name === "None");

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
            <span className="material-symbols-outlined" onClick={handleListActionsClick}>more_horiz</span>
          </div>
          {showListActions && (
            <div className="dropdown-content">
              <ul>
                <li onClick={handleSortListClick}>Sort List</li>
                <li onClick={handleMoveAllClick}>Move All</li>
                <li className="delete" onClick={handleDeleteAllClick}>Delete All</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <hr />
      <div className="list-tasks">
        {tasks.filter((task) => task.list_id === listId).map((task, index) => (
          <div className="task-card"
            key={index}
            style={{ backgroundColor: task.priority_color ? `${task.priority_color}60` : `${nonePriority.priority_color}60` }}
            onClick={() => handleEditTask(task)}
          >
            <div className="task">
              <div className="card-header">
                <p className="card-title">{task.task_title}</p>
                {task.tag_colors &&
                  <div className="tag-colors" style={{ display: "flex" }}>
                    {task.tag_colors.split(',').map((tagColor, index) => (
                      <div className="card-tags" key={index} style={{ backgroundColor: tagColor }}></div>
                    ))}
                  </div>
                }
              </div>
              {task.deadline &&
                <p className="card-date">Deadline: {new Date(task.deadline).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
              }
            </div>
          </div>
        ))}
      </div>

      <div className="dropdown">
        {showSortList && (
          <div className="listActions-window">
            <div className="dropdown-header">
              <div className="dropdown-title">
                <p>Sort List</p>
              </div>
              <div className="dropdown-close">
                <span className="material-symbols-outlined" onClick={() => setShowSortList(false)}>close</span>
              </div>
            </div>
            <hr />
            <div className="dropdown-options">
              <label>
                <input type="checkbox" value="due-date" checked={sortByDueDate} onChange={() => setSortByDueDate(!sortByDueDate)} />
                Sort by Due Date
              </label>
              <label>
                <input type="checkbox" value="alphabetical" checked={sortAlphabetically} onChange={() => setSortAlphabetically(!sortAlphabetically)} />
                Sort Alphabetically
              </label>
            </div>
            <button onClick={handleSaveSort}>Save</button>
          </div>
        )}
      </div>

      <div className="dropdown">
        {showMoveAll && (
          <div className="listActions-window">
            <div className="dropdown-header">
              <div className="dropdown-title">
                <p>Move Tasks</p>
              </div>
              <div className="dropdown-close">
                <span className="material-symbols-outlined" onClick={() => setShowMoveAll(false)}>close</span>
              </div>
            </div>
            <hr />
            <div className="dropdown-select">
              <div className="selected-list">
                <p>Move tasks from {title} to...</p>
              </div>
              <select value={selectedList || ""} onChange={(e) => setSelectedList(e.target.value)}>
                {availableLists.map((list) => (
                  <option key={list.id} value={list.title} disabled={list.title === title}>{list.title}</option>
                ))}
              </select>
              <button onClick={handleSaveClick}>Save</button>
            </div>
          </div>
        )}
      </div>

      <div className="delete-tasks-confirmation">
        {showConfirmation && (
          <div className="delete-confirmation-content">
            <div className="close-confirmation">
              <span className="material-symbols-outlined" onClick={handleClose}>close</span>
            </div>
            <p>Are you sure you want to delete these tasks? It's irreversible.</p>
            <div className="delete-confirmation-buttons">
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

      {showModal && (
        <>
          <Task onClose={handleCloseModal} modalRef={modalRef} tasks={tasks} task={task} priorities={priorities} setPriorities={setPriorities} tags={tags} setTags={setTags} lists={lists} setTasks={setTasks} />
        </>
      )}
      <div id={overlayId} className="modal-overlay" onClick={() => handleCloseModal()}></div>
    </div>
  );
}

export default ListContainer;