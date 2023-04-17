import { useState, useEffect, useRef } from "react";
import Modal from "./Task";
import './App.css';


function ListContainer({ title, priorities, tags, lists, tasks }) {
  const modalRef = useRef();
  const overlayId = `modalOverlay-${title}`;

  const [showModal, setShowModal] = useState(false);
  const [currentList] = useState(title);
  const [otherLists, setOtherLists] = useState([]);
  const [task, setTask] = useState({ title: '', priority: [], tags: [], deadline: null });
  const [showListActions, setShowListActions] = useState(false);

  useEffect(() => {
    const otherLists = lists.filter(list => list.title !== title);
    setOtherLists(otherLists);
  }, [title, lists]);

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

  function handleSortListClick() {
    
  }
  
  const handleDeleteAll = () => {

  };

  const handleListActionsClick = () => {
    setShowListActions(!showListActions);
};

  const handleCloseModal = () => {
    setShowModal(false);
    document.getElementById(overlayId).style.display = "none";
  };
  
  const getTagColor = (tagName) => {
    const tag = tags.find((tag) => tag.name === tagName);
    return tag ? tag.color : "#000000";
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
                <li onClick={handleSortListClick}>Sort List</li>
                <li>Move All</li>
                <li>Archive All</li>
                <li className="delete" onClick={handleDeleteAll}>Delete All</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <hr />
      {tasks.filter((task) => task.list === currentList).map((task, index) => (
        <div className="task-card" key={index} style={{ backgroundColor: `${priorities.find(p => p.name === task.priority)?.color}80` }} onClick={() => handleEditTask(task)}>
          <div className="task">
            <div className="card-header">
              <p className="card-title">{task.title}</p>
              <div className="tag-list">
                {task.tags.map((tag, index) => (
                  <div key={index} className="card-tags" style={{ backgroundColor: getTagColor(tag) }}></div>
                ))}
              </div>
            </div>
            {task.deadline && (
              <p className="card-date">
                Deadline: {new Date(task.deadline).toLocaleDateString('en-US', {timeZone: 'UTC'})}
              </p>
            )}
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

function Lists({ lists }) {
  const listTitles = lists;

  return (
    <div className="scroll-container">
      <div className="list-container">
        {listTitles.map(title => (
          <ListContainer key={title} title={title} />
        ))}
      </div>
    </div>
  );
}

export default Lists;