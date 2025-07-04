# MindMap (MindMatch Pro)

A fun, interactive, and visually appealing memory card game that challenges your memory, speed, and strategy! Flip cards, find pairs, use power-ups, and try to beat your best score. Designed for both desktop and mobile devices.

---

## Table of Contents

- [Overview](#overview)
- [Gameplay](#gameplay)
- [Features](#features)
- [User Interface](#user-interface)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
- [Customization](#customization)
- [Technical Details](#technical-details)
- [Credits](#credits)

---

## Overview

**MindMap** (MindMatch Pro) is a browser-based memory game where you flip cards to find matching pairs. The game offers multiple difficulty levels, power-ups, and a modern, responsive design. Track your best scores and challenge yourself to improve!

---

## Gameplay

- **Objective:** Find all matching pairs of cards with as few moves and as quickly as possible.
- **Lives:** You start with 50 lives. Each mistake or bomb card costs a life.
- **Difficulty Levels:**
  - **Easy:** 4x4 grid, 8 pairs, no time limit, no special cards.
  - **Medium:** 6x6 grid, 18 pairs, 5-minute limit, bomb cards, power-ups.
  - **Hard:** 8x8 grid, 32 pairs, 15-minute limit, more bomb cards, power-ups.
- **Power-Ups:**
  - **Hint:** Reveals a matching pair.
  - **Freeze:** Temporarily disables bomb cards.
  - **Shuffle:** Shuffles the remaining cards.
- **Bomb Cards:** Flipping a bomb card costs a life and points.
- **Scoring:** Points are awarded for matches, combos, and speed. Streaks increase your multiplier.
- **Game Over:** Lose all lives or run out of time.

---

## Features

- Memory card matching gameplay with increasing difficulty.
- Three difficulty levels: Easy, Medium, Hard.
- Power-ups: Hint, Freeze, Shuffle (with limited uses).
- Bomb and special cards for extra challenge.
- Score, streak, and best score tracking (saved in browser).
- Combo indicator for consecutive matches.
- Pause and resume functionality.
- Responsive design for desktop and mobile.
- Animated effects and modern UI.

---

## User Interface

- **Difficulty Selector:** Choose your level before starting.
- **Power-Ups Bar:** Shows available power-ups and their counts.
- **Game Stats:** Displays time, moves, matches, lives, score, and combo streak.
- **Game Board:** Cards are displayed in a grid; click/tap to flip.
- **Controls:** Restart and pause buttons.
- **Best Scores:** Shows your top results for each difficulty.
- **Game Over Screen:** Displays stats and reason for game end.
- **Combo Indicator:** Animated popup for streaks.
- **Pause Overlay:** Clearly indicates when the game is paused.

---

## Project Structure

```
mindMap/
  ├── css/
  │   └── style.css         # Main stylesheet (responsive, modern, mobile-friendly)
  ├── js/
  │   └── script.js         # Game logic, UI updates, power-ups, scoring
  └── index.html            # Main HTML file (UI layout, containers)
```

---

## How to Run

1. **Download or clone the repository.**
2. **Open `mindMap/index.html` in your web browser.**
   - No installation or build steps required.
   - Works offline (all assets are local).

---

## Customization

- **Change Card Symbols:** Edit the `easySymbols`, `mediumSymbols`, and `hardSymbols` arrays in `js/script.js` to use your own emoji or icons.
- **Adjust Game Settings:** Change lives, time limits, or power-up counts in `js/script.js`.
- **Style the Game:** Modify `css/style.css` for colors, layout, and animations.
- **Add New Features:** Extend the JavaScript to add new power-ups, achievements, or visual effects.

---

## Technical Details

- **Responsive Design:** Uses CSS Grid and Flexbox for layout, with media queries for mobile and tablet support.
- **Animations:** CSS transitions and keyframes for card flips, matches, penalties, and combo indicators.
- **Local Storage:** Best scores are saved in the browser for each difficulty.
- **Accessibility:** Large touch targets, clear color contrast, and keyboard shortcuts (P for pause, R for restart, H/F/S for power-ups).
- **Performance:** Efficient DOM updates and event handling for smooth gameplay.

---

## Credits

- Emoji icons from Unicode.
- UI inspired by modern web games.
- Developed by Gabriela Stefanova. 