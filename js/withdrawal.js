/* ==========================================================
   KMYTE Online
   Withdrawal Module
   Version : 1.0.0
========================================================== */

import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp,
    updateDoc,
    increment,
    query,
    where,
    getDocs,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let currentUser = null;

/* ==========================================================
   AUTH
========================================================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    currentUser = user;
    loadHistory(user.uid);

});

/* ==========================================================
   SUBMIT
========================================================== */

const form = document.getElementById("withdrawForm");

if (form) {

    form.addEventListener("submit", submitWithdrawal);

}

async function submitWithdrawal(e) {

    e.preventDefault();

    try {

        const method =
            document.getElementById("method").value;

        const accountTitle =
            document.getElementById("accountTitle").value.trim();

        const accountNumber =
            document.getElementById("accountNumber").value.trim();

        const amount =
            Number(document.getElementById("amount").value);

        const userRef = doc(db, "users", currentUser.uid);

        const userSnap = await getDoc(userRef);

        const user = userSnap.data();

        const balance =
            user.wallet.totalPending;

        if (amount <= 0) {

            alert("Invalid amount.");

            return;

        }

        if (amount > balance) {

            alert("Insufficient wallet balance.");

            return;

        }

        await addDoc(

            collection(db, "withdrawals"),

            {

                uid: currentUser.uid,

                amount,

                method,

                accountTitle,

                accountNumber,

                status: "pending",

                createdAt: serverTimestamp()

            }

        );

        await updateDoc(userRef, {

            "wallet.totalPending": increment(-amount),

            "withdrawal.requested": true,

            "withdrawal.status": "pending"

        });

        alert("Withdrawal request submitted.");

        window.location.href = "dashboard.html";

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}


/* ==========================================================
   LOAD WITHDRAWAL HISTORY
========================================================== */

async function loadHistory(uid) {

    const tbody = document.getElementById("withdrawHistoryBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    try {

        const q = query(

            collection(db, "withdrawals"),

            where("uid", "==", uid),

            orderBy("createdAt", "desc")

        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="4">

                        No withdrawal history.

                    </td>

                </tr>

            `;

            return;

        }

        snapshot.forEach(docSnap => {

            const item = docSnap.data();

            const date = item.createdAt
                ? item.createdAt.toDate().toLocaleDateString()
                : "-";

            tbody.innerHTML += `

                <tr>

                    <td>PKR ${item.amount}</td>

                    <td>${item.method}</td>

                    <td>${item.status}</td>

                    <td>${date}</td>

                </tr>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}