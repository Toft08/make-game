# make-your-game
A single-player game built using plain JavaScript and the DOM, without frameworks or canvas. The goal is to ensure smooth 60 FPS animations while maintaining optimal performance.

This project was created as a learning challenge to understand browser rendering, optimize performance, and build a game engine from scratch. By avoiding external libraries, we focus on core JavaScript and efficient DOM manipulation.

## How to Run
Clone the repository:
```
git clone https://github.com/Toft08/make-game.git
cd make-game
```
Start a local server (using Python’s built-in HTTP server):
```
python3 -m http.server
```
Open the game in your browser:

Go to http://localhost:8000 in your web browser.
The game should now be running.

## Features
* Runs at 60 FPS with no frame drops
* Uses requestAnimationFrame for rendering
* Smooth keyboard controls without jank or stutter
* Pause menu with:
    * Continue
    * Restart
* Scoreboard displaying:
    * Timer (countdown or elapsed time)
    * Player score
    * Lives remaining

## Project Structure
```
make-game/
├── board.js
├── controls.js
├── game.js
├── index.html
├── README.md
├── style.css
├── tetrominos.js
├── ui.js
├── utils.js
├── images/
│   ├── controls.jpg
│   └── favicon.ico
```