/* ==========================================================
   KMYTE Online
   Payment Module
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


let currentPaymentId = null;

/* ==========================================================
   LOAD TODAY PAYMENT
========================================================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    await loadTodayPayment(user.uid);

});

/* ==========================================================
   FUNCTION
========================================================== */

async function loadTodayPayment(uid) {

    try {

        const paymentQuery = query(

            collection(db, "payments"),

            where("uid", "==", uid),
            where("unlocked", "==", true),
            where("paid", "==", false)

        );

        const snapshot = await getDocs(paymentQuery);

        if (snapshot.empty) {

            document.getElementById("todayAmount").textContent = "No Payment";

            document.getElementById("paymentStatus").textContent = "-";

            return;

        }

        const paymentDoc = snapshot.docs[0];

        const payment = paymentDoc.data();

        currentPaymentId = paymentDoc.id;

        document.getElementById("todayAmount").textContent =
            `PKR ${payment.amount}`;

        document.getElementById("paymentStatus").textContent =
            payment.status;

        console.log("Today's Payment:", payment);

    }

    catch (error) {

        console.error(error);

    }

}

const payNowBtn = document.getElementById("payNowBtn");

if (payNowBtn) {

    payNowBtn.addEventListener("click", () => {

        if (!currentPaymentId) {

            alert("Payment not found.");

            return;

        }

        window.location.href = `payment.html?id=${currentPaymentId}`;

    });

}