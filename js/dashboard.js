/* ==========================================================
   KMYTE Online
   Dashboard Module
   Version : 2.0.0
========================================================== */

/* ==========================================================
   IMPORTS
========================================================== */

import { auth, db } from "./firebase.js";

import { logoutUser } from "./auth.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ==========================================================
   AUTH CHECK
========================================================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    try {

        /* ==========================
           LOAD USER
        ========================== */

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            alert("User data not found.");

            return;

        }

        const userData = userSnap.data();

        const welcomeText = document.getElementById("welcomeText");

        if (welcomeText) {

            welcomeText.innerHTML = `Welcome, ${userData.fullName} 👋`;

        }

        /* ==========================
           LOAD SUBSCRIPTION
        ========================== */

        await loadSubscription(user.uid);

    }

    catch (error) {

        console.error(error);

    }

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

    const subscriptionSection =
        document.getElementById("subscriptionSection");

    const activeSubscription =
        document.getElementById("activeSubscription");

    if (snapshot.empty) {

        if (subscriptionSection)
            subscriptionSection.style.display = "block";

        if (activeSubscription)
            activeSubscription.style.display = "none";

        return;

    }

    const subscription = snapshot.docs[0].data();

    if (subscriptionSection)
        subscriptionSection.style.display = "none";

    if (activeSubscription)
        activeSubscription.style.display = "block";

    const activePlan =
        document.getElementById("activePlan");

    const currentDay =
        document.getElementById("currentDay");

    if (activePlan) {

        activePlan.textContent =
            `${subscription.plan} Days`;

    }

    if (currentDay) {

        currentDay.textContent =
            `${subscription.currentDay} / ${subscription.plan}`;

    }

}

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