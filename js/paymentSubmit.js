/* ==========================================================
   KMYTE Online
   Payment Submit
   Version : 1.1.0
========================================================== */

/* ==========================================================
   IMPORTS
========================================================== */

import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ==========================================================
   VARIABLES
========================================================== */

const params = new URLSearchParams(window.location.search);

const paymentId = params.get("id");

const paymentAmount = document.getElementById("paymentAmount");

const paymentMethod = document.getElementById("paymentMethod");

const transactionId = document.getElementById("transactionId");

const submitBtn = document.getElementById("submitPaymentBtn");

/* ==========================================================
   VALIDATE PAYMENT ID
========================================================== */

if (!paymentId) {

    alert("Invalid Payment.");

    window.location.href = "dashboard.html";

}

/* ==========================================================
   AUTH CHECK
========================================================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    await loadPayment();

});

/* ==========================================================
   LOAD PAYMENT
========================================================== */

async function loadPayment() {

    try {

        const paymentRef = doc(db, "payments", paymentId);

        const paymentSnap = await getDoc(paymentRef);

        if (!paymentSnap.exists()) {

            alert("Payment not found.");

            window.location.href = "dashboard.html";

            return;

        }

        const payment = paymentSnap.data();

        paymentAmount.textContent =
            `Today's Payment : PKR ${payment.amount}`;

        if (payment.status === "submitted") {

            submitBtn.disabled = true;

            submitBtn.textContent = "Already Submitted";

        }

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

/* ==========================================================
   SUBMIT PAYMENT
========================================================== */

submitBtn.addEventListener("click", submitPayment);

async function submitPayment() {

    const method = paymentMethod.value;

    const trx = transactionId.value.trim();

    if (method === "") {

        alert("Please select payment method.");

        return;

    }

    if (trx.length < 5) {

        alert("Please enter a valid Transaction ID.");

        return;

    }

    try {

        submitBtn.disabled = true;

        submitBtn.textContent = "Submitting...";

        await updateDoc(

            doc(db, "payments", paymentId),

            {

                paymentMethod: method,

                transactionId: trx,

                status: "submitted",

                submittedAt: serverTimestamp()

            }

        );

        alert("Payment submitted successfully.");

        window.location.href = "dashboard.html";

    }

    catch (error) {

        console.error(error);

        alert(error.message);

        submitBtn.disabled = false;

        submitBtn.textContent = "Submit Payment";

    }

}