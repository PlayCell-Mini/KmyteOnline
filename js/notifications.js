/* ==========================================================
   KMYTE Online
   Notification Module
========================================================== */

import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

console.log("Notifications JS Loaded");

const btn = document.getElementById("notificationBtn");
const panel = document.getElementById("notificationPanel");
const list = document.getElementById("notificationList");
const badge = document.getElementById("notificationCount");

console.log(btn);
console.log(panel);
console.log(list);
console.log(badge);

/* ==========================================================
   TOGGLE PANEL
========================================================== */

btn.addEventListener("click", () => {

    panel.style.display =
        panel.style.display === "block"
            ? "none"
            : "block";

});

/* ==========================================================
   AUTH
========================================================== */

onAuthStateChanged(auth, (user) => {

    if (!user) return;

    loadNotifications(user.uid);

});

/* ==========================================================
   LOAD
========================================================== */

function loadNotifications(uid) {

    const q = query(

        collection(db, "notifications"),

        where("uid", "==", uid),

        orderBy("createdAt", "desc")

    );

    onSnapshot(q, (snapshot) => {

        list.innerHTML = "";

        let unread = 0;

        if (snapshot.empty) {

            list.innerHTML = `

                <p>

                    No notifications.

                </p>

            `;

            badge.textContent = "0";

            return;

        }

        snapshot.forEach(docSnap => {

            const item = docSnap.data();

            if (!item.read) unread++;

            const date = item.createdAt
                ? item.createdAt.toDate().toLocaleString()
                : "-";

            list.innerHTML += `

                <div
                    class="notification-item"
                    data-id="${docSnap.id}">

                    <h4>

                        ${item.title}

                    </h4>

                    <p>

                        ${item.message}

                    </p>

                    <small>

                        ${date}

                    </small>

                </div>

            `;

        });

        badge.textContent = unread;

        attachEvents();

    });

}

/* ==========================================================
   MARK AS READ
========================================================== */

function attachEvents() {

    const items =
        document.querySelectorAll(".notification-item");

    items.forEach(item => {

        item.addEventListener("click", async () => {

            const id = item.dataset.id;

            await updateDoc(

                doc(db, "notifications", id),

                {

                    read: true

                }

            );

        });

    });

}