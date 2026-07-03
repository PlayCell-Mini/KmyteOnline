/* ==========================================================
   KMYTE Online
   Responsive Navbar
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const menuButton = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuButton) {

        menuButton.addEventListener("click", () => {

            navLinks.classList.toggle("active");
            menuButton.classList.toggle("active");

        });

    }

});