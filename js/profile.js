/* ==========================================================
   KMYTE Online
   Profile Module
   Version : 1.0.0
========================================================== */

import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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

    loadProfile();

});

/* ==========================================================
   LOAD PROFILE
========================================================== */

async function loadProfile() {

    try {

        const userRef = doc(db, "users", currentUser.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            alert("User not found.");

            return;

        }

        const user = userSnap.data();

        document.getElementById("fullName").value =
            user.fullName || "";

        document.getElementById("email").value =
            user.email || "";

        document.getElementById("phone").value =
            user.phone || "";

        document.getElementById("referralCode").value =
            user.referralCode || "";

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================================
   UPDATE PROFILE
========================================================== */

const form = document.getElementById("profileForm");

if (form) {

    form.addEventListener("submit", updateProfile);

}

async function updateProfile(e) {

    e.preventDefault();

    try {

        const fullName =
            document.getElementById("fullName").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        await updateDoc(

            doc(db, "users", currentUser.uid),

            {

                fullName,

                phone

            }

        );

        alert("Profile updated successfully.");

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}


/* ==========================================================
   CHANGE PASSWORD
========================================================== */

const passwordForm = document.getElementById("passwordForm");

if (passwordForm) {

    passwordForm.addEventListener("submit", changePassword);

}



async function changePassword(e) {

    e.preventDefault();

    try {

        const user = auth.currentUser;

        const currentPassword =
            document.getElementById("currentPassword").value;

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (newPassword !== confirmPassword) {

            alert("New passwords do not match.");

            return;

        }

        if (newPassword.length < 6) {

            alert("Password must be at least 6 characters.");

            return;

        }

        const credential = EmailAuthProvider.credential(

            user.email,

            currentPassword

        );

        await reauthenticateWithCredential(

            user,

            credential

        );

        await updatePassword(

            user,

            newPassword

        );

        alert("Password updated successfully.");

        passwordForm.reset();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}