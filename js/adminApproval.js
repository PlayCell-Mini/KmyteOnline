/* ==========================================================
   KMYTE Online
   Admin Payment Approval
   Version : 2.0.0
========================================================== */

import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const tbody = document.getElementById("paymentTableBody");

loadPayments();

/* ==========================================================
   LOAD SUBMITTED PAYMENTS
========================================================== */

async function loadPayments() {

    tbody.innerHTML = "";

    try {

        const q = query(
            collection(db, "payments"),
            where("status", "==", "submitted")
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5">No submitted payments.</td>
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

                    <td>${payment.paymentMethod || "-"}</td>

                    <td>${payment.transactionId || "-"}</td>

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

        attachEvents();

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================================
   APPROVE PAYMENT
========================================================== */

function attachEvents(){

    document.querySelectorAll(".approve-btn").forEach(button=>{

        button.addEventListener("click",async()=>{

            const paymentId=button.dataset.id;

            button.disabled=true;

            button.textContent="Approving...";

            try{

                await updateDoc(

                    doc(db,"payments",paymentId),

                    {

                        status:"approved",

                        approved:true,

                        paid:true,

                        approvedAt:serverTimestamp()

                    }

                );

                alert("Payment Approved Successfully.");

                loadPayments();

            }

            catch(error){

                console.error(error);

                alert(error.message);

            }

        });

    });

}