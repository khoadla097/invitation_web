"use strict";

/**
 * Class representing the Memory Matching Game logic.
 */
class MemoryGame {
  /**
   * Create a memory game instance.
   * @param {HTMLElement} boardContainer - The DOM element where cards are rendered.
   * @param {Object} callbacks - Callback functions for game state changes.
   * @param {Function} callbacks.onMove - Callback triggered when moves increase.
   * @param {Function} callbacks.onMatch - Callback triggered when a pair matches.
   * @param {Function} callbacks.onWin - Callback triggered when the game is won.
   * @param {Function} callbacks.onTimeUpdate - Callback triggered on timer countdown ticks.
   * @param {Function} callbacks.onLose - Callback triggered when the timer runs out.
   */
  constructor(boardContainer, { onMove, onMatch, onWin, onTimeUpdate, onLose } = {}) {
    this.board = boardContainer;
    this.onMove = onMove || (() => {});
    this.onMatch = onMatch || (() => {});
    this.onWin = onWin || (() => {});
    this.onTimeUpdate = onTimeUpdate || (() => {});
    this.onLose = onLose || (() => {});

    // Phan Thiet themed tropical emojis
    this.emojis = ["🌴", "🌊", "☀️", "🍹"];
    this.cards = [];
    this.flippedCards = [];
    
    // Core state
    this.moves = 0;
    this.matches = 0;
    this.isLocked = false;
    
    // Timer state
    this.totalDuration = 30; // 30 seconds countdown
    this.timeLeft = this.totalDuration;
    this.timerInterval = null;

    // Lazily initialized AudioContext for browser compatibility
    this.audioCtx = null;
  }

  /**
   * Initializes the game by resetting statistics, shuffling, and rendering the deck.
   */
  init() {
    this.resetState();
    
    const shuffledEmojis = this.shuffle([...this.emojis, ...this.emojis]);

    // Create card data models
    this.cards = shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji: emoji,
      isFlipped: false,
      isMatched: false
    }));

    this.renderBoard();
    this.initTimer();
  }

  /**
   * Resets the game statistics and locks. Clears active intervals.
   */
  resetState() {
    // Clear timer interval if running
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.cards = [];
    this.flippedCards = [];
    this.moves = 0;
    this.matches = 0;
    this.isLocked = false;
    this.timeLeft = this.totalDuration;

    // Trigger callbacks with starting values
    this.onMove(this.moves);
    this.onMatch(this.matches);
  }

  /**
   * Configures and starts the countdown timer loop.
   */
  initTimer() {
    this.onTimeUpdate(100, this.timeLeft);

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      
      const timePercent = (this.timeLeft / this.totalDuration) * 100;
      this.onTimeUpdate(timePercent, this.timeLeft);

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.handleGameLoss();
      }
    }, 1000);
  }

  /**
   * Handles user loss when the timer runs out.
   */
  handleGameLoss() {
    this.isLocked = true;
    this.playAudioEffect("lose");
    this.onLose();
  }

  /**
   * Shuffles an array using the Fisher-Yates algorithm.
   * @param {Array} array - The array to shuffle.
   * @returns {Array} - The shuffled array copy.
   */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Renders the cards to the board DOM element.
   */
  renderBoard() {
    this.board.innerHTML = "";
    
    this.cards.forEach((card, index) => {
      const cardElement = this.createCardElement(card, index);
      this.board.appendChild(cardElement);
    });
  }

  /**
   * Creates the HTML element for a card.
   * @param {Object} card - The card object.
   * @param {number} index - The index of the card in the array.
   * @returns {HTMLElement} - The created card DOM element.
   */
  createCardElement(card, index) {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.dataset.index = index;

    cardEl.innerHTML = `
      <div class="card__inner">
        <div class="card__face card__face--back"></div>
        <div class="card__face card__face--front">${card.emoji}</div>
      </div>
    `;

    cardEl.addEventListener("click", () => this.handleCardClick(cardEl, index));
    return cardEl;
  }

  /**
   * Handles clicking on a card element.
   * @param {HTMLElement} cardEl - The clicked card element.
   * @param {number} index - The index of the clicked card.
   */
  handleCardClick(cardEl, index) {
    const card = this.cards[index];

    // Prevent clicks if board is locked, card is already matched, or clicked card is already flipped
    if (this.isLocked || card.isMatched || card.isFlipped) {
      return;
    }

    // Play flip pop audio
    this.playAudioEffect("flip");

    // Flip card
    card.isFlipped = true;
    cardEl.classList.add("is-flipped");
    this.flippedCards.push({ element: cardEl, data: card });

    // When two cards are flipped, check for a match
    if (this.flippedCards.length === 2) {
      this.moves++;
      this.onMove(this.moves);
      this.checkMatch();
    }
  }

  /**
   * Checks if the two flipped cards match.
   */
  checkMatch() {
    this.isLocked = true;
    const [card1, card2] = this.flippedCards;

    if (card1.data.emoji === card2.data.emoji) {
      // It's a match!
      card1.data.isMatched = true;
      card2.data.isMatched = true;
      
      // Add matched styling
      card1.element.classList.add("is-matched");
      card2.element.classList.add("is-matched");

      // Visual helper class
      card1.element.classList.add("is-disabled");
      card2.element.classList.add("is-disabled");

      this.matches++;
      this.onMatch(this.matches);

      // Clean active selections and unlock board
      this.flippedCards = [];
      this.isLocked = false;

      // Check if all pairs are found (total pairs = 4)
      if (this.matches === this.emojis.length) {
        // Clear timer immediately on win
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }

        // Use timeout to let the match transition finish
        setTimeout(() => {
          this.playAudioEffect("win");
          this.onWin();
        }, 600);
      }
    } else {
      // Not a match, flip back after a brief delay
      setTimeout(() => {
        card1.data.isFlipped = false;
        card2.data.isFlipped = false;

        card1.element.classList.remove("is-flipped");
        card2.element.classList.remove("is-flipped");

        this.flippedCards = [];
        this.isLocked = false;
      }, 1000);
    }
  }

  /**
   * Plays a synthesized HTML5 Web Audio API sound effect.
   * @param {string} type - The type of sound effect ('flip', 'win', 'lose').
   */
  playAudioEffect(type) {
    try {
      // Initialize browser AudioContext on first user action to comply with security policies
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = this.audioCtx;
      
      // Resume audio context if it was suspended
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === "flip") {
        // Short wooden tick / pop effect
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.08);
        
      } else if (type === "win") {
        // Energetic major arpeggio chime (C5 -> E5 -> G5 -> C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + index * 0.08);
          
          gain.gain.setValueAtTime(0.15, now + index * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.25);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + index * 0.08);
          osc.stop(now + index * 0.08 + 0.25);
        });
        
      } else if (type === "lose") {
        // Melancholic descending pitch sawtooth slide
        const notes = [290, 200, 150];
        
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, now + index * 0.15);
          
          gain.gain.setValueAtTime(0.12, now + index * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.15 + 0.4);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + index * 0.15);
          osc.stop(now + index * 0.15 + 0.4);
        });
      }
    } catch (e) {
      console.warn("Web Audio API not supported or blocked by security policy:", e);
    }
  }
}
