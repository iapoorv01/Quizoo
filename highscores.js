const highScoresList = document.getElementById("highScoresList");
const resetHighScoresBtn = document.getElementById("resetHighScoresBtn");

// Retrieve high scores from localStorage or use an empty array if none exist
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// Function to display high scores on the page
function displayHighScores() {
  highScoresList.innerHTML = highScores
    .map(score => {
      return `<li class="high-score">${score.name} - ${score.score}</li>`;
    })
    .join("");
}

// Function to reset (clear) high scores
function resetHighScores() {
  if (confirm("Are you sure you want to reset all high scores?")) {
    localStorage.removeItem("highScores"); // Clear high scores from localStorage
    highScores = []; // Empty the highScores array
    displayHighScores(); // Re-render the list
  }
}

// Display the high scores when the page loads
displayHighScores();

// Event listener for the reset button
resetHighScoresBtn.addEventListener("click", resetHighScores);
