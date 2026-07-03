/* ==========================================================
   KMYTE Online
   Main Application File
   Version : 1.0.0
========================================================== */

/* ==========================================================
   IMPORTS
========================================================== */

import { app, auth, db } from "./firebase.js";

/* ==========================================================
   APPLICATION START
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("======================================");
    console.log("      KMYTE ONLINE");
    console.log("======================================");

    initializeApplication();

});

/* ==========================================================
   INITIALIZE APPLICATION
========================================================== */

function initializeApplication() {

    console.log("✅ Application Started Successfully");

    console.log("Firebase App:", app);

    console.log("Firebase Auth:", auth);

    console.log("Firestore Database:", db);

}