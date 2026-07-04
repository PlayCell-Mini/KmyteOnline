/* ==========================================================
   KMYTE Online
   Subscription Module
========================================================== */

import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

async function loadPlans(){

    const settingsRef = doc(db, "settings", "app");

    const settingsSnap = await getDoc(settingsRef);

    if(!settingsSnap.exists()){

        alert("Settings not found.");

        return;

    }

    const settings = settingsSnap.data();

    document.getElementById("plan7Amount").textContent =
        `PKR ${settings.plan7Amount}`;

    document.getElementById("plan15Amount").textContent =
        `PKR ${settings.plan15Amount}`;

    document.getElementById("plan30Amount").textContent =
        `PKR ${settings.plan30Amount}`;

}

loadPlans();