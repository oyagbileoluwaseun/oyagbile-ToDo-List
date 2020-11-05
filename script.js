// Script file linked with the HTML file

// Getting values of new Tasks, addin a listener, initalising our local storage 
// our filter, search and the function that takes care of drag and drop too
document.getElementById('taskSec').addEventListener('submit', addTask);
fetchTasks();
let taskList = JSON.parse(localStorage.getItem('tasks'));
const draggables = document.querySelectorAll(".draggable");
const boxes = document.querySelectorAll(".box");
let allTasks = document.querySelectorAll(".draggable");
document.getElementById("filter").addEventListener("keyup", filterTasks);


// This section works based an event handling function, meaning if event is true object happens
function addTask(e) {
    var input = document.querySelector('.task').value;
    if (input != "") {
        var task = {
            id: Math.random()
                .toString()
                .substr(2, 7),
            task: input
        };

        if (localStorage.getItem('tasks') === null) {
            var tasks = [];
            tasks.push(task);
            // This part push or set the elements in task to localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));
            setTimeout(function () { location.reload(1); }, 800);
        } else {
            // This part retrieves or gets elements in task from localStorage
            var tasks = JSON.parse(localStorage.getItem('tasks'));
            // Adding elements to an array
            tasks.push(task);
            // This section handles auto reset to localStorage in 0.7secs
            localStorage.setItem('tasks', JSON.stringify(tasks));
            setTimeout(function () { location.reload(1); }, 700);
        }

        // Clear elements form local memory by reset
        document.getElementById('taskSec').reset();
    }

    fetchTasks();

    // This prevent an empty task from submitting
    e.preventDefault();
}

// This section handles tasks or todos deleting
function deleteTask(task, id) {
    var tasks = JSON.parse(localStorage.getItem(id));
    tasks = removeDuplicates(tasks, "task")
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].task == task) {
            // Deleting/Removing from array
            tasks.splice(i, 1);
        }
    }
    localStorage.setItem(String(id), JSON.stringify(tasks));
    setTimeout(function () { location.reload(1); }, 600);
    fetchTasks();
}

let createReplyButtonCommentView = (operationType, commentOldData) => {
    let div = document.createElement("div");
    div.innerHTML = `<input type="text" id="newTask" value=${commentOldData} /> <button>${operationType}</button>`;

    return div;
};

let editTask = (task, t, element) => {
    var tasks = JSON.parse(localStorage.getItem(element));
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == String(t)) {
            // Deleting/Removing from array
            tasks[i].task = task;
        }
    }
    localStorage.setItem(element, JSON.stringify(tasks));
    setTimeout(function () { location.reload(1); }, 700);

}
function removeFromStorage(id, task) {
    var tasks = JSON.parse(localStorage.getItem(id));
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].task == task) {
            // Deleting/Removing from array
            tasks.splice(i, 1);
        }
    }
    localStorage.setItem(id, JSON.stringify(tasks));
    setTimeout(function () { location.reload(1); }, 700);
    fetchTasks();
}

// This section helps gather or fetch all tasks/todos
function fetchTasks() {
    var tasks = JSON.parse(localStorage.getItem('tasks'));
    var tasksResults = document.getElementById('lists');
    tasks = removeDuplicates(tasks, "task");
    // inner Html allow html code inscription and Build output
    tasksResults.innerHTML = '';
    if (tasks.length > 0) {
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i].task;
            var id = tasks[i].id

            tasksResults.innerHTML += `<div id=${id} class="card draggable" draggable="true">` +
                `<h3>` + task +
                `<button>Edit</button>` +
                `<button>X</button>` +
                '</h3>' +
                '</div>';
        }
    }
    if (localStorage.getItem('working')) {
        var tasks = JSON.parse(localStorage.getItem('working'));
        var tasksResults = document.getElementById('working');

        tasks = removeDuplicates(tasks, "task")

        // inner Html allow html code inscription and Build output
        tasksResults.innerHTML = '';
        if (tasks.length > 0) {
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i].task;
                var id = tasks[i].id;

                tasksResults.innerHTML += `<div id=${id} class="card draggable" draggable="true">` +
                    `<h3>` + task +
                    `<button>Edit</button>` +
                    `<button>X</button>` +
                    '</h3>' +
                    '</div>';
            }
        }
    }
    if (localStorage.getItem('completed')) {
        var tasks = JSON.parse(localStorage.getItem('completed'));
        var tasksResults = document.getElementById('completedTodos');
        tasks = removeDuplicates(tasks, "task");

        // inner Html allow html code inscription and Build output
        tasksResults.innerHTML = '';
        if (tasks.length > 0) {
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i].task;
                var id = tasks[i].id;

                tasksResults.innerHTML += `<div id=${id} class="card draggable" draggable="true">` +
                    `<h3>` + task +
                    `<button>Edit</button>` +
                    `<button>X</button>` +
                    '</h3>' +
                    '</div>';
            }
        }
    }

}
function removeDuplicates(array, key) {
    return array.filter((obj, index, self) =>
        index === self.findIndex((el) => (
            el[key] === obj[key]
        ))
    )
}
function getDragAfterItem(box, y) {
    const elements = [...box.querySelectorAll(".draggable:not(.dragging)")];
    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function filterTasks(e) {
    var text = e.target.value;
    Array.from(allTasks).forEach(function (task) {
        if (task.innerText.slice(0, -5).indexOf(text) != -1) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    })
}

document.getElementById('lists').addEventListener("click", e => {
    e.preventDefault();
    if (e.target.innerText === "X") {
        var id = e.target.parentNode.parentNode.parentNode.classList;
        deleteTask(e.target.parentNode.firstChild.data, id);
    }
    else if (e.target.innerText === "Edit") {
        e.target.parentNode.appendChild(
            createReplyButtonCommentView("Save Changes", e.target.parentNode.firstChild.data)
        );
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "none";
    } else if (e.target.innerText === "Save Changes") {
        const newTask = {
            task: e.target.parentNode.firstChild.value
        };
        let id = e.target.parentNode.parentNode.parentNode.id;
        editTask(newTask.task, id, "tasks")
        fetchTasks();
    }
});

document.getElementById('working').addEventListener("click", e => {
    e.preventDefault();
    if (e.target.innerText === "X") {
        var id = e.target.parentNode.parentNode.parentNode.id;
        deleteTask(e.target.parentNode.firstChild.data, id);
    }
    else if (e.target.innerText === "Edit") {
        e.target.parentNode.appendChild(
            createReplyButtonCommentView("Save Changes", e.target.parentNode.firstChild.data)
        );
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "none";
    } else if (e.target.innerText === "Save Changes") {
        const newTask = {
            task: e.target.parentNode.firstChild.value
        };
        let id = e.target.parentNode.parentNode.parentNode.id;
        editTask(newTask.task, id, "working");
        fetchTasks();
    }
});
document.getElementById('completedTodos').addEventListener("click", e => {
    e.preventDefault();
    if (e.target.innerText === "X") {
        var id = e.target.parentNode.parentNode.parentNode.parentNode.classList[1];
        deleteTask(e.target.parentNode.firstChild.data, id);
    }
    else if (e.target.innerText === "Edit") {
        e.target.parentNode.appendChild(
            createReplyButtonCommentView("Save Changes", e.target.parentNode.firstChild.data)
        );
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "none";
    } else if (e.target.innerText === "Save Changes") {
        const newTask = {
            task: e.target.parentNode.firstChild.value
        };
        let id = e.target.parentNode.parentNode.parentNode.id;
        editTask(newTask.task, id, "completed");
        fetchTasks();
    }
});

//Handling Drag and Drop functunalities
draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging");
    })

    draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
    })
})
boxes.forEach(box => {
    box.addEventListener("dragover", e => {
        e.preventDefault();
        const afterElement = getDragAfterItem(box, e.clientY);
        const dragging = document.querySelector(".dragging");
        var target = box.classList[1];
        if (afterElement == null) {
            box.appendChild(dragging);
            var task = {
                id: dragging.id,
                task: dragging.firstChild.textContent.slice(0, -5)
            };
            if (target === "working") {
                if (localStorage.getItem('working') === null) {
                    // Internaly saved array
                    var workings = [];
                    // Add to interbal array
                    workings.push(task);
                    // push / set to browser localStorage
                    localStorage.setItem('working', JSON.stringify(workings));
                    setTimeout(function () { location.reload(1); }, 300);
                } else {
                    // Accessing tasks/ToDos from browser localStorage
                    var workings = JSON.parse(localStorage.getItem('working'));
                    // Add tasks/ToDos to array
                    workings.push(task);
                    // push / set to browser localStorage
                    localStorage.setItem('working', JSON.stringify(workings));
                    setTimeout(function () { location.reload(1); }, 300);
                    //ensure no duplicates
                }
            }
            else if (target === "completed") {
                if (localStorage.getItem('completed') === null) {
                    // Accessing tasks/ToDos from browser localStorage
                    var completed = [];
                    // Add tasks/ToDos to array
                    completed.push(task);
                    // Push / set to browser localStorage
                    localStorage.setItem('completed', JSON.stringify(completed));
                    setTimeout(function () { location.reload(1); }, 300);
                } else {
                    // Accessing tasks/ToDos from browser localStorage
                    var completed = JSON.parse(localStorage.getItem('completed'));
                    // Add tasks/ToDos to array
                    completed.push(task);
                    // Push / set to browser localStorage
                    localStorage.setItem('completed', JSON.stringify(completed));
                    setTimeout(function () { location.reload(1); }, 300);
                    // ensure no duplicates
                }
            }
            else if (target === "tasks") {
                if (localStorage.getItem('tasks') === null) {
                    // Accessing tasks/ToDos from browser localStorage
                    var tasks = [];
                    // Add tasks/ToDos to array
                    tasks.push(task);
                    // Push / set to browser localStorage
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                } else {
                    // Get tasks from localStorage
                    var tasks = JSON.parse(localStorage.getItem('tasks'));
                    // Add tasks/ToDos to array
                    tasks.push(task);
                    // Push / set to browser localStorage
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    // ensure no duplicates
                }
            }
        } else {
            box.insertBefore(dragging, afterElement);
        }

    })
})

