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
|   |   |-- style.css (Contains layout, themes, scrapbook photo rules, flower corners, and lightbox styles)
|   |-- images/
|   |   |-- mui_ne_scenery.png (Mui Ne scenery photo - Slot 1)
|   |   |-- ocean_view_resort.png (Resort swimming pool photo - Slot 2)
|   |   |-- atv_riding.png (ATV sand dunes riding photo - Slot 3)
|   |   |-- seafood_feast.png (Seafood dining photo - Slot 4)
|   |   |-- blind_box_mascot.png (Pop Mart-style mascot character)
|   |   |-- flower-top-left.png (Watercolour Dahlia & Delphinium left flourish)
|   |   |-- flower-top-right.png (Watercolour Dahlia & Delphinium right flourish)
|   |-- sounds/
|   |   |-- bgm-ambient.mp3 (Continuous looping BGM from welcome screen to gameplay)
|   |   |-- bgm-romantic.mp3 (Continuous looping romantic BGM on victory screen)
|   |   |-- sfx-card-flip.mp3 (Event-driven sound effect played on card click)
|   |   |-- sfx-win-chime.mp3 (Event-driven chime played once when victory is reached)
|-- src/
|   |-- js/
|   |   |-- audio.js (Web Audio API Manager for looping BGMs, crossfades, and mute toggle)
|   |   |-- main.js (Controls page flow, toggles themes, handles lightbox clicks, and triggers audio unlock)
|   |   |-- game.js (Coordinates card deck grids, clicks, matching checks, SFX triggers, and game flow)
```

---

## Asset Setup Guide

All media assets are pre-installed in `/assets/images/` and `/assets/sounds/`. To substitute them with your own personalized files, simply overwrite the respective files:

### 1. Audio Tracks
Place these in `/assets/sounds/`:
- **`bgm-ambient.mp3`**: The ambient background music track that loops continuously during Welcome and Gameplay screens.
- **`bgm-romantic.mp3`**: The romantic background music track that loops continuously during the Victory screen.
- **`sfx-card-flip.mp3`**: Short event-driven sound effect triggered on every card flip.
- **`sfx-win-chime.mp3`**: Short celebratory chime triggered exactly once when the victory condition is met.

### 2. Scrapbook Images
Place these in `/assets/images/`:
- **`mui_ne_scenery.png`**: Custom photo showing Mũi Né landscape (Slot 1).
- **`ocean_view_resort.png`**: Custom photo showing resort beachfront/swimming pool (Slot 2).
- **`atv_riding.png`**: Custom photo showing ATV riding on white dunes (Slot 3).
- **`seafood_feast.png`**: Custom photo showing beach seafood feast (Slot 4).
- **`blind_box_mascot.png`**: Cute mascot presenting the trip at the bottom-right corner.
- **`flower-top-left.png` & `flower-top-right.png`**: Organic watercolor dahlia and delphinium corner graphics.

---

## Gameplay & Features

1. **Welcome Screen:** Asks for the player's name with input validation (stops empty submissions).
2. **Focus Mode (Dark Theme):**
   - Switching to the board dims the screen, styling the container as dark mahogany wood boards. This focus-oriented theme helps you concentrate on solving matches.
   - **Countdown Timer:** You have **30 seconds** to match all 4 card pairs. A visual progress bar at the top displays the remaining time, turning red and flashing when you fall below 10 seconds.
   - **Card Clicks Sound FX:** Plays `sfx-card-flip.mp3` (with a browser-native Web Audio pop synthesizer as fallback) when a card is selected.
   - **Lose Condition:** If the timer reaches 0, the board locks and redirects to the **Game Over** screen with a `"Chơi lại"` button to retry.
3. **Victory Brochure (Bright Tropical Theme):**
   - Plays the celebratory `sfx-win-chime.mp3` once, and smoothly crossfades BGM from `bgm-ambient` to `bgm-romantic` over 1.5 seconds.
   - Removes the mahogany panel, fading in a warm sandy driftwood panel and a bright sun-and-wave sea visual background.
   - The victory postcard reveals itself using a smooth **1.2s reveal entry animation** (`fadeInUpReveal`).
   - Displays a structured, high-density travel brochure:
      - **Voucher info**: Destination, date, guest counts. (Voucher label text wrapping is fixed with layout limits).
      - **Services block**: Detailed Limousine travel and 4-star ocean view resort information with embedded Resort photo (Slot 2).
      - **Itinerary Timeline**: Step-by-step Day 1, Day 2, and Day 3 tourist activities in Phan Thiet with activity photos (ATV riding - Slot 3, Seafood dining - Slot 4).
      - **Organic Scrapbook styling**: Alternating rotated photo polaroid frames that tilt like hand-glued snapshots, and straighten/scale up on hover.
      - **Floral Corner Flourishes**: Elegant watercolor corner illustrations of Dahlias (hoa thược dược) and Delphiniums (hoa phi yến) that blend borderlessly on the card using CSS `mix-blend-mode: multiply`.
      - **Mascot figurine**: A cute beach Pop Mart/Art Toy mascot displaying the trip at the bottom-right corner with a well-padded speech bubble.
      - **Interactive Lightbox Zoom**: Clicking any photo opens a high-resolution lightbox popup window to admire details. Closes via clicking background overlay or pressing `Escape`.
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
