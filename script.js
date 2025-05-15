const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo(e) {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  todos.push({
    id: Date.now() + Math.random(),
    text,
    completed: false
  });

  saveTodos();
  renderTodos();
  todoInput.value = "";
}

function toggleCompleteById(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
}

function deleteTodoById(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

function renderTodos() {
  todoList.innerHTML = "";

  const filtered = todos.filter(todo => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  filtered.forEach(todo => {
    const li = document.createElement("li");
    if (todo.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleCompleteById(todo.id));

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.className = "delete-btn";
    delBtn.addEventListener("click", () => deleteTodoById(todo.id));

    const textWrapper = document.createElement("div");
    textWrapper.className = "text-wrapper";

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    const toggleLink = document.createElement("button");
    toggleLink.className = "toggle-link";

    const isLong = todo.text.length > 100;
    let isExpanded = false;

    function updateText() {
      if (isLong) {
        if (isExpanded) {
          span.classList.remove("clamped");
          toggleLink.textContent = " See less";
        } else {
          span.classList.add("clamped");
          toggleLink.textContent = " See more";
        }
        toggleLink.style.display = "inline";
      } else {
        toggleLink.style.display = "none";
      }
    }

    toggleLink.addEventListener("click", (e) => {
      e.stopPropagation();
      isExpanded = !isExpanded;
      updateText();
    });

    updateText();

    textWrapper.appendChild(span);
    textWrapper.appendChild(toggleLink);

    li.appendChild(checkbox);
    li.appendChild(textWrapper);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTodos();
  });
});

todoForm.addEventListener("submit", addTodo);
renderTodos();
