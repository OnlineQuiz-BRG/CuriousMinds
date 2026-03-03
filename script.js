const authModal = document.querySelector('.auth-modal'),
    loginBtnModal = document.querySelector('.login-btn-modal'),
    closeBtnModal = document.querySelector('.close-btn-modal'),
    profileBox = document.querySelector('.profile-box'),
    avatarCircle = document.querySelector('.avatar-circle'),
    API_URL = 'https://script.google.com/macros/s/AKfycbxlb4eUwslxEPAk3DiNLsAHnw-nE87c71P-ClDi9oL7BadWqE0c10y9agLE2rGNnflg/exec';

const contentMap = {
    Home: "Hey Buddy!",
    About: "Learning simplified.",
    Maths: '<div class="levels"><div class="lvl-card" onclick="loadTests(\'Beginner\')">Beginner</div><div class="lvl-card" onclick="loadTests(\'Competent\')">Competent</div><div class="lvl-card" onclick="loadTests(\'Expert\')">Expert</div></div>',
    Science: "Explore the universe.",
    Telugu: "Italian of the East.",
    Resources: "Worksheets.",
    Contact: "Reach out anytime!"
};

// --- Navigation & Core UI ---
document.addEventListener('click', (e) => {
    if (e.target.id === 'menu-icon') document.querySelector('nav').classList.toggle('active');
    
    if (e.target.innerText === 'Logout') {
        profileBox.style.display = 'none';
        loginBtnModal.style.display = 'block';
        profileBox.classList.remove('show');
        localStorage.clear();
    }

    if (e.target.classList.contains('nav-link') || e.target.classList.contains('logo')) {
        const p = e.target.dataset.page || 'Home';
        const hero = document.querySelector('.hero');
        hero.innerHTML = `<h1 id="hero-text">${p === 'Home' ? 'Hey Buddy!' : p}</h1>`;
        
        if (p !== 'Home') {
            const d = document.createElement('div');
            d.className = 'hero-desc';
            d.innerHTML = contentMap[p]; 
            hero.appendChild(d);
        }
    }

    if (e.target.closest('.register-link')) authModal.classList.add('slide');
    if (e.target.closest('.login-link')) authModal.classList.remove('slide', 'reset-mode');
    if (e.target.closest('.forgot-link')) authModal.classList.add('reset-mode');
});

loginBtnModal.onclick = () => authModal.classList.add('show');
closeBtnModal.onclick = () => authModal.classList.remove('show', 'slide', 'reset-mode');
avatarCircle.onclick = (e) => { e.stopPropagation(); profileBox.classList.toggle('show'); };

// --- Auth Handling ---
const handleForm = async (id, action) => {
    const f = document.getElementById(id);
    if (!f) return;
    f.onsubmit = async (e) => {
        e.preventDefault();
        const b = { 
            action, 
            email: e.target[action === 'register' ? 1 : 0].value, 
            password: e.target[action === 'register' ? 2 : 1]?.value 
        };
        const r = await fetch(API_URL, { method: 'POST', body: JSON.stringify(b) });
        const d = await r.json();
        if (action === 'login' && d.result === 'success') {
            profileBox.style.display = 'flex';
            loginBtnModal.style.display = 'none';
            authModal.classList.remove('show');
            localStorage.setItem('userEmail', b.email);
            avatarCircle.innerText = b.email.charAt(0).toUpperCase();
        } else alert(d.result);
    };
};
['loginForm', 'regForm', 'forgotForm'].forEach(id => handleForm(id, id.replace('Form', '').replace('reg', 'register')));

// --- Maths Navigation ---
window.goBackToMaths = () => {
    const hero = document.querySelector('.hero');
    hero.innerHTML = `<h1 id="hero-text">Maths</h1><div class="hero-desc">${contentMap['Maths']}</div>`;
};

window.loadTests = (lvl) => {
    const hero = document.querySelector('.hero');
    hero.innerHTML = `
        <button class="back-btn" onclick="goBackToMaths()" style="margin-bottom:20px; cursor:pointer; background:none; border:1px solid #fff; color:#fff; padding:5px 15px; border-radius:20px;">← Back to Levels</button>
        <h1>${lvl} Tests</h1>
        <div class="test-grid"></div>
    `;
    const grid = hero.querySelector('.test-grid');
    for (let i = 1; i <= 50; i++) {
        const b = document.createElement('button');
        b.className = 'test-btn';
        b.innerText = `Test ${i}`;
        b.onclick = () => startTest(lvl, i);
        grid.appendChild(b);
    }
};

// --- Test Evaluation Logic ---
window.startTest = async (lvl, n) => {
    try {
        const fileName = `${lvl}.json`; 
        const r = await fetch(`./${fileName}`);
        if (!r.ok) throw new Error("JSON file not found");
        const d = await r.json();
        const q = d[`Test${n}`];

        const hero = document.querySelector('.hero');
        hero.innerHTML = `
            <button class="back-btn" onclick="loadTests('${lvl}')" style="margin-bottom:20px; cursor:pointer; background:none; border:1px solid #fff; color:#fff; padding:5px 15px; border-radius:20px;">← Back to Tests</button>
            <h1 style="font-size: 40px;">${lvl} - Test ${n}</h1>
            <form id="testForm" style="color:#fff; text-align:left; max-width:600px; margin:20px auto; padding-bottom:100px;"></form>
        `;

        const f = document.getElementById('testForm');
        q.forEach((x, i) => {
            if (lvl === 'Expert' && i % 3 === 0) {
                f.innerHTML += `<div class="expert-section-header" style="margin:25px 0 10px; font-weight:bold; color:#f39c12;">Section ${Math.floor(i / 3) + 1}</div>`;
            }
            f.innerHTML += `
                <div style="margin:10px 0; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size: 16px;">${i + 1}. ${x.question}</span>
                    <input type="text" id="q${i}" autocomplete="off" style="width:70px; border-radius:4px; border:none; padding:5px; color:#222; text-align:center;">
                </div>`;
        });

        f.innerHTML += `<button type="submit" class="btn" style="margin-top:40px;">Submit Test</button>`;

        f.onsubmit = async (e) => {
            e.preventDefault();
            if (!localStorage.getItem('userEmail')) return alert("Please login to submit your test.");

            let totalScore = 0;
            let resultData = { 
                action: 'saveResult', 
                email: localStorage.getItem('userEmail'), 
                level: `Maths_${lvl}`, 
                testNum: n 
            };

            if (lvl === 'Expert') {
                for (let s = 0; s < 40; s++) { // 40 sections
                    let sCorrect = 0;
                    let sAttempted = 0;
                    for (let i = 0; i < 3; i++) {
                        let idx = (s * 3) + i;
                        let val = document.getElementById(`q${idx}`).value.trim();
                        if (val !== "") sAttempted++;
                        let isCorrect = (val == q[idx].answer);
                        if (isCorrect) sCorrect++;
                        resultData[`Q${idx + 1}`] = val === "" ? "-" : (isCorrect ? "1" : "0");
                    }
                    // Scoring: 1 if all 3 correct, 0 if attempted but wrong, - if none attempted
                    if (sCorrect === 3) totalScore += 1;
                }
            } else {
                q.forEach((x, i) => {
                    let val = document.getElementById(`q${i}`).value.trim();
                    let isCorrect = (val == x.answer);
                    if (isCorrect) totalScore++;
                    resultData[`Q${i + 1}`] = val === "" ? "-" : (isCorrect ? "1" : "0");
                });
            }

            resultData.marks = totalScore;
            resultData.total = (lvl === 'Expert') ? 40 : q.length;

            await fetch(API_URL, { method: 'POST', body: JSON.stringify(resultData) });
            alert(`Test Submitted! Score: ${totalScore}/${resultData.total}`);
            loadTests(lvl);
        };

    } catch (err) {
        alert(`Error loading test. Ensure ${lvl}.json is in the root directory.`);
    }
};

window.onclick = (e) => {
    if (profileBox && !profileBox.contains(e.target)) profileBox.classList.remove('show');
    if (e.target === authModal) authModal.classList.remove('show');
};
