const authModal = document.querySelector('.auth-modal'),
    loginBtnModal = document.querySelector('.login-btn-modal'),
    closeBtnModal = document.querySelector('.close-btn-modal'),
    profileBox = document.querySelector('.profile-box'),
    avatarCircle = document.querySelector('.avatar-circle'),
    API_URL = 'https://script.google.com/macros/s/AKfycbxlb4eUwslxEPAk3DiNLsAHnw-nE87c71P-ClDi9oL7BadWqE0c10y9agLE2rGNnflg/exec';

let testTimer;

const contentMap = {
    Home: "Hey Buddy!",
    About: "Learning simplified.",
    Maths: `<div class="levels">
                <div class="lvl-card" onclick="loadTests('Beginner')">Beginner</div>
                <div class="lvl-card" onclick="loadTests('Competent')">Competent</div>
                <div class="lvl-card" onclick="loadTests('Expert')">Expert</div>
            </div>`,
    Science: "Explore the universe.",
    Telugu: "Italian of the East.",
    Resources: "Worksheets.",
    Contact: "Reach out anytime!"
};

// --- Navigation Logic ---
document.addEventListener('click', (e) => {
    if (e.target.id === 'menu-icon') document.querySelector('nav').classList.toggle('active');
    
    if (e.target.innerText === 'Logout') {
        profileBox.style.display = 'none';
        loginBtnModal.style.display = 'block';
        profileBox.classList.remove('show');
        localStorage.clear();
        location.reload();
    }

    if (e.target.classList.contains('nav-link') || e.target.classList.contains('logo')) {
        const p = e.target.dataset.page || 'Home';
        const hero = document.querySelector('.hero');
        hero.innerHTML = `<h1>${p === 'Home' ? 'Hey Buddy!' : p}</h1>`;
        
        if (p !== 'Home') {
            const d = document.createElement('div');
            d.className = 'hero-desc';
            d.innerHTML = contentMap[p] || "Content coming soon!"; 
            hero.appendChild(d);
        }
        clearInterval(testTimer);
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
        try {
            const r = await fetch(API_URL, { method: 'POST', body: JSON.stringify(b) });
            const d = await r.json();
            if (d.result === 'success') {
                if (action === 'login') {
                    profileBox.style.display = 'flex';
                    loginBtnModal.style.display = 'none';
                    authModal.classList.remove('show');
                    localStorage.setItem('userEmail', b.email);
                    avatarCircle.innerText = b.email.charAt(0).toUpperCase();
                } else alert("Action successful!");
            } else alert(d.result);
        } catch (err) { alert("Auth failed. Check API_URL."); }
    };
};
['loginForm', 'regForm', 'forgotForm'].forEach(id => handleForm(id, id.replace('Form', '').replace('reg', 'register')));

// --- Timer Logic ---
function startCountdown(seconds) {
    const timerDisplay = document.getElementById('timer');
    let timeLeft = seconds;
    clearInterval(testTimer);
    testTimer = setInterval(() => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        if (timerDisplay) timerDisplay.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (timeLeft <= 0) {
            clearInterval(testTimer);
            document.getElementById('testForm').dispatchEvent(new Event('submit'));
        }
        timeLeft--;
    }, 1000);
}

// --- Maths Tests Logic ---
window.goBackToMaths = () => {
    clearInterval(testTimer);
    const hero = document.querySelector('.hero');
    hero.innerHTML = `<h1>Maths</h1><div class="hero-desc">${contentMap['Maths']}</div>`;
};

window.loadTests = (lvl) => {
    const hero = document.querySelector('.hero');
    hero.innerHTML = `
        <button class="back-btn" onclick="goBackToMaths()">← Back</button>
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

window.startTest = async (lvl, n) => {
    try {
        // Constructing path safely for GitHub Pages root
        const fileName = `${lvl.toLowerCase()}.json`; 
        const r = await fetch(`./${fileName}`); 
        
        if (!r.ok) throw new Error(`Could not find ${fileName}`);
        
        const d = await r.json();
        const q = d[`Test${n}`];

        const hero = document.querySelector('.hero');
        hero.innerHTML = `
            <div style="display:flex; justify-content:space-between; width:100%; max-width:800px; margin: 0 auto 20px;">
                <button class="back-btn" onclick="loadTests('${lvl}')">← Back</button>
                <div id="timer" style="color:#f39c12; font-size:24px; font-weight:700;">10:00</div>
            </div>
            <h1 style="margin-bottom:20px; color:#fff;">${lvl} - Test ${n}</h1>
            <div class="${lvl === 'Expert' ? 'expert-container' : ''}">
                <form id="testForm"></form>
            </div>
        `;

        const f = document.getElementById('testForm');
        startCountdown(600); 

        if (lvl === 'Expert') {
            for (let i = 0; i < 40; i++) {
                const card = document.createElement('div');
                card.className = 'question-card';
                let subHtml = `<div class="question-header">Question ${i+1}</div>`;
                for (let j = 0; j < 3; j++) {
                    let idx = (i * 3) + j;
                    if (q[idx]) {
                        let label = String.fromCharCode(97 + j); 
                        subHtml += `
                            <div class="sub-question">
                                <span class="sub-text"><span class="sub-label">(${i+1}.${label})</span> ${q[idx].question}</span>
                                <input type="text" id="q${idx}" class="expert-input" autocomplete="off">
                            </div>`;
                    }
                }
                card.innerHTML = subHtml;
                f.appendChild(card);
            }
        } else {
            q.forEach((x, i) => {
                f.innerHTML += `
                    <div style="margin:15px 0; display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.1); padding:10px 20px; border-radius:10px; color:#fff;">
                        <span>${i + 1}. ${x.question}</span>
                        <input type="text" id="q${i}" autocomplete="off" style="width:80px; height:35px; border-radius:5px; border:none; text-align:center; font-weight:bold; color:#222;">
                    </div>`;
            });
        }

        f.innerHTML += `<button type="submit" class="btn" style="margin-top:30px; background:#f39c12; color:#fff;">Submit Test</button>`;

        f.onsubmit = async (e) => {
            e.preventDefault();
            clearInterval(testTimer);
            const email = localStorage.getItem('userEmail');
            if (!email) return alert("Please login first!");

            let score = 0;
            let resultData = { action: 'saveResult', email, level: `Maths_${lvl}`, testNum: n };

            if (lvl === 'Expert') {
                for (let s = 0; s < 40; s++) {
                    let sCorrect = 0;
                    for (let i = 0; i < 3; i++) {
                        let idx = (s * 3) + i;
                        let inputElem = document.getElementById(`q${idx}`);
                        let val = inputElem ? inputElem.value.trim() : "";
                        let isCorrect = (val == q[idx].answer);
                        if (isCorrect) sCorrect++;
                        resultData[`Q${idx + 1}`] = val === "" ? "-" : (isCorrect ? "1" : "0");
                    }
                    if (sCorrect === 3) score++;
                }
            } else {
                q.forEach((x, i) => {
                    let inputElem = document.getElementById(`q${i}`);
                    let val = inputElem ? inputElem.value.trim() : "";
                    let isCorrect = (val == x.answer);
                    if (isCorrect) score++;
                    resultData[`Q${i + 1}`] = val === "" ? "-" : (isCorrect ? "1" : "0");
                });
            }

            resultData.marks = score;
            resultData.total = (lvl === 'Expert') ? 40 : q.length;

            try {
                await fetch(API_URL, { method: 'POST', body: JSON.stringify(resultData) });
                alert(`Submitted! Marks: ${score}/${resultData.total}`);
                loadTests(lvl);
            } catch (err) { alert("Submission failed. Check internet."); }
        };
    } catch (err) { 
        alert(`Error: ${err.message}. Ensure ${lvl.toLowerCase()}.json is in your GitHub main folder.`); 
    }
};

window.onclick = (e) => {
    if (profileBox && !profileBox.contains(e.target)) profileBox.classList.remove('show');
    if (e.target === authModal) authModal.classList.remove('show');
};
