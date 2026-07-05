/* ==========================================================
   KMYTE Online
   Live Session Guard
========================================================== */

import { auth, db } from "./firebase.js";

import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let unsubscribe = null;

onAuthStateChanged(auth, (user) => {

    if (!user) return;

    if (unsubscribe) {

        unsubscribe();

    }

    const userRef = doc(db, "users", user.uid);

    unsubscribe = onSnapshot(userRef, async (snapshot) => {

        if (!snapshot.exists()) return;

        const data = snapshot.data();

        if (data.status === "Suspended") {

            alert("Your account has been suspended.");

            await signOut(auth);

            window.location.href = "login.html";

        }

    });

});