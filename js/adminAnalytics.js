/* ==========================================================
   KMYTE Online
   Admin Analytics
========================================================== */

import { db } from "./firebase.js";

import {

    collection,
    getDocs,
    query,
    where

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

loadAnalytics();

async function loadAnalytics() {

    try {

        /* ==========================
           TOTAL USERS
        ========================== */

        const users = await getDocs(collection(db, "users"));

        document.getElementById("totalUsers").textContent =
            users.size;

        /* ==========================
           ACTIVE SUBSCRIPTIONS
        ========================== */

        const activeSubs = await getDocs(

            query(

                collection(db, "subscriptions"),

                where("status", "==", "active")

            )

        );

        document.getElementById("activeSubscriptions").textContent =
            activeSubs.size;

        /* ==========================
           PENDING PAYMENTS
        ========================== */

        const pendingPayments = await getDocs(

            query(

                collection(db, "payments"),

                where("status", "==", "submitted")

            )

        );

        document.getElementById("pendingPayments").textContent =
            pendingPayments.size;

        /* ==========================
           PENDING WITHDRAWALS
        ========================== */

        const pendingWithdrawals = await getDocs(

            query(

                collection(db, "withdrawals"),

                where("status", "==", "pending")

            )

        );

        document.getElementById("pendingWithdrawals").textContent =
            pendingWithdrawals.size;

        /* ==========================
           TOTAL REVENUE
        ========================== */

        let revenue = 0;

        const approvedPayments = await getDocs(

            query(

                collection(db, "payments"),

                where("approved", "==", true)

            )

        );

        approvedPayments.forEach(doc => {

            revenue += doc.data().amount;

        });

        document.getElementById("totalRevenue").textContent =
            `PKR ${revenue}`;

    }

    catch(error){

        console.error(error);

    }

}