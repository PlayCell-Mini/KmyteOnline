/* ==========================================================
   KMYTE Online
   Notification Service
========================================================== */

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function createNotification(

    uid,
    title,
    message,
    type = "general"

) {

    try {

        await addDoc(

            collection(db, "notifications"),

            {

                uid,

                title,

                message,

                type,

                read: false,

                createdAt: serverTimestamp()

            }

        );

    }

    catch(error){

        console.error("Notification Error:", error);

    }

}