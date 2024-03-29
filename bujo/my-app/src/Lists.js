import ListContainer from "./ListContainer";
import './App.css';

function Lists({ priorities, setPriorities, tags, setTags, tasks, setTasks }) {
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const lists = [
    { id: 1, title: "Today" },
    { id: 2, title: month },
    { id: 3, title: year }
  ];

  return (
    <div className="scroll-container">
      <div className="list-container">
        {lists.map(({ id, title }) => {
          return (
            <ListContainer key={id} title={title} priorities={priorities} setPriorities={setPriorities} tags={tags} setTags={setTags} lists={lists} listId={id} tasks={tasks} setTasks={setTasks} />
          );
        })}
      </div>
    </div>
  );
}

export default Lists;
