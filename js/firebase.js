/* ==========================================================
   KMYTE Online
   Firebase Configuration
========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ==========================================================
   FIREBASE CONFIG
========================================================== */

const firebaseConfig = {

    apiKey: "AIzaSyBUeWih6FR4brqc8mmNgqCv7blhN2s-t4w",

    authDomain: "YOUR_AUTH_DOMAIN",

    projectId: "YOUR_PROJECT_ID",

    storageBucket: "YOUR_STORAGE_BUCKET",

    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

    appId: "YOUR_APP_ID"

};

/* ==========================================================
   INITIALIZE
========================================================== */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

/* ==========================================================
   EXPORTS
========================================================== */

export {

    app,

    auth,

    db

};