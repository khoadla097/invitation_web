# Phan Thiet Memory Card Match Game

A responsive and visually stunning mini-game web application built in Vietnamese for the UI text, featuring a dynamic double-theme styling system (Dark focus mode for playing, Bright tropical mode for victory), Web Audio pop synthesizers, a countdown timer, and a high-density "Travel Postcard" reward itinerary.

---

## Folder Structure
```text
/
|-- index.html
|-- README.md
|-- .gitignore
|-- assets/
|   |-- css/
|   |   |-- style.css (Contains styling, layouts, Polaroid styling, themes, and fadeInUp keyframes)
|   |-- images/
|   |   |-- pic_1.jpg (First Polaroid picture background)
|   |   |-- pic_2.jpg (Second Polaroid picture background)
|   |-- sounds/
|   |   |-- gameplay.mp3 (BGM looping track during playing)
|   |   |-- victory.mp3 (BGM track played upon winning)
|-- src/
|   |-- js/
|   |   |-- main.js (Controls page flow, toggles body dark theme settings, binds timers/retry actions)
|   |   |-- game.js (Coordinates card deck grids, clicks, matching checks, BGM, and sound FX)
```

---

## Asset Setup Guide

Before running the game, make sure to supply your custom media assets. To do this, place the target files in their respective directories using the exact names specified below:

### 1. Audio Tracks
Place these in `/assets/sounds/`:
- **`gameplay.mp3`**: The background music track that loops continuously while matching cards.
- **`victory.mp3`**: The celebratory background music track played once the game is successfully won.

### 2. Postcard Images
Place these in `/assets/images/`:
- **`pic_1.jpg`**: Custom snapshot displayed inside the left Polaroid photo frame on the victory screen.
- **`pic_2.jpg`**: Custom snapshot displayed inside the right Polaroid photo frame on the victory screen.

*(Note: Dummy placeholder assets have been generated for you so the game can be evaluated immediately out of the box).*

---

## Gameplay & Features

1. **Welcome Screen:** Asks for the player's name with input validation (stops empty submissions).
2. **Focus Mode (Dark Theme):**
   - Switching to the board dims the screen, styling the container as dark mahogany wood boards. This focus-oriented theme helps you concentrate on solving matches.
   - **Countdown Timer:** You have **30 seconds** to match all 4 card pairs. A visual progress bar at the top displays the remaining time, turning red and flashing when you fall below 10 seconds.
   - **Card Clicks Sound FX:** Uses browser-native Web Audio pop synthesizers to click-pop when a card is selected.
   - **Lose Condition:** If the timer reaches 0, the board locks and redirects to the **Game Over** screen with a `"Chơi lại"` button to retry.
3. **Victory Brochure (Bright Tropical Theme):**
   - Instantly stops gameplay BGM, resets its playtime, and plays the victory arpeggio tracks.
   - Removes the mahogany panel, fading in a warm sandy driftwood panel and a bright sun-and-wave sea visual background.
   - The victory postcard reveals itself using a smooth **1.2s reveal entry animation** (`fadeInUpReveal`).
   - Displays a structured, high-density travel brochure:
     - **Voucher info**: Destination, date, guest counts.
     - **Services block**: Detailed Limousine travel and 4-star ocean view resort information.
     - **Itinerary Timeline**: Step-by-step Day 1, Day 2, and Day 3 tourist activities in Phan Thiet.
     - **Mock Polaroid Gallery**: Rotated white border snapshots showing custom images.
     - **Controls**: The Play Again buttons are removed on the victory page, concluding the vacation invitation sequence.

---

## How to Run the Project

Due to browser security settings, loading local ES scripts or triggering autoplay audio elements from raw filesystem paths (`file://`) will trigger CORS and permission blocks. It is highly recommended to run the project via a local HTTP server:

### Option A: Using Python (Recommended)
If you have Python installed, open your command terminal, navigate to the project root directory, and run:
```bash
python -m http.server 8000
# or on some systems:
py -m http.server 8000
```
Then open your browser and navigate to: `http://localhost:8000/index.html`

### Option B: Using Node.js (npx)
If you have Node.js installed, run:
```bash
npx http-server -p 8000
```
Then open your browser and navigate to: `http://localhost:8000`
