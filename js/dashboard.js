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


    /* ==========================
    LOAD TODAY PAYMENT
    ========================== */

    const paymentQuery = query(

        collection(db, "payments"),

        where("subscriptionId", "==", snapshot.docs[0].id),

        where("unlocked", "==", true),

        where("paid", "==", false)

    );

    const paymentSnapshot = await getDocs(paymentQuery);

    if (!paymentSnapshot.empty) {

        const payment = paymentSnapshot.docs[0].data();

        const todayAmount = document.getElementById("todayAmount");

        const paymentStatus = document.getElementById("paymentStatus");

        if (todayAmount) {

            todayAmount.textContent = `PKR ${payment.amount}`;

        }

        if (paymentStatus) {

            paymentStatus.textContent = payment.status;

        }

    }



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

    /* ==========================
    PROGRESS BAR
    ========================== */

    const progressBar = document.getElementById("progressBar");

    const progressText = document.getElementById("progressText");

    if (progressBar && progressText) {

        const progress =
            (subscription.currentDay / subscription.plan) * 100;

        progressBar.value = progress;

        console.log("Subscription Data:", subscription);
        console.log("Plan =", subscription.plan);
        console.log("Current Day =", subscription.currentDay);

        progressText.textContent =
            `Day ${subscription.currentDay} of ${subscription.plan}`;

    }
    await loadWallet(uid);
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