"use strict";

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
const timerCount = document.getElementById("timer-count");
const timerBar = document.getElementById("timer-bar");

const gameBoard = document.getElementById("game-board");
const resetBtn = document.getElementById("reset-btn");
const retryBtn = document.getElementById("retry-btn"); // Game over retry

/**
 * Changes active screen visibility with smooth animations and theme-swapping.
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

  // Dynamic Background: Switch to bright tropical theme on victory; keep dark focus theme elsewhere
  if (screenId === "victory-screen") {
    document.body.classList.remove("theme-dark");
  } else {
    document.body.classList.add("theme-dark");
  }
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
      onTimeUpdate: (timePercent, timeLeft) => {
        timerCount.textContent = timeLeft;
        timerBar.style.width = `${timePercent}%`;
        
        // Add flashing warning styles when time is low (< 10s)
        const timerBadge = timerCount.parentElement;
        if (timeLeft <= 10) {
          timerBadge.classList.add("is-warning");
        } else {
          timerBadge.classList.remove("is-warning");
        }
      },
      onWin: () => {
        showScreen("victory-screen");
      },
      onLose: () => {
        showScreen("lose-screen");
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
 * Retries the game after a Game Over scenario.
 */
const handleRetryGame = () => {
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
retryBtn.addEventListener("click", handleRetryGame);

/**
 * Vanilla JavaScript Lightbox Controller for Zoomable Reward Images.
 */
const initLightbox = () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = lightbox.querySelector(".lightbox__close");
  const zoomableImages = document.querySelectorAll(".zoomable");

  zoomableImages.forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.classList.add("lightbox--active");
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("lightbox--active");
    document.body.style.overflow = "";
  };

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    // Close lightbox if click is on backdrop, not on the image itself
    if (e.target !== lightboxImg && e.target !== closeBtn) {
      closeLightbox();
    }
  });

  // Support Escape key to close the zoomed image
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("lightbox--active")) {
      closeLightbox();
    }
  });
};

// Initialize on load
initLightbox();

