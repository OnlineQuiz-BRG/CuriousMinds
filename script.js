/* Select the modal container and the toggle links */
const authModal = document.querySelector('.auth-modal');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const loginBtnModal = document.querySelector('.login-btn-modal');
const closeBtnModal = document.querySelector('.close-btn-modal');
const profileBox = document.querySelector('.profile-box');
const avatarCircle = document.querySelector('.avatar-circle');
const alertBox = document.querySelector('.alert-box');

/* When Register is clicked, add the 'slide' class to shift the forms */
registerLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    authModal.classList.add('slide');
});

/* When Login is clicked, remove the 'slide' class to shift back */
loginLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    authModal.classList.remove('slide');
});

loginBtnModal.addEventListener('click',()=> authModal.classlist.add('show'));
closeBtnModal.addEventListener('click',()=> authModal.classlist.remove('show','slide'));

avatarCircle.addEventListener('click',()=> profileBox.classlist.toggle('show'));

setTimeout(() => alertBox.classlist.add('show'),50);

setTimeout(() => {
    alertBox.classlist.remove('show');
    setTimeout(() => alertBox.remove(), 1000);
}, 6000);
