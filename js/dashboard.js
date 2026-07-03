/* ==========================================================
   KMYTE Online
   Dashboard Module
   Version : 1.0.0
========================================================== */

/* ==========================================================
   IMPORTS
========================================================== */

import { auth, db } from "./firebase.js";

import { logoutUser } from "./auth.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ==========================================================
   AUTH CHECK
========================================================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            alert("User data not found.");

            return;

        }

        const data = userSnap.data();

        const welcomeText = document.getElementById("welcomeText");

        if (welcomeText) {

            welcomeText.innerHTML = `Welcome, ${data.fullName} 👋`;

        }

    }

    catch (error) {

        console.error(error);

    }

});

/* ==========================================================
   LOGOUT
========================================================== */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async (e) => {

        e.preventDefault();

        await logoutUser();

    });

}