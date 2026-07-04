/* ==========================================================
   KMYTE Online
   Dashboard
   Version : 1.0.0
========================================================== */

/* ==========================================================
   IMPORTS
========================================================== */

import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ==========================================================
   DASHBOARD START
========================================================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    loadSubscription(user.uid);

});

/* ==========================================================
   LOAD SUBSCRIPTION
========================================================== */

async function loadSubscription(uid) {

    const q = query(

        collection(db, "subscriptions"),

        where("uid", "==", uid),

        where("status", "==", "active")

    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        document.getElementById("subscriptionSection").style.display = "block";

        document.getElementById("activeSubscription").style.display = "none";

        return;

    }

    const data = snapshot.docs[0].data();

    document.getElementById("subscriptionSection").style.display = "none";

    document.getElementById("activeSubscription").style.display = "block";

    document.getElementById("activePlan").textContent =
        `${data.plan} Days`;

    document.getElementById("currentDay").textContent =
        `${data.currentDay} / ${data.plan}`;

}