// ==========================================
// 1. State Variables & Data 🏴‍☠️
// ==========================================
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let streak = 0;
let selectedOptionId = null;

// ==========================================
// 2. DOM Elements 🗺️
// ==========================================
// Screens
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');

// Buttons
const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const themeToggleBtn = document.getElementById('theme-toggle');

// Text & Containers
const streakCounter = document.getElementById('streak-counter');
const scoreCounter = document.getElementById('score-counter');
const categoryBadge = document.getElementById('category-badge');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const resultTitle = document.getElementById('result-title');
const explanationText = document.getElementById('explanation-text');

// ==========================================
// 3. Initialization & Fetching Data ⚓
// ==========================================
// Fetch the JSON file when the script loads
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        // Enable the start button once data is loaded
        startBtn.textContent = "Weigh Anchor (Start) ⚓";
        startBtn.disabled = false;
    })
    .catch(error => {
        console.error("Error loading the Grimoire:", error);
        questionText.textContent = "Failed to load questions. Check your JSON file!";
    });

// ==========================================
// 4. Event Listeners 🧭
// ==========================================
startBtn.addEventListener('click', startGame);
submitBtn.addEventListener('click', submitAnswer);
nextBtn.addEventListener('click', loadNextQuestion);
themeToggleBtn.addEventListener('click', toggleTheme);

// ==========================================
// 5. Core Game Functions ⛵
// ==========================================

function startGame() {
    switchView(welcomeScreen, quizScreen);
    currentQuestionIndex = 0;
    score = 0;
    streak = 0;
    updateHUD();
    loadQuestion();
}

function loadQuestion() {
    // Reset state for new question
    selectedOptionId = null;
    submitBtn.disabled = true;
    optionsContainer.innerHTML = ''; // Clear old options

    const currentQuestion = questions[currentQuestionIndex];
    
    // Update UI text
    categoryBadge.textContent = `${currentQuestion.blueprint_area} - ${currentQuestion.topic}`;
    questionText.textContent = currentQuestion.prompt;

    // Generate option buttons
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = `${option.id}) ${option.text}`;
        
        button.addEventListener('click', () => selectOption(option.id, button));
        optionsContainer.appendChild(button);
    });
}

function selectOption(id, clickedButton) {
    selectedOptionId = id;
    
    // Remove 'selected' class from all buttons
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Add 'selected' class to the clicked button
    clickedButton.classList.add('selected');
    
    // Enable the submit button
    submitBtn.disabled = false;
}

function submitAnswer() {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOptionId === currentQuestion.correct_answer;
    
    // Find the specific option the user selected to get its feedback
    const selectedOptionData = currentQuestion.options.find(opt => opt.id === selectedOptionId);

    if (isCorrect) {
        streak++;
        score += 10 + (streak * 5); // Bonus XP for streaks!
        resultTitle.textContent = "Fair Winds! Correct! 🏆";
        resultTitle.style.color = "#2e7d32"; // Green
        fireConfetti();
    } else {
        streak = 0; // Reset streak
        resultTitle.textContent = "Dismasted! Incorrect. 💥";
        resultTitle.style.color = "#c62828"; // Red
    }

    // Show the feedback specifically tailored to the option they picked
    explanationText.textContent = selectedOptionData.feedback;

    updateHUD();
    switchView(quizScreen, resultsScreen);
}

function loadNextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        switchView(resultsScreen, quizScreen);
        loadQuestion();
    } else {
        // End of Quiz
        resultTitle.textContent = "Voyage Complete! 🏁";
        explanationText.textContent = `You finished the quiz with ${score} XP and a max streak of ${streak}. Refresh the page to sail again!`;
        nextBtn.style.display = 'none'; // Hide next button
    }
}

// ==========================================
// 6. Utility Functions ⚙️
// ==========================================

function switchView(hideElement, showElement) {
    hideElement.classList.remove('active-view');
    hideElement.classList.add('hidden-view');
    // Slight delay to allow CSS transitions if needed
    setTimeout(() => {
        hideElement.style.display = 'none';
        showElement.style.display = 'block';
        showElement.classList.remove('hidden-view');
        showElement.classList.add('active-view');
    }, 50);
}

function updateHUD() {
    streakCounter.textContent = `🔥 Streak: ${streak}`;
    scoreCounter.textContent = `⚓ XP: ${score}`;
}

function toggleTheme() {
    document.body.classList.toggle('pirate-theme');
    
    if (document.body.classList.contains('pirate-theme')) {
        themeToggleBtn.textContent = '⛵ Yacht Club Mode';
    } else {
        themeToggleBtn.textContent = '🏴‍☠️ Pirate Mode';
    }
}

function fireConfetti() {
    // Requires canvas-confetti library loaded in HTML
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#005b96', '#d32f2f', '#ffffff', '#d4af37'] // Nautical colors
        });
    }
}