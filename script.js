// Arrays to store todos in different states
let toDoArr = []; // Active todos
let deleteArr = []; // Deleted todos
let finishArr = []; // Finished todos

// Load todos from localStorage on startup
function loadTodos() {
  // Arrays to store todos in different states
  const data = JSON.parse(localStorage.getItem("todoData")) || {};
  toDoArr = data.toDoArr || [];
  finishArr = data.finishArr || [];
  deleteArr = data.deleteArr || [];
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem(
    "todoData",
    JSON.stringify({
      toDoArr,
      finishArr,
      deleteArr,
    })
  );
}

// DOM elements for interaction and display
const submit = document.querySelector("#submit");
const todoContainer = document.querySelector("#todoContainer");
const finishContainer = document.querySelector("#finishContainer");
const deleteContainer = document.querySelector("#deleteContainer");
const todoNameInput = document.querySelector("#todoNameInput");

// Event listener for adding a new todo
submit.addEventListener("click", submitToDo);

// Load todos and render on page load
loadTodos();
writeTodos();
writeFinished();
writeDeleted();

// Adds a new todo to the list
function submitToDo() {
  const todoDescInput = document.querySelector("#todoDescInput");
  const dateInput = document.querySelector("#dateInput");
  const priorityInput = document.querySelector("#priorityInput");
  const tagInput = document.querySelector("#tagInput");
  const todoObj = {
    name: todoNameInput.value,
    id: self.crypto.randomUUID(), // Unique ID for each todo
    done: false,
    description: todoDescInput.value,
    date: dateInput.value,
    priority: priorityInput.value,
    tag: tagInput.value,
  };
  toDoArr.unshift(todoObj); // Add to the beginning of the array
  saveTodos();
  writeTodos();
  writeFinished();
  writeDeleted();
}

// Renders the list of active (undone) todos
function writeTodos() {
  todoContainer.innerHTML = "";

  // Create HTML for each todo item
  toDoArr.forEach((todoObj) => {
    todoContainer.innerHTML += `
        <li class="flex_col"data-id="${todoObj.id}">
        <div class="space_between flex_row">
          <div class="flex_row">
           <input type="checkbox" ${todoObj.done ? "checked" : ""}/>
            <h3>${todoObj.name}</h3>
           </div>
          <div class="flex_row">
            <p class="todoPriority  ${todoObj.priority}">${todoObj.priority ? todoObj.priority + " Priority" : ""}</p>
            <p class="todoDate">${todoObj.date ? "Due: " + todoObj.date : ""}</p>
          </div>
        </div>
        <p class="todoDesc">${todoObj.description ? todoObj.description : ""}</p>
        <div class="space_between flex_row">
          <p class="todoTag">${todoObj.tag ? todoObj.tag : ""}</p>
          <button class="deleteBtn">delete</button>
        </div>
      </li>
      `;
  });

  // Add event listeners for checkboxes and delete buttons
  todoContainer.querySelectorAll("li").forEach((li) => {
    const checkBox = li.querySelector("input");
    const deleteBtn = li.querySelector(".deleteBtn");
    // Description button and logic removed

    // When checkbox is checked, move todo to finished list
    checkBox.addEventListener("change", () => {
      const obj = toDoArr.find((toDo) => toDo.id === li.dataset.id);
      if (obj) {
        obj.done = true;
        toDoArr.splice(toDoArr.indexOf(obj), 1);
        finishArr.unshift(obj);
      }
      saveTodos();
      writeTodos();
      writeFinished();
      writeDeleted();
    });

    // When delete button is clicked, move todo to deleted list
    deleteBtn.addEventListener("click", () => {
      const obj = toDoArr.find((t) => t.id === li.dataset.id);
      if (obj) {
        toDoArr.splice(toDoArr.indexOf(obj), 1);
        deleteArr.unshift(obj);
        console.log("DeleteArr:", deleteArr);
      }
      saveTodos();
      writeTodos();
      writeDeleted();
    });
  });
}

// Renders the list of finished todos
function writeFinished() {
  finishContainer.innerHTML = "";

  // Create HTML for each finished todo item
  finishArr.forEach((todoObj) => {
    finishContainer.innerHTML += `
           <li class="flex_col"data-id="${todoObj.id}">
        <div class="space_between flex_row">
          <div class="flex_row">
           <input type="checkbox" ${todoObj.done ? "checked" : ""}/>
            <h3>${todoObj.name}</h3>
           </div>
          <div class="flex_row">
            <p class="todoPriority  ${todoObj.priority}">${todoObj.priority ? todoObj.priority + " Priority" : ""}</p>
            <p class="todoDate">${todoObj.date ? "Due: " + todoObj.date : ""}</p>
          </div>
        </div>
        <p class="todoDesc">${todoObj.description ? todoObj.description : ""}</p>
        <div class="space_between flex_row">
          <p class="todoTag">${todoObj.tag ? todoObj.tag : ""}</p>
          <button class="deleteBtn">delete</button>
        </div>
      </li>`;
  });

  // Add event listeners for checkboxes and delete buttons
  finishContainer.querySelectorAll("li").forEach((li) => {
    const checkBox = li.querySelector("input");
    const deleteBtn = li.querySelector(".deleteBtn");

    // When checkbox is unchecked, move todo back to active list
    checkBox.addEventListener("change", () => {
      const obj = finishArr.find((t) => t.id === li.dataset.id);
      if (obj) {
        obj.done = false;
        finishArr.splice(finishArr.indexOf(obj), 1);
        toDoArr.unshift(obj);
      }
      saveTodos();
      writeTodos();
      writeFinished();
      writeDeleted();
    });

    // When delete button is clicked, move todo to deleted list
    deleteBtn.addEventListener("click", () => {
      const obj = finishArr.find((t) => t.id === li.dataset.id);
      if (obj) {
        finishArr.splice(finishArr.indexOf(obj), 1);
        deleteArr.unshift(obj);
        console.log("DeleteArr:", deleteArr);
      }
      saveTodos();
      writeFinished();
      writeDeleted();
    });
  });
}

// Renders the list of deleted todos
function writeDeleted() {
  if (!deleteContainer) return;
  deleteContainer.innerHTML = "";
  // Create HTML for each deleted todo item
  deleteArr.forEach((todoObj) => {
    deleteContainer.innerHTML += `
           <li class="flex_col"data-id="${todoObj.id}">
        <div class="space_between flex_row">
          <div class="flex_row">
           <input type="checkbox" ${todoObj.done ? "checked" : ""}/>
            <h3>${todoObj.name}</h3>
           </div>
          <div class="flex_row">
            <p class="todoPriority  ${todoObj.priority}">${todoObj.priority ? todoObj.priority + " Priority" : ""}</p>
            <p class="todoDate">${todoObj.date ? "Due: " + todoObj.date : ""}</p>
          </div>
        </div>
        <p class="todoDesc">${todoObj.description ? todoObj.description : ""}</p>
        <div class="space_between flex_row">
          <p class="todoTag">${todoObj.tag ? todoObj.tag : ""}</p>
          
        </div>
      </li>`;
  });

  // Add event listener for clear deleted button
  const clearDeletedBtn = document.querySelector("#clearDeletedBtn");
  if (clearDeletedBtn) {
    clearDeletedBtn.onclick = function () {
      deleteArr = [];
      saveTodos();
      writeDeleted();
    };
  }
}
