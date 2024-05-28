// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;

// Function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
    if (!task) {
        return null;
    }

    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    taskCard.textContent = task.text;
    taskCard.id = task.id;
    taskCard.draggable = true;

    // Create a delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
        deleteTask(taskCard);
    });

    // Append the delete button to the task card
    taskCard.appendChild(deleteButton);

    return taskCard;
}

// Function to create a task card
function createTaskCard(task) {
    if (!task) {
        return null;
    }

    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    taskCard.textContent = task.text;
    taskCard.id = task.id;
    taskCard.draggable = true;

    // Attach drag event handlers
    taskCard.addEventListener('dragstart', handleDragStart);
    taskCard.addEventListener('dragover', handleDragOver);
    taskCard.addEventListener('drop', handleDrop);

    // Create a delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
        deleteTask(task.id);
    });

    // Append the delete button to the task card
    taskCard.appendChild(deleteButton);

    return taskCard;
}

// Function to delete a task
function deleteTask(taskId) {
    if (!taskId) {
        return;
    }

    // Filter out any null tasks from taskList
    taskList = taskList.filter(task => task !== null);

    // Find the index of the task in the taskList
    const taskIndex = taskList.findIndex(task => task.id.toString() === taskId.toString());

    if (taskIndex !== -1) {
        // Remove the task from the taskList
        taskList.splice(taskIndex, 1);

        // Update localStorage
        localStorage.setItem("tasks", JSON.stringify(taskList));

        // Re-render the task list
        renderTaskList();
    }
}

// Define the drag start handler
function handleDragStart(event) {
    event.dataTransfer.setData('taskCard', event.target.id);
}

// Define the drag over handler
function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

// Define the drop handler
function handleDrop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('taskCard');
    const taskCard = document.getElementById(taskId);
    event.target.appendChild(taskCard);
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    // Clear the current task list display
    todoSection.innerHTML = '';

    // Create and display a card for each task in taskList
    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        if (taskCard) {
            todoSection.appendChild(taskCard);
        }
    });

    // Add event listeners for drag and drop
    const taskCards = document.querySelectorAll(".task-card");
    taskCards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
    });
}

// Select the "Save Task" button and the input field
const saveTaskButton = document.querySelector('#saveTaskBtn');
const taskInput = document.querySelector('#taskName');
const todoSection = document.querySelector('#todo-cards');

// Add an event listener to the "Save Task" button
saveTaskButton.addEventListener('click', function() {
    console.log('Save Task button clicked');

    // Retrieve the value of the input field
    const taskText = taskInput.value;

    // Create a new task object and add it to the task list
    const task = { id: generateTaskId(), text: taskText };
    taskList.push(task);

    // Update localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));

    // Clear the input field
    taskInput.value = '';

    // Re-render the task list
    renderTaskList();
});

// Render the initial task list
renderTaskList();

// Get the "In Progress" container
const inProgressContainer = document.getElementById('in-progress');

// Add event listeners
inProgressContainer.addEventListener('dragover', function(e) {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move'; 
    return false;
});

inProgressContainer.addEventListener('drop', function(e) {
    e.preventDefault(); 
    var data = e.dataTransfer.getData('text');
    e.target.appendChild(document.getElementById(data));
    return false;
});