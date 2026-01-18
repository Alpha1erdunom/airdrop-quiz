// État du quiz
let currentQuestion = 0;
let answers = {
    q1: null,
    q2: null,
    q3: [],
    q4: null
};

// Questions
const questions = [
    {
        id: 'q1',
        text: 'Quel est ton niveau en DeFi ?',
        type: 'radio',
        options: [
            { value: 'A', label: 'Débutant' },
            { value: 'B', label: 'Intermédiaire' },
            { value: 'C', label: 'Pro' },
            { value: 'D', label: 'Expert' }
        ]
    },
    {
        id: 'q2',
        text: 'Combien de temps peux-tu consacrer aux airdrops ?',
        type: 'radio',
        options: [
            { value: 'A', label: '1–3 h/semaine' },
            { value: 'B', label: '1–2 h/jour' },
            { value: 'C', label: '3–4 h/jour' },
            { value: 'D', label: 'Temps plein' }
        ]
    },
    {
        id: 'q3',
        text: 'Quelles sont tes compétences ? (Choix multiples - Au moins une réponse)',
        type: 'checkbox',
        options: [
            { value: 'A', label: 'Dev / Vibecoder' },
            { value: 'B', label: 'Trader' },
            { value: 'C', label: 'Marketing / Contenu' },
            { value: 'D', label: 'La réponse D' }
        ]
    },
    {
        id: 'q4',
        text: 'Quel capital peux-tu investir ?',
        type: 'radio',
        options: [
            { value: 'A', label: '0 $' },
            { value: 'B', label: '100–2 500 $' },
            { value: 'C', label: '2 500–10 000 $' },
            { value: 'D', label: '10 000+ $' }
        ]
    }
];

// Fonction de transition avec rideau
function showScreen(screenId) {
    const curtain = document.getElementById('curtain');
    
    // Descendre le rideau
    curtain.classList.add('closing');
    
    setTimeout(() => {
        // Changer d'écran
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        
        // Remonter le rideau
        curtain.classList.remove('closing');
    }, 500);
}

// Démarrer le quiz
function startQuiz() {
    currentQuestion = 0;
    answers = { q1: null, q2: null, q3: [], q4: null };
    showScreen('screen-question');
    displayQuestion();
}

// Afficher une question
function displayQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('questionNumber').textContent = `Question ${currentQuestion + 1}/4`;
    document.getElementById('questionText').textContent = q.text;
    
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';
    
    q.options.forEach(option => {
        const div = document.createElement('div');
        div.className = 'answer-option';
        
        const input = document.createElement('input');
        input.type = q.type;
        input.name = q.id;
        input.value = option.value;
        input.id = `${q.id}_${option.value}`;
        
        const label = document.createElement('label');
        label.htmlFor = `${q.id}_${option.value}`;
        label.textContent = option.label;
        
        div.appendChild(input);
        div.appendChild(label);
        container.appendChild(div);
    });
}

// Question suivante
function nextQuestion() {
    const q = questions[currentQuestion];
    
    if (q.type === 'radio') {
        const selected = document.querySelector(`input[name="${q.id}"]:checked`);
        if (!selected) {
            alert('Merci de sélectionner une réponse !');
            return;
        }
        answers[q.id] = selected.value;
    } else {
        const selected = Array.from(document.querySelectorAll(`input[name="${q.id}"]:checked`))
            .map(input => input.value);
        if (selected.length === 0) {
            alert('Merci de sélectionner au moins une réponse !');
            return;
        }
        answers[q.id] = selected;
    }
    
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        showScreen('screen-question');
        setTimeout(displayQuestion, 500);
    } else {
        showScreen('screen-optin');
    }
}

// S'inscrire et voir résultats
function subscribeAndShowResults() {
    const email = document.getElementById('emailInput').value;
    if (email && email.includes('@')) {
        // Ici tu pourrais ajouter l'intégration Substack plus tard
        console.log('Email:', email);
        showResults();
    } else {
        alert('Merci d\'entrer une adresse email valide !');
    }
}

// Passer et voir résultats
function skipToResults() {
    showResults();
}

// Afficher les résultats
function showResults() {
    showScreen('screen-results');
    
    setTimeout(() => {
        const container = document.getElementById('resultsContainer');
        container.innerHTML = '';
        
        const results = calculateResults();
        
        if (results.length === 0) {
            container.innerHTML = '<div class="no-results">Désolé, tu es inéligible 🙁</div>';
        } else {
            results.forEach(result => {
                const card = document.createElement('div');
                card.className = 'result-card';
                card.innerHTML = `
                    <h3>${result.title}</h3>
                    <p>${result.description}</p>
                `;
                container.appendChild(card);
            });
        }
    }, 500);
}

// Calculer les résultats selon les règles
function calculateResults() {
    const results = [];
    
    // Règle 1: Perle (Rôle Discord)
    if (['A', 'B', 'C'].includes(answers.q4) && ['B', 'C', 'D'].includes(answers.q2)) {
        results.push({
            title: 'Perle (Rôle Discord)',
            description: 'Participe aux communautés Discord actives et obtiens des rôles spéciaux. Interagis régulièrement pour maximiser tes chances d\'airdrops futurs.'
        });
    }
    
    // Règle 2: Farming de perps en DN
    if (['C', 'D'].includes(answers.q4)) {
        results.push({
            title: 'Farming de perps en DN (Variational, Paradex...)',
            description: 'Utilise ton capital pour farmer du volume sur les plateformes de trading perpétuel décentralisées. Stratégie idéale pour les budgets moyens à élevés.'
        });
    }
    
    // Règle 3: Farm de volume sur Extended + Vault
    if (answers.q3.includes('B') && ['C', 'D'].includes(answers.q4)) {
        results.push({
            title: 'Farm de volume sur Extended + Vault',
            description: 'Combine tes compétences de trader avec ton capital pour maximiser le farming de volume sur Extended et les stratégies de Vault.'
        });
    }
    
    // Règle 4: Programmes Ambassadeurs
    if (answers.q3.includes('C')) {
        results.push({
            title: 'Programmes Ambassadeurs',
            description: 'Tes compétences en marketing et création de contenu sont parfaites pour rejoindre des programmes ambassadeurs. Crée du contenu et développe ta communauté.'
        });
    }
    
    return results;
}

// Recommencer
function restartQuiz() {
    showScreen('screen-home');
}
