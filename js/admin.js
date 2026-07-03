/* ==========================================================
   KMYTE Online
   Admin Panel
   Version : 1.0.0
========================================================== */

/* ==========================================================
   IMPORTS
========================================================== */

import { auth, db } from "./firebase.js";

import { logoutUser } from "./auth.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ==========================================================
   ADMIN AUTH CHECK
========================================================== */

onAuthStateChanged(auth, async (user) => {

    // Not Logged In

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            alert("User record not found.");

            window.location.href = "login.html";

            return;

        }

        const userData = userSnap.data();

        // Check Role

        if (userData.role !== "admin") {

            alert("Access Denied!");

            window.location.href = "dashboard.html";

            return;

        }

        // Welcome Message

        const welcome = document.getElementById("adminWelcome");

        if (welcome) {

            welcome.innerHTML = `Welcome Admin, ${userData.fullName} 👋`;

        }

        console.log("✅ Admin Verified");

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

});

/* ==========================================================
   LOGOUT
========================================================== */

const logoutBtn = document.getElementById("adminLogout");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async (e) => {

        e.preventDefault();

        await logoutUser();

    });

}