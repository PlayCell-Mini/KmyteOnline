/* ==========================================================
   KMYTE Online
   Subscription Module
========================================================== */

import { auth, db } from "./firebase.js";

import {
    createSubscription,
    generatePayments
} from "./firebaseService.js";

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


/* ==========================================================
   SUBSCRIBE BUTTONS
========================================================== */

const buttons = document.querySelectorAll(".subscribe-btn");

buttons.forEach((button) => {

    button.addEventListener("click", subscribePlan);

});


/* ==========================================================
   CREATE SUBSCRIPTION
========================================================== */

async function subscribePlan(e){

    const user = auth.currentUser;

    if(!user){

        alert("Please login first.");

        return;

    }

    const card = e.target.closest(".plan-card");

    const plan = Number(card.dataset.plan);

    // Check Existing Active Subscription

    const q = query(

        collection(db,"subscriptions"),

        where("uid","==",user.uid),

        where("status","==","active")

    );

    const snapshot = await getDocs(q);

    if(!snapshot.empty){

        alert("You already have an active subscription.");

        return;

    }

    const settingsRef = doc(db, "settings", "app");

    const settingsSnap = await getDoc(settingsRef);

    const settings = settingsSnap.data();

    let amount = 0;

    switch(plan){

        case 7:
            amount = settings.plan7Amount;
            break;

        case 15:
            amount = settings.plan15Amount;
            break;

        case 30:
            amount = settings.plan30Amount;
            break;

    }

    const subscriptionId = await createSubscription({

        uid: user.uid,

        plan: plan,

        status: "active",

        currentDay: 1,

        completed: false,

        startDate: serverTimestamp()

    });

    await generatePayments(

        user.uid,

        subscriptionId,

        plan,

        amount

    );

    alert("Subscription Activated Successfully!");

}