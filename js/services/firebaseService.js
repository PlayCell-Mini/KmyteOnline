/* ==========================================================
   KMYTE Online
   Firebase Service Layer
   Version : 1.0.0
========================================================== */

/* ==========================================================
   IMPORTS
========================================================== */

import { db } from "../firebase.js";

import {

    collection,
    doc,
    setDoc,
    addDoc,
    getDoc,
    getDocs,
    query,
    where,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ==========================================================
   CREATE SUBSCRIPTION
========================================================== */

export async function createSubscription(subscriptionData){

    const docRef = await addDoc(

        collection(db,"subscriptions"),

        {

            ...subscriptionData,

            createdAt:serverTimestamp()

        }

    );

    return docRef.id;

}

/* ==========================================================
   GET USER SUBSCRIPTION
========================================================== */

export async function getUserSubscription(uid){

    const q=query(

        collection(db,"subscriptions"),

        where("uid","==",uid),

        where("status","==","active")

    );

    const snapshot=await getDocs(q);

    if(snapshot.empty){

        return null;

    }

    return{

        id:snapshot.docs[0].id,

        ...snapshot.docs[0].data()

    };

}

/* ==========================================================
   CREATE PAYMENT
========================================================== */

export async function createPayment(paymentData){

    await addDoc(

        collection(db,"payments"),

        {

            ...paymentData,

            createdAt:serverTimestamp()

        }

    );

}

/* ==========================================================
   GET USER PAYMENTS
========================================================== */

export async function getUserPayments(uid){

    const q=query(

        collection(db,"payments"),

        where("uid","==",uid)

    );

    const snapshot=await getDocs(q);

    return snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

    }));

}


/* ==========================================================
   GENERATE PAYMENTS
========================================================== */

export async function generatePayments(uid, subscriptionId, planDays, dailyAmount){

    const payments = [];

    for(let day = 1; day <= planDays; day++){

        payments.push(

            addDoc(

                collection(db,"payments"),

                {

                    uid,

                    subscriptionId,

                    day,

                    amount: dailyAmount,

                    status: "pending",

                    unlocked: day === 1,

                    paid: false,

                    approved: false,

                    createdAt: serverTimestamp()

                }

            )

        );

    }

    await Promise.all(payments);

}