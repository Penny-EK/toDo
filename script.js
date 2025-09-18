let toDoArr = [];
let deleteArr = [];
let finishArr = [];

// DOM elements
const submit = document.querySelector("#submit");
const clearDeletedBtn = document.querySelector("#clearDeletedBtn");
const deleteBtn = document.querySelector(".deleteBtn");

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
refresh();

// Adds a new todo to the list
function submitToDo() {
  const todoObj = {
    name: todoNameInput.value,
    id: self.crypto.randomUUID(),
    done: false,
    description: todoDescInput.value,
    priority: priorityInput.value,
  };
  toDoArr.unshift(todoObj);
  saveTodos();
  refresh();
}

// prints the list of active todos
function writeTodos() {
  print(todoContainer, toDoArr);
}

// Renders the list of finished todos
function writeFinished() {
  print(finishContainer, finishArr);
}

// prints the deleted todos
function writeDeleted() {
  print(deleteContainer, deleteArr);
  if (clearDeletedBtn) {
    clearDeletedBtn.onclick = function () {
      deleteArr = [];
      saveTodos();
      writeDeleted();
    };
  }
}

function refresh() {
  writeTodos();
  writeFinished();
  writeDeleted();
}

// print function to render todos in a given container
function print(container, arr) {
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

  container.querySelectorAll("li").forEach((li) => {
    const checkBox = li.querySelector("input[type='checkbox']");
    if (!checkBox) return;
    checkBox.addEventListener("change", () => {
      if (arr === toDoArr && checkBox.checked) {
        // Move from active to finished
        const obj = toDoArr.find((toDo) => toDo.id === li.dataset.id);
        if (obj) {
          obj.done = true;
          toDoArr.splice(toDoArr.indexOf(obj), 1);
          finishArr.unshift(obj);
        }
      } else if (arr === finishArr && !checkBox.checked) {
        // Move from finished to active
        const obj = finishArr.find((toDo) => toDo.id === li.dataset.id);
        if (obj) {
          obj.done = false;
          finishArr.splice(finishArr.indexOf(obj), 1);
          toDoArr.unshift(obj);
        }
      }

      saveTodos();
      refresh();
    });
    if (arr !== deleteArr) {
      const deleteBtn = li.querySelector(".deleteBtn");
      deleteBtn.addEventListener("click", () => {
        const obj = arr.find((t) => t.id === li.dataset.id);
        if (obj) {
          arr.splice(arr.indexOf(obj), 1);
          deleteArr.unshift(obj);
          console.log("DeleteArr:", deleteArr);
        }
        saveTodos();
        refresh();
      });
    }
  });
}
