// ==========================================================
// KMYTE Online
// Firebase Configuration
// ==========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase Config

const firebaseConfig = {
    apiKey: "AIzaSyBUeWih6FR4brqc8mmNgqCv7blhN2s-t4w",
    authDomain: "kmyteonline.firebaseapp.com",
    projectId: "kmyteonline",
    storageBucket: "kmyteonline.firebasestorage.app",
    messagingSenderId: "732800529865",
    appId: "1:732800529865:web:660adf6e9288243bf8a418",
    measurementId: "G-E41CL2H01B"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

// Export

export { app, auth, db };