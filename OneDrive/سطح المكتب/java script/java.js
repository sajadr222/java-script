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
