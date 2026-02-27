/* Select the modal container and the toggle links */
const authModal = document.querySelector('.auth-modal');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const loginBtnModal = document.querySelector('.login-btn-modal');
const closeBtnModal = document.querySelector('.close-btn-modal');
const profileBox = document.querySelector('.profile-box');
const avatarCircle = document.querySelector('.avatar-circle');
const alertBox = document.querySelector('.alert-box');

/* 1. Toggle between Login and Register forms */
registerLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    authModal.classList.add('slide');
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault(); 
    authModal.classList.remove('slide');
});

/* 2. Open and Close the Auth Modal */
// Fixed: Changed 'classlist' to 'classList'
loginBtnModal.addEventListener('click', () => {
    authModal.classList.add('show');
});

closeBtnModal.addEventListener('click', () => {
    authModal.classList.remove('show', 'slide');
});

/* 3. Profile Dropdown Toggle */
// Fixed: Changed 'classlist' to 'classList'
avatarCircle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents clicks from immediately closing the menu
    profileBox.classList.toggle('show');
});

/* 4. Alert Box Logic */
// Fixed: Added check to ensure alertBox exists before running
if (alertBox) {
    // Show the alert slightly after page load
    setTimeout(() => {
        alertBox.classList.add('show');
    }, 500);

    // Hide and remove the alert after 6 seconds
    setTimeout(() => {
        alertBox.classList.remove('show');
        
        // Wait for the slide-out animation to finish before removing from DOM
        setTimeout(() => {
            alertBox.remove();
        }, 1000);
    }, 6000);
}

/* 5. Click outside to close (Optional but recommended) */
window.addEventListener('click', (e) => {
    // Close profile dropdown if clicking outside
    if (profileBox && !profileBox.contains(e.target)) {
        profileBox.classList.remove('show');
    }
});
