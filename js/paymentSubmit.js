/* ==========================================================
   KMYTE Online
   Payment Submit
   Version : 1.0.0
========================================================== */

import { auth, db, storage } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ==========================================================
   GET PAYMENT ID
========================================================== */

const params = new URLSearchParams(window.location.search);

const paymentId = params.get("id");

if (!paymentId) {

    alert("Invalid Payment.");

    window.location.href = "dashboard.html";

}

/* ==========================================================
   LOAD PAYMENT
========================================================== */

async function loadPayment(){

    const paymentRef = doc(db,"payments",paymentId);

    const paymentSnap = await getDoc(paymentRef);

    if(!paymentSnap.exists()){

        alert("Payment not found.");

        return;

    }

    const payment = paymentSnap.data();

    document.getElementById("paymentAmount").textContent =
        `Today's Payment : PKR ${payment.amount}`;

}

loadPayment();