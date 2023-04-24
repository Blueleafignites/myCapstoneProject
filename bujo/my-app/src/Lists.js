import ListContainer from "./ListContainer";
import './App.css';

function Lists({ priorities, tags, tasks, setTasks, deleteTasksByListId }) {
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const listTitles = [
    { id: 1, title: "Today" },
    { id: 2, title: month },
    { id: 3, title: year }
  ];

  return (
    <div className="scroll-container">
      <div className="list-container">
        {listTitles.map(({ id, title }) => {
          return (
            <ListContainer key={id} title={title} priorities={priorities} tags={tags} lists={listTitles} listId={id} tasks={tasks} setTasks={setTasks} deleteTasksByListId={deleteTasksByListId} />
          );
        })}
      </div>
    </div>
  );
}

export default Lists;
