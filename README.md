# Phan Thiet Memory Card Match Game

A responsive and visually stunning mini-game web application built in Vietnamese for the UI text, with modern design aesthetics, glassmorphism, responsive grid layouts, and 3D card flipping transitions.

## Project Overview
This game asks the user for their name, presents an interactive Memory Card Matching game of 4 pairs (8 cards total), and congratulates them on winning with a custom reward message promising a vacation trip to Phan Thiet.

## Tech Stack
- **Structure:** Vanilla HTML5 with semantic structures.
- **Styling:** Vanilla CSS3 featuring custom properties, Flexbox/Grid layouts, glassmorphism panels, interactive neon hover states, and smooth cubic-bezier 3D flip card animations.
- **Behavior:** Modular Vanilla JavaScript (ES6+) utilizing strict mode, classes, and event-driven design.

## Folder Structure
```text
/
|-- index.html
|-- README.md
|-- .gitignore
|-- assets/
|   |-- css/
|   |   |-- style.css
|-- src/
|   |-- js/
|   |   |-- main.js (Handles state transitions: Name input -> Game view -> Win view)
|   |   |-- game.js (Handles the Memory Match game logic)
```

## Features and Flow
1. **Welcome Screen:** Asks for the player's name ("Nhập tên của bạn để bắt đầu") with active validation (checks for non-empty string input).
2. **Game Screen:** 
   - Welcomes the player dynamically ("Chào [Name], chúc may mắn!").
   - Interactive board of 8 cards matching 4 tropical icons (`🌴`, `🌊`, `☀️`, `🍹`).
   - Trackers displaying total moves and successfully matched pairs.
   - Includes a "Chơi lại từ đầu" (Reset) button.
3. **Victory Screen:** 
   - Triggered automatically when all 4 pairs are matched.
   - Displays congratulations with a custom message: "Chúc mừng [Name] đã chiến thắng! Phần thưởng của bạn là một chuyến du lịch Phan Thiết!".
   - Includes a "Chơi lại" button to directly restart the game under the same profile.

## How to Run the Project
Simply open `index.html` in any modern web browser. No server setup, Node.js, or external package installations are required.

## Future Scope
*Design improvements, sound effects, leaderboards, and harder difficulty levels (e.g., larger grids) can be added in future iterations.*
