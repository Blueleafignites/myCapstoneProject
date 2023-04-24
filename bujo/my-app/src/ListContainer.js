import { useState, useRef } from "react";
import Modal from "./Task";
import './App.css';

function ListContainer({ title, priorities, tags, lists, listId, tasks, setTasks, deleteTasksByListId }) {
  const modalRef = useRef();
  const overlayId = `modalOverlay-${title}`;

  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState({ title: '', priority: [], tags: [], deadline: null });
  const [showListActions, setShowListActions] = useState(false);

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

  const handleDeleteAllClick = async () => {
    try {
      await deleteTasksByListId(listId);
      setTasks((prevState) => prevState.filter((t) => t.list_id !== listId));
    } catch (error) {
      console.error(error);
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
                <li>Sort List</li>
                <li>Move All</li>
                <li className="delete" onClick={handleDeleteAllClick}>Delete All</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <hr />
      {tasks.filter((task) => task.list_id === listId).map((task, index) => (
        <div className="task-card" key={index} style={{ backgroundColor: `${task.priority_color}80` }} onClick={() => handleEditTask(task)}>
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
      {showModal && (
        <>
          <Modal onClose={handleCloseModal} modalRef={modalRef} task={task} priorities={priorities} tags={tags} lists={lists} tasks={tasks} />
        </>
      )}
      <div id={overlayId} className="modal-overlay" onClick={() => handleCloseModal()}></div>
    </div>
  );
}

export default ListContainer;