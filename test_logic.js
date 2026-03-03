async function loadTests(level) {
    const hero = document.querySelector('.hero');
    hero.innerHTML = `<h1>${level} Tests</h1><div class="test-grid"></div>`;
    const grid = hero.querySelector('.test-grid');
    for (let i = 1; i <= 50; i++) {
        const btn = document.createElement('button');
        btn.className = 'test-btn'; btn.innerText = `Test ${i}`;
        btn.onclick = () => startTest(level, i);
        grid.appendChild(btn);
    }
}

async function startTest(level, testNum) {
    const res = await fetch(`${level.toLowerCase()}.json`);
    const data = await res.json();
    const questions = data[`Test${testNum}`];
    const hero = document.querySelector('.hero');
    hero.innerHTML = `<h1>${level} - Test ${testNum}</h1><form id="testForm" style="color:#fff; text-align:left; max-width:600px; margin:auto;"></form>`;
    const form = document.getElementById('testForm');
    
    questions.forEach((q, idx) => {
        form.innerHTML += `<div style="margin:15px 0;">${idx+1}. ${q.question} <input type="text" id="q${idx}" style="float:right; border-radius:5px; border:none; padding:2px 5px;"></div>`;
    });
    form.innerHTML += `<button type="submit" class="btn" style="margin-top:20px;">Submit Test</button>`;

    form.onsubmit = async (e) => {
        e.preventDefault();
        let marks = 0; let qData = {};
        questions.forEach((q, idx) => {
            const userAns = document.getElementById(`q${idx}`).value;
            const isCorrect = userAns.trim() === q.answer.toString().trim();
            if (isCorrect) marks++;
            qData[`Q${idx+1}`] = userAns === "" ? "-" : (isCorrect ? "1" : "0");
        });

        const payload = {
            action: 'saveResult',
            spreadsheetId: '188UkQoo6dQV5PNktB6sKkESRR4rsS35CJboX0exvtHw',
            email: localStorage.getItem('userEmail'),
            level: level,
            testNum: testNum,
            marks: marks,
            total: questions.length,
            ...qData
        };

        await fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) });
        alert(`Test Submitted! Marks: ${marks}/${questions.length}`);
        location.reload();
    };
}
