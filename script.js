const authModal = document.querySelector('.auth-modal'), loginBtnModal = document.querySelector('.login-btn-modal'), closeBtnModal = document.querySelector('.close-btn-modal'), profileBox = document.querySelector('.profile-box'), avatarCircle = document.querySelector('.avatar-circle'), API_URL = 'https://script.google.com/macros/s/AKfycbxlb4eUwslxEPAk3DiNLsAHnw-nE87c71P-ClDi9oL7BadWqE0c10y9agLE2rGNnflg/exec';
const contentMap = { Home: "Hey Buddy!", About: "Learning simplified.", Maths: '<div class="levels"><div class="lvl-card" onclick="loadTests(\'Beginner\')">Beginner</div><div class="lvl-card" onclick="loadTests(\'Competent\')">Competent</div><div class="lvl-card" onclick="loadTests(\'Expert\')">Expert</div></div>', Science: "Explore the universe.", Telugu: "Italian of the East.", Resources: "Worksheets.", Contact: "Reach out anytime!" };

document.addEventListener('click', (e) => {
    if (e.target.id === 'menu-icon') document.querySelector('nav').classList.toggle('active');
    if (e.target.innerText === 'Logout') { profileBox.style.display = 'none'; loginBtnModal.style.display = 'block'; profileBox.classList.remove('show'); localStorage.clear(); }
    if (e.target.classList.contains('nav-link') || e.target.classList.contains('logo')) {
        const p = e.target.dataset.page || 'Home'; 
        document.querySelector('.hero h1').innerText = (p === 'Home') ? "Hey Buddy!" : p;
        let d = document.querySelector('.hero p') || document.createElement('p'); d.className = 'hero-desc';
        d.innerHTML = (p === 'Home') ? "" : contentMap[p]; 
        if (!document.querySelector('.hero-desc')) document.querySelector('.hero').appendChild(d);
    }
    if (e.target.closest('.register-link')) authModal.classList.add('slide'); 
    if (e.target.closest('.login-link')) authModal.classList.remove('slide', 'reset-mode');
    if (e.target.closest('.forgot-link')) authModal.classList.add('reset-mode');
});

loginBtnModal.onclick = () => authModal.classList.add('show');
closeBtnModal.onclick = () => authModal.classList.remove('show', 'slide', 'reset-mode');
avatarCircle.onclick = (e) => (e.stopPropagation(), profileBox.classList.toggle('show'));

const handleForm = async (id, action) => {
    document.getElementById(id).onsubmit = async (e) => {
        e.preventDefault(); 
        const b = { action, email: e.target[action === 'register' ? 1 : 0].value, password: e.target[action === 'register' ? 2 : 1]?.value };
        const r = await fetch(API_URL, { method: 'POST', body: JSON.stringify(b) }); 
        const d = await r.json();
        if (action === 'login' && d.result === 'success') { 
            profileBox.style.display = 'flex'; loginBtnModal.style.display = 'none'; authModal.classList.remove('show'); localStorage.setItem('userEmail', b.email); 
        } else alert(d.result);
    };
};
['loginForm', 'regForm', 'forgotForm'].forEach(id => handleForm(id, id.replace('Form', '').replace('reg', 'register')));

window.goBack = () => {
    document.querySelector('.hero h1').innerText = "Maths";
    document.querySelector('.hero .hero-desc').innerHTML = contentMap['Maths'];
};

window.loadTests = (lvl) => {
    const h = document.querySelector('.hero');
    h.innerHTML = `<button class="btn-link" onclick="goBack()" style="margin-bottom:20px; cursor:pointer;">← Back to Levels</button><h1>${lvl} Tests</h1><div class="test-grid"></div>`;
    for (let i = 1; i <= 50; i++) {
        const b = document.createElement('button'); b.className='test-btn'; b.innerText=`Test ${i}`;
        b.onclick=()=>startTest(lvl, i); h.querySelector('.test-grid').appendChild(b);
    }
};

window.startTest = async (lvl, n) => {
    try {
        const r = await fetch(`./${lvl.toLowerCase()}.json`); 
        const d = await r.json(); 
        const q = d[`Test${n}`];
        const h = document.querySelector('.hero');
        h.innerHTML = `<button class="btn-link" onclick="loadTests('${lvl}')" style="margin-bottom:20px; cursor:pointer;">← Back to Tests</button><h1>${lvl} - Test ${n}</h1><form id="tF" style="color:#fff; text-align:left; max-width:600px; margin:auto; padding-bottom:50px;"></form>`;
        const f = h.querySelector('#tF');
        q.forEach((x, i) => {
            if (lvl === 'Expert' && i % 3 === 0) f.innerHTML += `<div style="border-bottom:1px solid #fff; margin:25px 0 10px; font-weight:bold; color:#f39c12;">Section ${Math.floor(i/3)+1}</div>`;
            f.innerHTML += `<div style="margin:8px 0; display:flex; justify-content:space-between; align-items:center;"><span>${i+1}. ${x.question}</span> <input type="text" id="q${i}" style="width:70px; border-radius:4px; border:none; padding:4px; color:#222;"></div>`;
        });
        f.innerHTML += `<button type="submit" class="btn" style="margin-top:30px; background:#f39c12; color:#fff;">Submit Test</button>`;
        f.onsubmit = async (e) => {
            e.preventDefault();
            let score = 0, res = { action: 'saveResult', email: localStorage.getItem('userEmail'), level: `Maths_${lvl}`, testNum: n };
            if (lvl === 'Expert') {
                for (let s = 0; s < 40; s++) {
                    let sCorrect = 0;
                    for (let i = 0; i < 3; i++) {
                        let idx = (s * 3) + i, v = document.getElementById(`q${idx}`).value.trim();
                        if (v == q[idx].answer) sCorrect++;
                        res[`Q${idx+1}`] = v === "" ? "-" : (v == q[idx].answer ? "1" : "0");
                    }
                    if (sCorrect === 3) score += 1;
                }
            } else {
                q.forEach((x, i) => {
                    let v = document.getElementById(`q${i}`).value.trim();
                    if(v == x.answer) score++;
                    res[`Q${i+1}`] = v === "" ? "-" : (v == x.answer ? "1" : "0");
                });
            }
            res.marks = score; res.total = (lvl === 'Expert') ? 40 : q.length;
            await fetch(API_URL, { method: 'POST', body: JSON.stringify(res) });
            alert(`Test Submitted! Score: ${score}/${res.total}`); loadTests(lvl);
        };
    } catch (err) { alert("Error: Could not load questions. Check your JSON file naming."); }
};

window.onclick = (e) => { if (profileBox && !profileBox.contains(e.target)) profileBox.classList.remove('show'); if (e.target === authModal) authModal.classList.remove('show'); };
