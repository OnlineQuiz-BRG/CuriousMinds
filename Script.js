document.addEventListener("DOMContentLoaded", () => {
    // This is the URL of your BACKEND script (the one that talks to the Google Sheet)
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx5WGDoadCmC-tIWAUi7DgDbiWZYIbpu9ZxvVI1l7vA4iwaLGV1BCdca1yFgTfsKwho_w/exec';
    
    // This is the URL where you want to send the user AFTER a successful login
    const redirectURL = 'https://script.google.com/macros/s/AKfycbyYxMvKzPGR_yIzrWBLHR9kGMF47zXerKe-tPUQ072cvbCqna9qE9En2MPUgO44uxTT1A/exec';

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

    // --- COURSES DROPDOWN LOGIC ---

    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener("click", (e) => {
            e.preventDefault(); 
            e.stopPropagation(); // Prevents the window click listener from immediately closing it
            dropdownMenu.classList.toggle("show");
        });
    }

    // Close dropdown if user clicks anywhere else on the page
    window.addEventListener("click", (e) => {
        if (dropdownMenu && dropdownMenu.classList.contains('show')) {
            if (!e.target.closest('.dropdown')) {
                dropdownMenu.classList.remove('show');
            }
        }
    });

    // --- GOOGLE SHEETS FORM HANDLING ---

    // Login Form Handler
    const loginForm = document.querySelector(".login form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = loginForm.querySelector("button");
            submitBtn.innerText = "Verifying...";
            submitBtn.disabled = true;

            const formData = new FormData(loginForm);
            formData.append("action", "login");

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(res => res.text())
                .then(data => {
                    if (data.toLowerCase().includes("successful")) {
                        window.location.href = redirectURL;
                    } else {
                        alert(data);
                        submitBtn.innerText = "Log In";
                        submitBtn.disabled = false;
                    }
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert("An error occurred. Please try again.");
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
                    if (data.toLowerCase().includes("successfully")) {
                        formPopup.classList.remove("show-signup");
                    }
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    submitBtn.innerText = "Sign Up";
                    submitBtn.disabled = false;
                });
        });
    }
});
