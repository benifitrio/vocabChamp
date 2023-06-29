const questionContainer = document.getElementById('question-container');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreContainer = document.getElementById('score-container');

let currentQuestionIndex = 0;
let questions = [];
let score = 0;

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
            showResults();
        }
    }
});

restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    shuffleQuestions(questions);
    showQuestion(currentQuestionIndex);
    scoreContainer.style.display = 'none';
});

function showQuestion(index) {
    questionContainer.innerHTML = '';
    const question = questions[index];

    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerHTML = `<h2>${question.question}</h2>`;

    question.options.forEach((option, optionIndex) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.innerHTML = `
      <input type="radio" id="option${optionIndex}" name="option" value="${optionIndex}">
      <label for="option${optionIndex}">${option}</label>
    `;
        questionElement.appendChild(optionElement);
    });

    questionContainer.appendChild(questionElement);
    scoreContainer.style.display = 'none';
}

function showResults() {
    questionContainer.innerHTML = '<h2>Quiz Completed!</h2>';

    // Calculate score percentage
    const maxScore = questions.length;
    const percentage = (score / maxScore) * 100;
    console.log(percentage)
        // Display the score
    const scoreElement = document.createElement('p');
    scoreElement.innerHTML = `Your score: ${score} / ${maxScore} (${percentage.toFixed(2)}%)`;
    scoreContainer.innerHTML = '';
    scoreContainer.appendChild(scoreElement);
    scoreContainer.style.display = 'block';
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'block';

    // Show appropriate message and emoticon based on the score
    const messageElement = document.createElement('p');
    if (percentage >= 60) {
        messageElement.innerHTML = 'Congratulations! You passed the quiz. 😃';
    } else {
        messageElement.innerHTML = 'You did not pass the quiz. Please try again. 😞';
    }
    scoreContainer.appendChild(messageElement);
}

function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Load questions from JSON file
fetch('quiz.json')
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        shuffleQuestions(questions);
        showQuestion(currentQuestionIndex);
    });