const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

// Elements related to result and GIF
const resultDiv = document.getElementById('resultDiv');
const resultBox = document.getElementById('result_box');
const endGif = document.getElementById('end_gif');
const scoreText = document.getElementById('score_text');
const congratsText = document.getElementById('congrats');

// Fetch high scores from local storage
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 5;

// Display the score on the page
finalScore.innerText = mostRecentScore;

// Event listener to enable or disable the Save button based on the username input
username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});

// Show the result and GIF when the quiz is complete
function showResults() {
    // Show result box and end GIF
    resultDiv.style.display = 'block';
    resultBox.style.display = 'block';
    endGif.style.display = 'block';

    // Display final score in the result box
    scoreText.innerText = `Your final score: ${mostRecentScore}`;
    congratsText.innerText = "Congratulations!";
}

// Call this function when the quiz is finished
// You should call `showResults()` after the quiz ends, replacing the part where you're displaying the score.
showResults();

// Save high score logic
function saveHighScore(e) {
    e.preventDefault(); // Prevent form submission if any

    // Ensure a username is provided
    if (!username.value) {
        alert('Please enter a username.');
        return;
    }

    const score = {
        score: mostRecentScore,
        name: username.value,
    };
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score); // Sort in descending order
    highScores.splice(MAX_HIGH_SCORES); // Keep only the top 5 high scores

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('/'); // Redirect back to home page or any other desired page
}
