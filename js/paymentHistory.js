/* ==========================================================
   KMYTE Online
   Payment History
========================================================== */

import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    loadHistory(user.uid);

});

async function loadHistory(uid) {

    const tbody = document.getElementById("paymentHistoryBody");

    tbody.innerHTML = "";

    try {

        const q = query(

            collection(db, "payments"),

            where("uid", "==", uid),

            orderBy("day")

        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="6">

                        No payment history.

                    </td>

                </tr>

            `;

            return;

        }

        snapshot.forEach(docSnap => {

            const payment = docSnap.data();

            const date = payment.createdAt
                ? payment.createdAt.toDate().toLocaleDateString()
                : "-";

            tbody.innerHTML += `

                <tr>

                    <td>Day ${payment.day}</td>

                    <td>PKR ${payment.amount}</td>

                    <td>${payment.status}</td>

                    <td>${payment.paymentMethod || "-"}</td>

                    <td>${payment.transactionId || "-"}</td>

                    <td>${date}</td>

                </tr>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}