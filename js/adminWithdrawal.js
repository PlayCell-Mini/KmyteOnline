/* ==========================================================
   KMYTE Online
   Admin Withdrawal Approval
========================================================== */
console.log("Admin Withdrawal JS Loaded");
import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const tbody = document.getElementById("withdrawTableBody");

loadWithdrawals();

async function loadWithdrawals() {

    tbody.innerHTML = "";

    try {

        const q = query(

            collection(db, "withdrawals"),

            where("status", "==", "pending")

        );
        const snapshot = await getDocs(q);

        console.log("Withdraw Documents:", snapshot.size);

        snapshot.forEach(doc => {
            console.log(doc.id, doc.data());
        });
        

        if (snapshot.empty) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="6">

                        No pending withdrawals.

                    </td>

                </tr>

            `;

            return;

        }

        snapshot.forEach(docSnap => {

            const withdrawal = docSnap.data();

            tbody.innerHTML += `

                <tr>

                    <td>${withdrawal.uid}</td>

                    <td>PKR ${withdrawal.amount}</td>

                    <td>${withdrawal.method}</td>

                    <td>${withdrawal.accountTitle}</td>

                    <td>${withdrawal.accountNumber}</td>

                    <td>

                        <button
                            class="approve-withdraw"
                            data-id="${docSnap.id}">

                            Approve

                        </button>

                    </td>

                </tr>

            `;

        });
        attachEvents();
    }

    catch(error){

        console.error(error);

    }

}