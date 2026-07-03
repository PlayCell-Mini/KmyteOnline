// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyBUeWih6FR4brqc8mmNgqCv7blhN2s-t4w",
authDomain: "kmyteonline.firebaseapp.com",
projectId: "kmyteonline",
storageBucket: "kmyteonline.firebasestorage.app",
messagingSenderId: "732800529865",
appId: "1:732800529865:web:660adf6e9288243bf8a418",
measurementId: "G-E41CL2H01B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);