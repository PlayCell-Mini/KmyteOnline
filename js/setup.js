/* ==========================================================
   KMYTE Online
   Project Installer
========================================================== */

import { auth, db } from "./firebase.js";

import {

    doc,
    getDoc,
    setDoc,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const setupBtn=document.getElementById("setupBtn");

setupBtn.addEventListener("click",initializeProject);

async function initializeProject(){

    try{

        setupBtn.disabled=true;

        setupBtn.innerHTML="Initializing...";

        const settingsRef=doc(db,"settings","app");

        const settingsSnap=await getDoc(settingsRef);

        if(!settingsSnap.exists()){

            await setDoc(settingsRef,{

                /* ==========================
                   PLAN SETTINGS
                ========================== */

                plan7Amount:0,

                plan15Amount:0,

                plan30Amount:0,

                plan7Return:0,

                plan15Return:0,

                plan30Return:0,

                /* ==========================
                   BANK DETAILS
                ========================== */

                bankName:"",

                accountTitle:"",

                accountNumber:"",

                /* ==========================
                   SUPPORT
                ========================== */

                supportEmail:"",

                supportWhatsapp:"",

                /* ==========================
                   WITHDRAWAL
                ========================== */

                withdrawalHours:48,

                withdrawalMessage:

                "Your KMYTE payment will be sent to your account within 48H.",

                withdrawalNote:

                "Usually payment takes 1-2H but it can take up to 48H.",

                /* ==========================
                   APP
                ========================== */

                maintenance:false,

                createdAt:serverTimestamp()

            });

        }

        alert("Project initialized successfully.");

        setupBtn.innerHTML="Completed";

    }

    catch(error){

        console.error(error);

        alert(error.message);

        setupBtn.disabled=false;

        setupBtn.innerHTML="Initialize Project";

    }

}