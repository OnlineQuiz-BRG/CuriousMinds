const authModal = document.querySelector('.auth-modal');
const loginBtnModal = document.querySelector('.login-btn-modal');
const closeBtnModal = document.querySelector('.close-btn-modal');
const profileBox = document.querySelector('.profile-box');
const avatarCircle = document.querySelector('.avatar-circle');
const alertBox = document.querySelector('.alert-box');
const API_URL = 'https://script.google.com/macros/s/AKfycbxlb4eUwslxEPAk3DiNLsAHnw-nE87c71P-ClDi9oL7BadWqE0c10y9agLE2rGNnflg/exec';
const REDIRECT_URL = 'https://script.google.com/macros/s/AKfycbyYxMvKzPGR_yIzrWBLHR9kGMF47zXerKe-tPUQ072cvbCqna9qE9En2MPUgO44uxTT1A/exec';

document.addEventListener('click', (e) => {
    if (e.target.closest('.register-link')) authModal.classList.add('slide'), authModal.classList.remove('reset-mode');
    if (e.target.closest('.login-link')) authModal.classList.remove('slide', 'reset-mode');
    if (e.target.closest('.forgot-link')) authModal.classList.add('reset-mode'), authModal.classList.remove('slide');
});

loginBtnModal.addEventListener('click', () => authModal.classList.add('show'));
closeBtnModal.addEventListener('click', () => authModal.classList.remove('show', 'slide', 'reset-mode'));
avatarCircle.addEventListener('click', (e) => (e.stopPropagation(), profileBox.classList.toggle('show')));

const handleForm = async (id, action) => {
    document.getElementById(id).onsubmit = async (e) => {
        e.preventDefault();
        const body = { action, name: e.target[0]?.value, email: e.target[action === 'register' ? 1 : 0].value, password: e.target[action === 'register' ? 2 : 1]?.value };
        const res = await fetch(API_URL, { method: 'POST', body: JSON.stringify(body) });
        const data = await res.json();
        if (action === 'login' && data.result === 'success') window.location.href = REDIRECT_URL;
        else if (data.result === 'success' || data.result === 'sent') alert(action === 'forgot' ? 'Temp password sent!' : 'Success!'), authModal.classList.remove('slide', 'reset-mode');
        else alert('Error: ' + data.result);
    };
};

['loginForm', 'regForm', 'forgotForm'].forEach(id => handleForm(id, id.replace('Form', '').replace('reg', 'register')));

if (alertBox) {
    setTimeout(() => alertBox.classList.add('show'), 500);
    setTimeout(() => { alertBox.classList.remove('show'); setTimeout(() => alertBox.remove(), 1000); }, 6000);
}

window.addEventListener('click', (e) => {
    if (profileBox && !profileBox.contains(e.target)) profileBox.classList.remove('show');
    if (e.target === authModal) authModal.classList.remove('show', 'slide', 'reset-mode');
});
