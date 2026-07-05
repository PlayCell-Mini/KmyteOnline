/* ==========================================================
   KMYTE Online
   Authentication Module
   Version: 1.0.0
========================================================== */

/* ==========================================================
   IMPORTS
========================================================== */

import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    isValidEmail,
    isValidPhone,
    isValidPassword,
    showMessage,
    setButtonLoading,
    resetButton
} from "./utils.js";

/* ==========================================================
   FORM
========================================================== */

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", signupUser);

}
/* ==========================================================
   LOGIN FORM
========================================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", loginUser);

}

/* ==========================================================
   GENERATE REFERRAL CODE
========================================================== */

function generateReferralCode() {

    return "KMY" +

        Math.random()

            .toString(36)

            .substring(2, 8)

            .toUpperCase();

}

/* ==========================================================
   SIGNUP
========================================================== */

async function signupUser(e) {

    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();

    const email = document.getElementById("email").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirmPassword").value;

    const referredBy = document.getElementById("referral").value.trim();

    const terms = document.getElementById("terms").checked;

    const button = document.querySelector(".auth-btn");



    /* =====================
       VALIDATION
    ===================== */

    if (fullName.length < 3) {

        showMessage("Please enter your full name.");

        return;

    }

    if (!isValidEmail(email)) {

        showMessage("Please enter a valid email.");

        return;

    }

    if (!isValidPhone(phone)) {

        showMessage("Phone number must be like 03XXXXXXXXX");

        return;

    }

    if (!isValidPassword(password)) {

        showMessage("Password must contain at least 6 characters.");

        return;

    }

    if (password !== confirmPassword) {

        showMessage("Passwords do not match.");

        return;

    }

    if (!terms) {

        showMessage("Please accept Terms & Conditions.");

        return;

    }

    try {

        setButtonLoading(button);

        /* =====================
           FIREBASE AUTH
        ===================== */

        const userCredential = await createUserWithEmailAndPassword(

            auth,
            email,
            password

        );

        const user = userCredential.user;

        const myReferralCode = generateReferralCode();

        /* =====================
           FIRESTORE USER
        ===================== */

        await setDoc(

            doc(db, "users", user.uid),

            {

                uid: user.uid,

                fullName,

                email,

                phone,

                referralCode: myReferralCode,

                referredBy: referredBy || null,

                role: "user",

                createdAt: serverTimestamp(),

                subscription: {

                    active: false,

                    plan: null,

                    startDate: null,

                    endDate: null,

                    totalDays: 0,

                    currentDay: 0,

                    completed: false

                },

                wallet: {

                    totalPaid: 0,

                    totalPending: 0,

                    withdrawAvailable: false

                },

                withdrawal: {

                    status: "none",

                    requested: false,

                    completed: false

                }

            }

        );

        resetButton(button);

        showMessage("Account created successfully!");

        window.location.href = "dashboard.html";

    }

    catch (error) {

        resetButton(button);

        console.error(error);

        showMessage(error.message);

    }

}

/* ==========================================================
   LOGIN USER
========================================================== */

async function loginUser(e){

    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();

    const password = document.getElementById("loginPassword").value;

    const button = document.querySelector(".auth-btn");

    if(!isValidEmail(email)){

        showMessage("Please enter a valid email.");

        return;

    }

    if(password.length < 6){

        showMessage("Invalid password.");

        return;

    }

    try{

        setButtonLoading(button,"Logging In...");

        await signInWithEmailAndPassword(

            auth,

            email,

            password

        );

        resetButton(button);

    const user = auth.currentUser;

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {

        showMessage("User data not found.");

        return;

    }

    const userData = userSnap.data();

    /* ==========================================================
    ACCOUNT STATUS
    ========================================================== */

    if (userData.status === "Suspended") {

        await auth.signOut();

        alert("Your account has been suspended. Please contact support.");

        return;

    }

    showMessage("Login Successful!");

    if (userData.role === "admin") {

        window.location.href = "admin.html";

    } else {

        window.location.href = "dashboard.html";

    }

    }

    catch(error){

        resetButton(button);

        console.error(error);

        showMessage(error.message);

    }

}

/* ==========================================================
   LOGOUT
========================================================== */

export async function logoutUser(){

    await signOut(auth);

    window.location.href="login.html";

}

/* ==========================================================
   AUTH STATE
========================================================== */

export function checkAuthState(callback){

    onAuthStateChanged(auth,(user)=>{

        callback(user);

    });

    

}