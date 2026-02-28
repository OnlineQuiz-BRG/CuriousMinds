const authModal = document.querySelector('.auth-modal');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const loginBtnModal = document.querySelector('.login-btn-modal');
const closeBtnModal = document.querySelector('.close-btn-modal');
const profileBox = document.querySelector('.profile-box');
const avatarCircle = document.querySelector('.avatar-circle');
const alertBox = document.querySelector('.alert-box');

registerLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent page jump on toggle
    authModal.classList.add('slide');
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault(); // Switch back to login view
    authModal.classList.remove('slide');
});

loginBtnModal.addEventListener('click', () => {
    authModal.classList.add('show'); // Launch glass modal
});

closeBtnModal.addEventListener('click', () => {
    authModal.classList.remove('show', 'slide');
});

avatarCircle.addEventListener('click', (e) => {
    e.stopPropagation(); // Avoid bubble-up to window
    profileBox.classList.toggle('show');
});

if (alertBox) {
    setTimeout(() => { alertBox.classList.add('show'); }, 500);
    setTimeout(() => {
        alertBox.classList.remove('show');
        setTimeout(() => { alertBox.remove(); }, 1000); // Cleanup DOM
    }, 6000);
}

window.addEventListener('click', (e) => {
    if (profileBox && !profileBox.contains(e.target)) {
        profileBox.classList.remove('show'); // Auto-hide menu
    }
    if (e.target === authModal) {
        authModal.classList.remove('show', 'slide'); // Auto-close modal
    }
});
