/**
 * Boat Learner - Quiz Engine
 * Features: External JSON fetching, Progress Tracking, and Score Calculation
 */

let quizData = [];
let currentIdx = 0;
let score = 0;
let answered = false;

// 1. DOM Elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const qCountDisplay = document.getElementById('q-count');
const questionContent = document.getElementById('question-content');
const resultScreen = document.getElementById('result-screen');
const finalScoreDisplay = document.getElementById('final-score');
const feedbackDisplay = document.getElementById('feedback');

// 2. Fetch the Data from questions.json
async function loadQuizData() {
    try {
        // Adding a small timestamp to prevent the browser from caching old questions
        const response = await fetch('questions.json?v=' + new Date().getTime());
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        quizData = await response.json();
        
        if (quizData.length > 0) {
            initQuiz();
        } else {
            questionText.innerText = "The question file is empty. Please check questions.json.";
        }
    } catch (error) {
        console.error("Could not load quiz data:", error);
        questionText.innerText = "Error loading questions. Make sure questions.json is in the same folder and you are viewing this via a web server (like GitHub Pages).";
    }
}

// 3. Initialize/Render the Current Question
function initQuiz() {
    answered = false;
    const currentQuestion = quizData[currentIdx];

    // Update Progress UI
    const progressPercent = (currentIdx / quizData.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
    qCountDisplay.innerText = `Question ${currentIdx + 1} of ${quizData.length}`;

    // Set Question Text
    questionText.innerText = currentQuestion.q;

    // Clear and Build Options
    optionsContainer.innerHTML = '';
    currentQuestion.a.forEach((optionText, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerText = optionText;
        button.onclick = () => handleAnswer(index, button);
        optionsContainer.appendChild(button);
    });

    // Hide Next Button until answer is chosen
    nextBtn.style.display = 'none';
}

// 4. Handle User Choice
function handleAnswer(selectedIndex, clickedButton) {
    if (answered) return; // Prevent multiple clicks
    answered = true;

    const correctIndex = quizData[currentIdx].c;
    const allButtons = optionsContainer.querySelectorAll('.option-btn');

    if (selectedIndex === correctIndex) {
        clickedButton.classList
