/* ==========================================================
   KMYTE Online
   Admin Payment Approval
   Version : 2.0.0
========================================================== */

import { createNotification } from "./notificationService.js";

import { db } from "./firebase.js";


import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
    increment,
    addDoc
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
                const paymentSnap = await getDoc(doc(db, "payments", paymentId));

                const payment = paymentSnap.data();

                const userRef = doc(db, "users", payment.uid);

                await updateDoc(userRef, {

                    "wallet.totalPaid": increment(payment.amount),

                    "wallet.totalPending": increment(payment.amount)

                });

                const nextQuery = query(
                    collection(db, "payments"),
                    where("subscriptionId", "==", payment.subscriptionId),
                    where("day", "==", payment.day + 1)
                );

                const nextSnapshot = await getDocs(nextQuery);

                if (!nextSnapshot.empty) {

                    await updateDoc(

                        doc(db, "payments", nextSnapshot.docs[0].id),

                        {

                            unlocked: true

                        }

                    );

                }

                /* ==========================================================
                CHECK SUBSCRIPTION COMPLETION
                ========================================================== */

                if (nextSnapshot.empty) {

                    const subscriptionRef = doc(
                        db,
                        "subscriptions",
                        payment.subscriptionId
                    );

                    // Get subscription details
                    const subscriptionSnap = await getDoc(subscriptionRef);

                    const subscription = subscriptionSnap.data();

                    // Mark subscription completed
                    await updateDoc(subscriptionRef, {

                        status: "completed",

                        completed: true,

                        completedAt: serverTimestamp()

                    });

                    // Send notification
                    await createNotification(

                        payment.uid,

                        "Subscription Completed",

                        `Congratulations! You have successfully completed your ${subscription.plan} Days subscription.`,

                        "subscription"

                    );

                }

                /* ==========================================================
                CREATE NOTIFICATION
                ========================================================== */

                await createNotification(

                    payment.uid,

                    "Payment Approved",

                    `Your Day ${payment.day} payment of PKR ${payment.amount} has been approved.`,

                    "payment"

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