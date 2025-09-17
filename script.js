let toDoArr = [];
let deleteArr = [];
let finishArr = [];

// DOM elements
const submit = document.querySelector("#submit");
const clearDeletedBtn = document.querySelector("#clearDeletedBtn");

const todoContainer = document.querySelector("#todoContainer");
const finishContainer = document.querySelector("#finishContainer");
const deleteContainer = document.querySelector("#deleteContainer");

const todoNameInput = document.querySelector("#todoNameInput");
const todoDescInput = document.querySelector("#todoDescInput");
const priorityInput = document.querySelector("#priorityInput");

submit.addEventListener("click", submitToDo);

// load todos from localStorage
function loadTodos() {
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

loadTodos();
writeTodos();
writeFinished();
writeDeleted();

// Adds a new todo to the list
function submitToDo() {
  const todoObj = {
    name: todoNameInput.value,
    id: self.crypto.randomUUID(), // Unique ID for each todo
    done: false,
    description: todoDescInput.value,
    priority: priorityInput.value,
  };
  toDoArr.unshift(todoObj); // Add to the beginning of the array
  saveTodos();
  writeTodos();
  writeFinished();
  writeDeleted();
}

// prints the list of active todos
function writeTodos() {
  print(todoContainer, toDoArr);

  todoContainer.querySelectorAll("li").forEach((li) => {
    const checkBox = li.querySelector("input");
    const deleteBtn = li.querySelector(".deleteBtn");

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
  print(finishContainer, finishArr);

  // Add event listeners for checkboxes and delete buttons
  finishContainer.querySelectorAll("li").forEach((li) => {
    const checkBox = li.querySelector("input");
    const deleteBtn = li.querySelector(".deleteBtn");

    // When checkbox is unchecked, move todo back to active list
    checkBox.addEventListener("change", () => {
      if (!checkBox.checked) {
        const obj = finishArr.find((toDo) => toDo.id === li.dataset.id);
        if (obj) {
          obj.done = false;
          finishArr.splice(finishArr.indexOf(obj), 1);
          toDoArr.unshift(obj);
        }
        saveTodos();
        writeTodos();
        writeFinished();
        writeDeleted();
      }
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

// prints the deleted todos
function writeDeleted() {
  print(deleteContainer, deleteArr);
}

if (clearDeletedBtn) {
  clearDeletedBtn.onclick = function () {
    deleteArr = [];
    saveTodos();
    writeDeleted();
  };
}

// print function to render todos in a given container
function print(container, arr) {
  console.log("print function");
  // make sure container is empty.
  container.innerHTML = "";
  // run through the array and create an li for each todo
  arr.forEach((todoObj) => {
    container.innerHTML += `
        <li class="flexCol"data-id="${todoObj.id}">
        <div class="spaceBetween flexRow">
          <div class="flexRow">
           <input type="checkbox" ${todoObj.done ? "checked" : ""}/>
            <h3>${todoObj.name}</h3>
           </div>
          <div class="flexRow">
            <p class="todoPriority  ${todoObj.priority}">${todoObj.priority ? todoObj.priority + " Priority" : ""}</p>
          </div>
        </div>
        <p class="todoDesc">${todoObj.description ? todoObj.description : ""}</p>
        ${arr === deleteArr ? "" : '<button class="deleteBtn">delete</button>'}
      </li>
      `;
  });
}
