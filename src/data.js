const getCurrentDate = () => {
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return { month, year };
};

const priorities = [
    { name: "High", color: "#FF4136" },
    { name: "Moderate", color: "#FF851B" },
    { name: "Low", color: "#2ECC40" },
    { name: "None", color: "#00AFFF" },
];

const tags = [
    { name: "Personal", color: "#B10DC9" },
    { name: "School", color: "#00AFFF" },
    { name: "Work", color: "#2ECC40" },
    { name: "Family", color: "#F012BE" },
    { name: "Finance", color: "#FF851B" },
    { name: "Health", color: "#FFCC10" },
];

const getLists = () => {
    const { month, year } = getCurrentDate();

    return ["Today", month, year];
};

const tasks = [
    {
        id: 1,
        title: "Dentist Appointment",
        list: getLists()[0],
        priority: priorities[0].name,
        tags: [tags[5].name],
        deadline: new Date("2023-03-11")
    },
    {
        id: 2,
        title: "Go Grocery Shopping",
        list: getLists()[1],
        priority: priorities[1].name,
        tags: [tags[3].name, tags[0].name],
        deadline: null
    },
    {
        id: 3,
        title: "Read 50 Books",
        list: getLists()[2],
        priority: priorities[3].name,
        tags: [tags[0].name],
        deadline: new Date("2023-12-31")
    },
    {
        id: 4,
        title: "Clean Bedroom",
        list: getLists()[1],
        priority: priorities[2].name,
        tags: [tags[0].name, tags[5].name],
        deadline: null
    },
    {
        id: 5,
        title: "Homework",
        list: getLists()[0],
        priority: priorities[1].name,
        tags: [tags[1].name],
        deadline: new Date("2023-03-13")
    },
    {
        id: 6,
        title: "Water the Plants",
        list: getLists()[1],
        priority: [],
        tags: [],
        deadline: null
    },
    {
        id: 7,
        title: "Optometrist Appointment",
        list: getLists()[1],
        priority: priorities[0].name,
        tags: [tags[5].name],
        deadline: new Date("2023-03-22")
    },
];

module.exports = {
    getCurrentDate,
    getLists,
    priorities,
    tags,
    tasks
};
