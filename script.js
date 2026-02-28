const authModal = document.querySelector('.auth-modal');
const loginBtnModal = document.querySelector('.login-btn-modal');
const closeBtnModal = document.querySelector('.close-btn-modal');
const profileBox = document.querySelector('.profile-box');
const avatarCircle = document.querySelector('.avatar-circle');
const alertBox = document.querySelector('.alert-box');
const API_URL = 'https://script.google.com/macros/s/AKfycbxlb4eUwslxEPAk3DiNLsAHnw-nE87c71P-ClDi9oL7BadWqE0c10y9agLE2rGNnflg/exec';
const contentMap = { Home: "Hey Buddy!", About: "We are CuriousMinds, dedicated to learning.", Maths: 'Master Mental Math with ease.<br><br><a href="https://script.google.com/macros/s/AKfycbyYxMvKzPGR_yIzrWBLHR9kGMF47zXerKe-tPUQ072cvbCqna9qE9En2MPUgO44uxTT1A/exec" target="_blank" class="btn" style="display:inline-block; width:auto; padding:0 20px; text-decoration:none; line-height:45px;">Master the Mental math</a>', Science: "Explore the wonders of the universe.", Telugu: "Learn the Italian of the East.", Resources: "Worksheets and guides at your fingertips.", Contact: "Reach out to us anytime!" };

document.addEventListener('click', (e) => {
    if (e.target.id === 'menu-icon') document.querySelector('nav').classList.toggle('active');
    if (e.target.innerText === 'Logout') { profileBox.style.display = 'none'; loginBtnModal.style.display = 'block'; profileBox.classList.remove('show'); }
    if (e.target.classList.contains('nav-link') || e.target.classList.contains('back-home')) {
        const page = e.target.dataset.page || 'Home'; document.querySelector('.hero h1').innerText = contentMap[page];
        const p = document.querySelector('.hero p'); if (p) p.remove();
        if (page !== 'Home') { let desc = document.createElement('p'); desc.innerHTML = contentMap[page]; document.querySelector('.hero').appendChild(desc); }
    }
    if (e.target.closest('.register-link')) authModal.classList.add('slide'), authModal.classList.remove('reset-mode');
    if (e.target.closest('.login-link')) authModal.classList.remove('slide', 'reset-mode');
    if (e.target.closest('.forgot-link')) authModal.classList.add('reset-mode'), authModal.classList.remove('slide');
});

loginBtnModal.addEventListener('click', () => authModal.classList.add('show'));
closeBtnModal.addEventListener('click', () => authModal.classList.remove('show', 'slide', 'reset-mode'));
avatarCircle.addEventListener('click', (e) => (e.stopPropagation(), profileBox.classList.toggle('show')));

const handleForm = async (id, action) => {
    const form = document.getElementById(id);
    form.onsubmit = async (e) => {
        e.preventDefault();
        const body = { action, name: e.target[0]?.value, email: e.target[action === 'register' ? 1 : 0].value, password: e.target[action === 'register' ? 2 : 1]?.value };
        const res = await fetch(API_URL, { method: 'POST', body: JSON.stringify(body) });
        const data = await res.json();
        if (action === 'login' && data.result === 'success') {
            profileBox.style.display = 'flex'; loginBtnModal.style.display = 'none';
            authModal.classList.remove('show'); alert('Login Successful!');
        } else if (data.result === 'success' || data.result === 'sent') {
            alert(action === 'forgot' ? 'Temp password sent!' : 'Success!');
            form.reset(); authModal.classList.remove('show', 'slide', 'reset-mode');
        } else alert('Error: ' + data.result);
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
