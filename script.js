const quizContainer = document.getElementById('quiz-container');
const questionContainer = document.getElementById('question-container');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreContainer = document.getElementById('score-container');
const timerContainer = document.getElementById('timer-container');
const questionNumberContainer = document.getElementById('question-number');

let currentQuestionIndex = 0;
let questions = [];
let score = 0;
let timeLeft = 30;
let timerInterval;

nextBtn.addEventListener('click', () => {
    const selectedOption = document.querySelector('input[name="option"]:checked');

    if (selectedOption) {
        const selectedOptionIndex = parseInt(selectedOption.value);

        if (selectedOptionIndex === questions[currentQuestionIndex].correctIndex) {
            score++;
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            showQuestion(currentQuestionIndex);
        } else {
            clearInterval(timerInterval);
            showResults();
        }
    }
});

restartBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 30;
    shuffleQuestions(questions);
    showQuestion(currentQuestionIndex);
    scoreContainer.style.display = 'none';
    restartBtn.style.display = 'none';
    nextBtn.style.display = 'block';
    startTimer();
});

function showQuestion(index) {
    questionContainer.innerHTML = '';
    const question = questions[index];

    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerHTML = `<h2>${question.question}</h2>`;

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    question.options.forEach((option, optionIndex) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.innerHTML = `
            <input type="radio" id="option${optionIndex}" name="option" value="${optionIndex}">
            <label for="option${optionIndex}">${option}</label>
        `;
        optionsContainer.appendChild(optionElement);
    });

    questionElement.appendChild(optionsContainer);
    questionContainer.appendChild(questionElement);
    scoreContainer.style.display = 'none';

    // Update question number
    questionNumberContainer.textContent = `Question ${index + 1} of ${questions.length}`;


}

function showResults() {
    questionContainer.innerHTML = '';

    const resultElement = document.createElement('div');
    resultElement.classList.add('result');
    resultElement.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your score: ${score} / ${questions.length}</p>
    `;

    const messageElement = document.createElement('p');
    if (score >= Math.ceil(questions.length / 2)) {
        messageElement.innerHTML = 'Congratulations! You passed the quiz. 😃';
    } else {
        messageElement.innerHTML = 'You did not pass the quiz. Please try again. 😞';
    }

    resultElement.appendChild(messageElement);
    questionContainer.appendChild(resultElement);

    scoreContainer.style.display = 'block';
    restartBtn.style.display = 'block';
    nextBtn.style.display = 'none';
}

function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerContainer.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.querySelector('#time-up').textContent = "Time's up!";
            showResults();
        }
    }, 1000);
}

// Load questions from JSON file
fetch('quiz.json')
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        shuffleQuestions(questions);
        showQuestion(currentQuestionIndex);
        startTimer();
    });