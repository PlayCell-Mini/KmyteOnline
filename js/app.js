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

    console.log("====================================");
    console.log("KMYTE Online");
    console.log("Application Started Successfully");
    console.log("====================================");

    initializeApp();

});

/* ==========================================================
   INITIALIZE APPLICATION
========================================================== */

function initializeApp(){

    console.log("Firebase Connected Successfully");

    console.log(app);
    console.log(auth);
    console.log(db);

}