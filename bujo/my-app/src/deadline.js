const [showDatePicker, setShowDatePicker] = useState(false);
const [selectedDeadline] = useState(task.deadline || new Date().toISOString().substr(0, 10));
const [deadlineText, setDeadlineText] = useState(null);


useEffect(() => {
if (task.deadline) {
setShowDatePicker(true);
setDeadlineText(task.deadline.toISOString().substr(0, 10));
} else {
setDeadlineText(null);
}
}, [task]);

const handleAddClick = () => {
if (!task.deadline || deadlineText === null) {
setDeadlineText(new Date().toISOString().substr(0, 10));
}
setShowDatePicker(!showDatePicker);
};

const handleRemoveClick = () => {
setDeadlineText(null);
setShowDatePicker(false);
};

const handleDeadlineChange = (event) => {
setDeadlineText(event.target.value);
};

<div className="deadline">
    <label htmlFor="deadline">Deadline:</label>
    {showDatePicker && (
    <input type="date" id="deadline" name="deadline" value={deadlineText} onChange={handleDeadlineChange} />
    )}
    <div className="add-deadline-btn">
        <span className="material-symbols-outlined" onClick={showDatePicker ? handleRemoveClick : handleAddClick}>
            {showDatePicker ? 'remove' : 'add'}
        </span>
    </div>
</div>