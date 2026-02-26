document.addEventListener("DOMContentLoaded", () => {
    // Replace the URL below with your deployed Google Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx5WGDoadCmC-tIWAUi7DgDbiWZYIbpu9ZxvVI1l7vA4iwaLGV1BCdca1yFgTfsKwho_w/exec';

    const navbarMenu = document.querySelector(".navbar .links");
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const hideMenuBtn = navbarMenu.querySelector(".close-btn");
    const showPopupBtn = document.querySelector(".login-btn");
    const formPopup = document.querySelector(".form-popup");
    const hidePopupBtn = formPopup.querySelector(".close-btn");
    const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");

    // --- NAVIGATION & POPUP LOGIC ---

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => navbarMenu.classList.toggle("show-menu"));
    }

    if (hideMenuBtn) {
        hideMenuBtn.addEventListener("click", () => navbarMenu.classList.remove("show-menu"));
    }

    if (showPopupBtn) {
        showPopupBtn.addEventListener("click", () => document.body.classList.add("show-popup"));
    }

    if (hidePopupBtn) {
        hidePopupBtn.addEventListener("click", () => document.body.classList.remove("show-popup"));
    }

    signupLoginLink.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            formPopup.classList[link.id === 'signup-link' ? 'add' : 'remove']("show-signup");
        });
    });

    // --- GOOGLE SHEETS FORM HANDLING ---

    // Login Form Handler
    const loginForm = document.querySelector(".login form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = loginForm.querySelector("button");
            submitBtn.innerText = "Processing...";
            submitBtn.disabled = true;

            const formData = new FormData(loginForm);
            // Match these names to your HTML input names
            formData.append("action", "login");

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(res => res.text())
                .then(data => {
                    alert(data);
                    submitBtn.innerText = "Log In";
                    submitBtn.disabled = false;
                    if (data.includes("successful")) document.body.classList.remove("show-popup");
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    submitBtn.innerText = "Log In";
                    submitBtn.disabled = false;
                });
        });
    }

    // Signup Form Handler
    const signupForm = document.querySelector(".signup form");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = signupForm.querySelector("button");
            submitBtn.innerText = "Saving...";
            submitBtn.disabled = true;

            const formData = new FormData(signupForm);
            formData.append("action", "signup");

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(res => res.text())
                .then(data => {
                    alert(data);
                    submitBtn.innerText = "Sign Up";
                    submitBtn.disabled = false;
                    if (data.includes("successfully")) formPopup.classList.remove("show-signup");
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    submitBtn.innerText = "Sign Up";
                    submitBtn.disabled = false;
                });
        });
    }
});
