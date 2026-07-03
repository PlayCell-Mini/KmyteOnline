/* ==========================================================
   CREATE FIRST ADMIN
========================================================== */

const currentUser = auth.currentUser;

if (!currentUser) {

    alert("Please login first with your admin account.");

    setupBtn.disabled = false;
    setupBtn.innerHTML = "Initialize Project";

    return;

}

const adminRef = doc(db, "admins", currentUser.uid);

const adminSnap = await getDoc(adminRef);

if (!adminSnap.exists()) {

    await setDoc(adminRef, {

        uid: currentUser.uid,

        email: currentUser.email,

        role: "admin",

        createdAt: serverTimestamp()

    });

}

await updateDoc(

    doc(db, "users", currentUser.uid),

    {

        role: "admin"

    }

);