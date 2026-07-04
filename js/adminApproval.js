/* ==========================================================
   KMYTE Online
   Admin Payment Approval
========================================================== */

import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const tbody = document.getElementById("paymentTableBody");

loadPayments();

async function loadPayments() {

    tbody.innerHTML = "";

    const q = query(

        collection(db, "payments"),

        where("status", "==", "submitted")

    );

    const snapshot = await getDocs(q);

    console.log("Documents Found:", snapshot.size);


    if (snapshot.empty) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No submitted payments.
                </td>
            </tr>
        `;

        return;

    }

    snapshot.forEach(docSnap => {

        const payment = docSnap.data();

        tbody.innerHTML += `

        <tr>

            <td>${payment.uid}</td>

            <td>PKR ${payment.amount}</td>

            <td>${payment.paymentMethod}</td>

            <td>${payment.transactionId}</td>

            <td>

                <button
                    class="approve-btn"
                    data-id="${docSnap.id}">

                    Approve

                </button>

            </td>

        </tr>

        `;

    });

}