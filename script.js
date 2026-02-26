document.addEventListener("DOMContentLoaded", () => {
    const navbarMenu = document.querySelector(".navbar .links");
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const hideMenuBtn = navbarMenu.querySelector(".close-btn");
    const showPopupBtn = document.querySelector(".login-btn");
    const formPopup = document.querySelector(".form-popup");
    const hidePopupBtn = formPopup.querySelector(".close-btn");
    const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");

    // Show mobile menu
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => {
            navbarMenu.classList.toggle("show-menu");
        });
    }

    // Hide mobile menu
    if (hideMenuBtn) {
        hideMenuBtn.addEventListener("click", () => hamburgerBtn.click());
    }

    // Show login popup
    if (showPopupBtn) {
        showPopupBtn.addEventListener("click", () => {
            document.body.classList.add("show-popup");
        });
    }

    // Hide login popup - Using 'remove' is more reliable than 'toggle' here
    if (hidePopupBtn) {
        hidePopupBtn.addEventListener("click", () => {
            document.body.classList.remove("show-popup");
        });
    }

    // Show or hide signup form
    signupLoginLink.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            formPopup.classList[link.id === 'signup-link' ? 'add' : 'remove']("show-signup");
        });
    });
});
