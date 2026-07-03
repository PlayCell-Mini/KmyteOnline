/* ==========================================================
   KMYTE Online
   Utility Functions
   Version: 1.0.0
========================================================== */

/* ==========================================================
   EMAIL VALIDATION
========================================================== */

export function isValidEmail(email) {

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);

}

/* ==========================================================
   PHONE VALIDATION (Pakistan)
========================================================== */

export function isValidPhone(phone) {

    const pattern = /^03[0-9]{9}$/;

    return pattern.test(phone);

}

/* ==========================================================
   PASSWORD VALIDATION
========================================================== */

export function isValidPassword(password) {

    return password.length >= 6;

}

/* ==========================================================
   SHOW MESSAGE
========================================================== */

export function showMessage(message) {

    alert(message);

}

/* ==========================================================
   LOADING BUTTON
========================================================== */

export function setButtonLoading(button, loadingText = "Please Wait...") {

    button.dataset.originalText = button.innerHTML;

    button.disabled = true;

    button.innerHTML = loadingText;

}

export function resetButton(button) {

    button.disabled = false;

    button.innerHTML = button.dataset.originalText;

}

/* ==========================================================
   FORMAT DATE
========================================================== */

export function formatDate(date) {

    return new Date(date).toLocaleDateString();

}