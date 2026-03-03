async function loadTests(level) {
    const hero = document.querySelector('.hero');
    // Added a Back button for better navigation
    hero.innerHTML = `
        <button class="back-btn" onclick="location.reload()" style="margin-bottom:20px; cursor:pointer; background:none; border:1px solid #fff; color:#fff; padding:5px 15px; border-radius:20px;">← Back to Home</button>
        <h1>${level} Tests</h1>
        <div class="test-grid"></div>`;
    
    const grid = hero.querySelector('.test-grid');
    for (let i = 1; i <= 50; i++) {
        const btn = document.createElement('button');
        btn.className = 'test-btn'; 
        btn.innerText = `Test ${i}`;
        btn.onclick = () => startTest(level, i);
        grid.appendChild(btn);
    }
}

async function startTest(level, testNum) {
    const hero = document.querySelector('.hero');
    hero.innerHTML = `<h1>Loading Test ${testNum}...</h1>`;

    try {
        const res = await fetch(`${level.toLowerCase()}.json`);
        if (!res.ok) throw new Error("File not found");
        const data = await res.json();
        const questions = data[`Test${testNum}`];
        
        hero.innerHTML = `
            <button class="back-btn" onclick="loadTests('${level}')" style="margin-bottom:20px; cursor:pointer; background:none; border:1px solid #fff; color:#fff; padding:5px 15px; border-radius:20px;">← Back to Grid</button>
            <h1>${level} - Test ${testNum}</h1>
            <form id="testForm" style="color:#fff; text-align:left; max-width:600px; margin:auto; padding-bottom:50px;"></form>`;
        
        const form = document.getElementById('testForm');
        
        questions.forEach((q, idx) => {
            // Special formatting for Expert level (Sections of 3)
            if (level === 'Expert' && idx % 3 === 0) {
                form.innerHTML += `<div class="expert-section-header" style="color:#f39c12; margin-top:20px; border-bottom:1px solid #555;">Section ${Math.floor(idx/3) + 1}</div>`;
            }
            form.innerHTML += `
                <div style="margin:15px 0; display:flex; justify-content:space-between; align-items:center;">
                    <span>${idx+1}. ${q.question}</span>
                    <input type="text" id="q${idx}" autocomplete="off" style="width:70px; border-radius:5px; border:none; padding:5px; color:#222;">
                </div>`;
        });

        form.innerHTML += `<button type="submit" class="btn" style="margin-top:30px; background:#f39c12; color:#fff;">Submit Test</button>`;

        form.onsubmit = async (e) => {
            e.preventDefault();
            const email = localStorage.getItem('userEmail');
            if (!email) return alert("Please login to save your marks!");

            let marks = 0; 
            let qData = {};

            if (level === 'Expert') {
                // Expert logic: 1 mark per section of 3 correct answers
                for (let s = 0; s < (questions.length / 3); s++) {
                    let sectionCorrect = 0;
                    for (let i = 0; i < 3; i++) {
                        let idx = (s * 3) + i;
                        let val = document.getElementById(`q${idx}`).value.trim();
                        let isCorrect = (val == questions[idx].answer);
                        if (isCorrect) sectionCorrect++;
                        qData[`Q${idx+1}`] = val === "" ? "-" : (isCorrect ? "1" : "0");
                    }
                    if (sectionCorrect === 3) marks++;
                }
            } else {
                // Standard logic: 1 mark per question
                questions.forEach((q, idx) => {
                    const userAns = document.getElementById(`q${idx}`).value.trim();
                    const isCorrect = userAns == q.answer;
                    if (isCorrect) marks++;
                    qData[`Q${idx+1}`] = userAns === "" ? "-" : (isCorrect ? "1" : "0");
                });
            }

            const totalPossible = (level === 'Expert') ? (questions.length / 3) : questions.length;

            const payload = {
                action: 'saveResult',
                spreadsheetId: '188UkQoo6dQV5PNktB6sKkESRR4rsS35CJboX0exvtHw',
                email: email,
                level: `Maths_${level}`,
                testNum: testNum,
                marks: marks,
                total: totalPossible,
                ...qData
            };

            // Use the API_URL defined in your main script
            await fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) });
            alert(`Test Submitted! Marks: ${marks}/${totalPossible}`);
            loadTests(level);
        };
    } catch (err) {
        alert("Error loading test file. Please ensure " + level.toLowerCase() + ".json is in the root folder.");
    }
}
