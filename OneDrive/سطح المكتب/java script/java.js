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