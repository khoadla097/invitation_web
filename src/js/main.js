"use strict";

import { MemoryGame } from "./game.js";

// Global Application State
let playerName = "";
let gameInstance = null;

// DOM Selectors
const nameInput = document.getElementById("name-input");
const startBtn = document.getElementById("start-btn");
const nameError = document.getElementById("name-error");

const playerDisplay = document.getElementById("player-display");
const winnerDisplay = document.getElementById("winner-display");

const movesCount = document.getElementById("moves-count");
const matchesCount = document.getElementById("matches-count");
const gameBoard = document.getElementById("game-board");
const resetBtn = document.getElementById("reset-btn");
const restartBtn = document.getElementById("restart-btn");

/**
 * Changes active screen visibility with smooth animations.
 * @param {string} screenId - The ID of the screen to activate.
 */
const showScreen = (screenId) => {
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => {
    if (screen.id === screenId) {
      screen.classList.add("screen--active");
    } else {
      screen.classList.remove("screen--active");
    }
  });
};

/**
 * Validates player name and initiates the game.
 */
const handleStartGame = () => {
  const nameValue = nameInput.value.trim();

  // Simple validation for empty name
  if (!nameValue) {
    nameError.textContent = "Vui lòng nhập tên của bạn để bắt đầu!";
    nameError.classList.add("visible");
    nameInput.focus();
    return;
  }

  // Clear errors and store name
  nameError.textContent = "";
  nameError.classList.remove("visible");
  playerName = nameValue;

  // Update name placeholders on Game and Victory screens
  playerDisplay.textContent = playerName;
  winnerDisplay.textContent = playerName;

  // Initialize and start memory game
  if (!gameInstance) {
    gameInstance = new MemoryGame(gameBoard, {
      onMove: (moves) => {
        movesCount.textContent = moves;
      },
      onMatch: (matches) => {
        matchesCount.textContent = matches;
      },
      onWin: () => {
        showScreen("victory-screen");
      }
    });
  }

  gameInstance.init();
  showScreen("game-screen");
};

/**
 * Resets the current game board and score counters without resetting the player name.
 */
const handleResetGame = () => {
  if (gameInstance) {
    gameInstance.init();
  }
};

/**
 * Starts a new game session for the player.
 */
const handleRestartGame = () => {
  if (gameInstance) {
    gameInstance.init();
  }
  showScreen("game-screen");
};

// Event Listeners Configuration
startBtn.addEventListener("click", handleStartGame);

nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleStartGame();
  }
});

// Clear validation warning when user starts typing again
nameInput.addEventListener("input", () => {
  if (nameError.classList.contains("visible")) {
    nameError.classList.remove("visible");
    nameError.textContent = "";
  }
});

resetBtn.addEventListener("click", handleResetGame);
restartBtn.addEventListener("click", handleRestartGame);
