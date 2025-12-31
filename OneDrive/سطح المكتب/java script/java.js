import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
      import {
        getFirestore,
        collection,
        addDoc,
        enableIndexedDbPersistence
      } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

      const firebaseConfig = {
        apiKey: "AIzaSyBXq7jILw3hQb7xz4FCbISPodcMHCYHSoM",
        authDomain: "to-do-list-b4aa9.firebaseapp.com",
        projectId: "to-do-list-b4aa9",
        storageBucket: "to-do-list-b4aa9.firebasestorage.app",
        messagingSenderId: "794888143408",
        appId: "1:794888143408:web:d4c9de813cc43b7e8063f5"
      };
        const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      enableIndexedDbPersistence(db).catch((err) => {
        console.log("Persistence error:", err);
      });
      async function addTaskToFirestore(title) {
        const trimmed = (title || "").trim();
        if (!trimmed) return;

        try {
          await addDoc(collection(db, "tasks"), {
            title: trimmed,
            done: false,
            createdAt: Date.now()
          });
          console.log("Task saved to Firestore (with offline persistence).");
        } catch (err) {
          console.log("Error saving task:", err);
        }
      }

      window.addTaskToFirestore = addTaskToFirestore;
  

   
      const todoInput = document.querySelector("input[name='taskInput']");
        const errorDiv = document.querySelector(".error-message");
      const addTaskButton = document.querySelector(".add-task-button");
      const taskList = document.querySelector(".task-list");
      const filterAllButton = document.querySelector(".filter-all");
      const filterDoneButton = document.querySelector(".filter-done");
      const filterTodoButton = document.querySelector(".filter-todo");
      const deleteDoneTasksButton = document.querySelector(".delete-done-tasks-button");
      const deleteAllTasksButton = document.querySelector(".delete-all-tasks-button");
      let tasks = [];

     
      const loadTasksFromLocalStorage = () => {
        const isFirstLoad = !localStorage.getItem("hasLoadedBefore");
        if (isFirstLoad) {
          tasks = [...defaultTasks];
          saveTasksToLocalStorage();
          localStorage.setItem("hasLoadedBefore", "true");
        } else {
          const savedTasks = localStorage.getItem("tasks");
          tasks = savedTasks ? JSON.parse(savedTasks) : [...defaultTasks];
        }
      };

      const saveTasksToLocalStorage = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
      };

     
      const renderTasks = (filteredTasks = tasks) => {
        taskList.innerHTML = "";

        if (filteredTasks.length === 0) {
          taskList.innerHTML = "<p>No tasks available</p>";
          updateButtonStates();
          return;
        }

        filteredTasks.forEach((task, displayIndex) => {
          const originalIndex = tasks.indexOf(task);

          const taskElement = document.createElement("div");
          taskElement.classList.add("list-box");
          taskElement.innerHTML = `
            <div>
              <span class="task-text ${task.done ? "task-done" : ""}">
                ${String.fromCharCode(97 + displayIndex)}. ${task.text}
              </span>
            </div>
            <div>
              <input type="checkbox" class="task-checkbox" ${
                task.done ? "checked" : ""
              } data-index="${originalIndex}" />
              <i class="fa-solid fa-pen edit-icon" data-index="${originalIndex}"></i>
              <i class="fa-solid fa-trash-can delete-icon" data-index="${originalIndex}"></i>
            </div>
          `;
          taskList.appendChild(taskElement);

          addTaskEvents(taskElement, originalIndex);
        });

        updateButtonStates();
      };

    
      const addTaskEvents = (taskElement, index) => {
        const checkbox = taskElement.querySelector(".task-checkbox");
        const editIcon = taskElement.querySelector(".fa-pen");
        const deleteIcon = taskElement.querySelector(".fa-trash-can");

        checkbox.addEventListener("change", (e) => {
          tasks[index].done = e.target.checked;
          saveTasksToLocalStorage();
          applyActiveFilterAndRender();
        });

        editIcon.addEventListener("click", () => {
          currentEditIndex = index;
          editTaskInput.value = tasks[index].text;
          editModal.style.display = "block";
        });

        deleteIcon.addEventListener("click", () => {
          currentDeleteIndex = index;
          currentDeleteType = null;
          const titleEl = document.querySelector(".delete-modal-title");
          const msgEl = document.querySelector(".delete-modal-message");
          if (titleEl) titleEl.textContent = "Delete Task";
          if (msgEl) msgEl.textContent = "Are you sure you want to delete this task?";
          deleteModal.style.display = "block";
        });
      };

    
      todoInput.addEventListener("input", () => {
        const task = todoInput.value.trim();
        if (task === "") {
          showError("Task cannot be empty.");
        } else if (!isNaN(task.charAt(0))) {
          showError("Task cannot start with a number.");
        } else if (task.length < 5) {
          showError("Task must be at least 5 characters long.");
        } else {
          clearError();
        }
      });

  
      const updateDatalist = () => {
        const datalist = document.getElementById("customTasks");
        if (!datalist) return;
        datalist.innerHTML = "";

        const uniqueTasks = new Set();
        tasks.forEach((task) => {
          if (!task.isDefault) {
            uniqueTasks.add(task.text);
          }
        });

        uniqueTasks.forEach((taskText) => {
          const option = document.createElement("option");
          option.value = taskText;
          datalist.appendChild(option);
        });
      };

   
      const updateButtonStates = () => {
        if (tasks.length === 0) {
          deleteAllTasksButton.disabled = true;
          deleteAllTasksButton.style.backgroundColor = "red";
        } else {
          deleteAllTasksButton.disabled = false;
          deleteAllTasksButton.style.backgroundColor = "#007bff";
        }

        if (tasks.every((task) => !task.done)) {
          deleteDoneTasksButton.disabled = true;
          deleteDoneTasksButton.style.backgroundColor = "red";
        } else {
          deleteDoneTasksButton.disabled = false;
          deleteDoneTasksButton.style.backgroundColor = "#007bff";
        }
      };


      let activeFilter = localStorage.getItem("activeFilter") || "all";

      const setActiveFilter = (filter) => {
        activeFilter = filter;
        localStorage.setItem("activeFilter", filter);
        applyActiveFilterAndRender();
      };

      const applyActiveFilterAndRender = () => {
        if (activeFilter === "done") {
          renderTasks(tasks.filter((task) => task.done));
        } else if (activeFilter === "todo") {
          renderTasks(tasks.filter((task) => !task.done));
        } else {
          renderTasks();
        }
      };

      filterAllButton.addEventListener("click", () => {
        setActiveFilter("all");
      });

      filterDoneButton.addEventListener("click", () => {
        setActiveFilter("done");
      });

      filterTodoButton.addEventListener("click", () => {
        setActiveFilter("todo");
      });

   
      deleteDoneTasksButton.addEventListener("click", () => {
        currentDeleteType = "done";
        currentDeleteIndex = null;
        const titleEl = document.querySelector(".delete-modal-title");
        const msgEl = document.querySelector(".delete-modal-message");
        if (titleEl) titleEl.textContent = "Delete Done Tasks";
        if (msgEl) msgEl.textContent = "Are you sure you want to delete all completed tasks?";
        deleteModal.style.display = "block";
      });

      deleteAllTasksButton.addEventListener("click", () => {
        currentDeleteType = "all";
        currentDeleteIndex = null;
        const titleEl = document.querySelector(".delete-modal-title");
        const msgEl = document.querySelector(".delete-modal-message");
        if (titleEl) titleEl.textContent = "Delete All Tasks";
        if (msgEl) msgEl.textContent = "Are you sure you want to delete all tasks?";
        deleteModal.style.display = "block";
      });

      confirmDeleteButton.addEventListener("click", () => {
        if (currentDeleteIndex !== null) {
          tasks.splice(currentDeleteIndex, 1);
          currentDeleteIndex = null;
        } else if (currentDeleteType === "done") {
          tasks = tasks.filter((task) => !task.done);
        } else if (currentDeleteType === "all") {
          tasks = [];
        }

        saveTasksToLocalStorage();
        applyActiveFilterAndRender();
        updateDatalist();
        deleteModal.style.display = "none";
        currentDeleteType = null;
      });

      cancelDeleteButton.addEventListener("click", () => {
        deleteModal.style.display = "none";
        currentDeleteType = null;
      });

      
      saveTaskButton.addEventListener("click", () => {
        if (currentEditIndex !== null) {
          const newText = editTaskInput.value.trim();
          if (newText) {
            tasks[currentEditIndex].text = newText;
            saveTasksToLocalStorage();
            applyActiveFilterAndRender();
            updateDatalist();
          }
          editModal.style.display = "none";
          currentEditIndex = null;
        }
      });

      cancelTaskButton.addEventListener("click", () => {
        editModal.style.display = "none";
        currentEditIndex = null;
      });

     
      const handleAddTask = () => {
        const task = todoInput.value.trim();
        if (task === "" || !isNaN(task.charAt(0)) || task.length < 5) {
          showError("Invalid task. Please check your input.");
          return;
        }

        tasks.unshift({ text: task, done: false });
        todoInput.value = "";
        clearError();
        saveTasksToLocalStorage();
        applyActiveFilterAndRender();
        updateDatalist();

        if (window.addTaskToFirestore) {
          window.addTaskToFirestore(task).catch((err) =>
            console.log("Firestore error:", err)
          );
        }
      };

      addTaskButton.addEventListener("click", handleAddTask);

      todoInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAddTask();
        }
      });

     
      const showError = (message) => {
        errorDiv.textContent = message;
      };

      const clearError = () => {
        errorDiv.textContent = "";
      };

    
      document.addEventListener("DOMContentLoaded", () => {
        loadTasksFromLocalStorage();
        applyActiveFilterAndRender();
        updateDatalist();
        updateButtonStates();
      });