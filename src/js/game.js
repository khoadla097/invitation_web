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
   */
  constructor(boardContainer, { onMove, onMatch, onWin } = {}) {
    this.board = boardContainer;
    this.onMove = onMove || (() => {});
    this.onMatch = onMatch || (() => {});
    this.onWin = onWin || (() => {});

    // Phan Thiet themed tropical emojis
    this.emojis = ["🌴", "🌊", "☀️", "🍹"];
    this.cards = [];
    this.flippedCards = [];
    this.moves = 0;
    this.matches = 0;
    this.isLocked = false;
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
  }

  /**
   * Resets the game statistics and locks.
   */
  resetState() {
    this.cards = [];
    this.flippedCards = [];
    this.moves = 0;
    this.matches = 0;
    this.isLocked = false;

    // Trigger callbacks with starting values
    this.onMove(this.moves);
    this.onMatch(this.matches);
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
        // Use timeout to let the match transition finish
        setTimeout(() => {
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
}
