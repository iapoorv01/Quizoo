const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const gifContainer = document.getElementById('gif-container');
const gifImage = document.getElementById('gif-image');
const timerText = document.getElementById('timer'); // Reference to the timer display

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let timeLeft = 15; // Timer starting value (in seconds)
let timer; // Timer reference

let questions = [];

// Fetch questions from the API
fetch(
    'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });

        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

// Start the game
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

// Get a new question and start the timer
getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        // Redirect to end.html
        return window.location.assign('end.html');
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    // Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;

    // Reset the timer for the new question
    timeLeft = 15;
    timerText.innerText = timeLeft;
    startTimer();
};

// Start the timer for the current question
startTimer = () => {
    // Ensure we clear any previous timer
    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;
        timerText.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer); // Stop the timer
            handleTimeOut();
        }
    }, 1000); // Update every second
};

// Handle timeout when the timer runs out
handleTimeOut = () => {
    acceptingAnswers = false;
    gifImage.src = "time-waiting.gif"; // Set the incorrect GIF path
    gifContainer.classList.remove('hidden');

    setTimeout(() => {
        gifContainer.classList.add('hidden');
        getNewQuestion(); // Move to the next question
    }, 1500); // Wait for a while before moving to the next question
};

// When a user selects an answer
choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
            gifImage.src = "right_cartoon.gif"; // Set the correct GIF path
        } else {
            gifImage.src = "cartoon_wrong.gif"; // Set the incorrect GIF path
        }

        // Show the GIF
        gifContainer.classList.remove('hidden');

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            gifContainer.classList.add('hidden'); // Hide the GIF
            getNewQuestion();
        }, 1500); // Wait for a while before moving to the next question
    });
});

// Increment score
incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
