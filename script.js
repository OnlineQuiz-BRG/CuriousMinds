const authModal = document.querySelector('.auth-modal'), loginBtnModal = document.querySelector('.login-btn-modal'), closeBtnModal = document.querySelector('.close-btn-modal'), profileBox = document.querySelector('.profile-box'), avatarCircle = document.querySelector('.avatar-circle'), API_URL = 'https://script.google.com/macros/s/AKfycbxlb4eUwslxEPAk3DiNLsAHnw-nE87c71P-ClDi9oL7BadWqE0c10y9agLE2rGNnflg/exec';
const contentMap = { Home: "Hey Buddy!", About: "Learning simplified.", Maths: '<div class="levels"><div class="lvl-card" onclick="loadTests(\'Beginner\')">Beginner</div><div class="lvl-card" onclick="loadTests(\'Competent\')">Competent</div><div class="lvl-card" onclick="loadTests(\'Expert\')">Expert</div></div>', Science: "Explore the universe.", Telugu: "Italian of the East.", Resources: "Worksheets.", Contact: "Reach out anytime!" };
document.addEventListener('click', (e) => {
    if (e.target.id === 'menu-icon') document.querySelector('nav').classList.toggle('active');
    if (e.target.innerText === 'Logout') { profileBox.style.display = 'none'; loginBtnModal.style.display = 'block'; profileBox.classList.remove('show'); localStorage.clear(); }
    if (e.target.classList.contains('nav-link') || e.target.classList.contains('logo')) {
        const p = e.target.dataset.page || 'Home'; document.querySelector('.hero h1').innerText = (p === 'Home') ? "Hey Buddy!" : p;
        let d = document.querySelector('.hero p') || document.createElement('p'); d.innerHTML = (p === 'Home') ? "" : contentMap[p]; if (!document.querySelector('.hero p')) document.querySelector('.hero').appendChild(d);
    }
    if (e.target.closest('.register-link')) authModal.classList.add('slide'); if (e.target.closest('.login-link')) authModal.classList.remove('slide', 'reset-mode');
    if (e.target.closest('.forgot-link')) authModal.classList.add('reset-mode');
});
loginBtnModal.onclick = () => authModal.classList.add('show'); closeBtnModal.onclick = () => authModal.classList.remove('show', 'slide', 'reset-mode');
avatarCircle.onclick = (e) => (e.stopPropagation(), profileBox.classList.toggle('show'));
const handleForm = async (id, action) => {
    document.getElementById(id).onsubmit = async (e) => {
        e.preventDefault(); const b = { action, name: e.target[0]?.value, email: e.target[action === 'register' ? 1 : 0].value, password: e.target[action === 'register' ? 2 : 1]?.value };
        const r = await fetch(API_URL, { method: 'POST', body: JSON.stringify(b) }); const d = await r.json();
        if (action === 'login' && d.result === 'success') { profileBox.style.display = 'flex'; loginBtnModal.style.display = 'none'; authModal.classList.remove('show'); localStorage.setItem('userEmail', b.email); }
        else if (d.result === 'success' || d.result === 'sent') { alert('Success!'); authModal.classList.remove('show'); } else alert('Error: ' + d.result);
    };
};
['loginForm', 'regForm', 'forgotForm'].forEach(id => handleForm(id, id.replace('Form', '').replace('reg', 'register')));
window.loadTests = (lvl) => {
    const h = document.querySelector('.hero'); h.innerHTML = `<h1>${lvl} Tests</h1><div class="test-grid"></div>`;
    for (let i = 1; i <= 50; i++) { const b = document.createElement('button'); b.className='test-btn'; b.innerText=`Test ${i}`; b.onclick=()=>startTest(lvl, i); h.querySelector('.test-grid').appendChild(b); }
};
window.startTest = async (lvl, n) => {
    const r = await fetch(`${lvl.toLowerCase()}.json`); const d = await r.json(); const q = d[`Test${n}`];
    const h = document.querySelector('.hero'); h.innerHTML = `<h1>${lvl} - Test ${n}</h1><form id="tF" style="color:#fff; text-align:left; max-width:500px; margin:auto;"></form>`;
    q.forEach((x, i) => h.querySelector('#tF').innerHTML += `<div style="margin:10px 0;">${i+1}. ${x.question} <input type="text" id="q${i}" style="float:right; width:60px;"></div>`);
    h.querySelector('#tF').innerHTML += `<button type="submit" class="btn" style="margin-top:20px;">Submit Test</button>`;
    h.querySelector('#tF').onsubmit = async (e) => {
        e.preventDefault(); let m = 0, res = { action: 'saveResult', email: localStorage.getItem('userEmail'), level: lvl, testNum: n };
        q.forEach((x, i) => { const v = document.getElementById(`q${i}`).value.trim(); const c = v == x.answer; if(c) m++; res[`Q${i+1}`] = v==="" ? "-" : (c?"1":"0"); });
        res.marks = m; res.total = q.length; await fetch(API_URL, { method: 'POST', body: JSON.stringify(res) }); alert(`Score: ${m}/${q.length}`); location.reload();
    };
};
window.onclick = (e) => { if (profileBox && !profileBox.contains(e.target)) profileBox.classList.remove('show'); if (e.target === authModal) authModal.classList.remove('show'); };
