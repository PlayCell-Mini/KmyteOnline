/* ==========================================================
   KMYTE Online
   Admin User Management
========================================================== */

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const tbody = document.getElementById("usersTableBody");

const searchInput = document.getElementById("searchUser");

let users = [];

loadUsers();

async function loadUsers() {

    tbody.innerHTML = "";

    const snapshot = await getDocs(collection(db, "users"));

    users = [];

    snapshot.forEach(doc => {

        users.push({

            id: doc.id,

            ...doc.data()

        });

    });

    renderUsers(users);

}

function renderUsers(data) {

    tbody.innerHTML = "";

    if (data.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="6">

                    No users found.

                </td>

            </tr>

        `;

        return;

    }

    data.forEach(user => {

        tbody.innerHTML += `

            <tr>

                <td>${user.fullName || "-"}</td>

                <td>${user.email || "-"}</td>

                <td>${user.phone || "-"}</td>

                <td>PKR ${user.wallet?.totalPending || 0}</td>

                <td>${user.status || "Active"}</td>

                <td>

                    <button
                        class="view-user"
                        data-id="${user.id}">

                        View

                    </button>

                </td>

            </tr>

        `;

    });

}


/* ==========================================================
   SEARCH
========================================================== */

searchInput.addEventListener("input", () => {

    const keyword = searchInput.value.toLowerCase();

    const filtered = users.filter(user =>

        (user.fullName || "").toLowerCase().includes(keyword) ||

        (user.email || "").toLowerCase().includes(keyword) ||

        user.id.toLowerCase().includes(keyword)

    );

    renderUsers(filtered);

});