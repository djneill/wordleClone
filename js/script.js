import { WORDS } from "./words.js"

const NUMBER_OF_GUESSES = 6
let guessesRemaining = NUMBER_OF_GUESSES
let currentGuess = []
let nextLetter = 0
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
let numGamesPlayed = 0
let numGamesWon = 0
let numGamesLost = 0
let winPercentage = 0
let currentWinStreak = 0
console.log(rightGuessString)
  
// Build game board of five rows with five boxes
function initBoard() {
    let board = document.getElementById('gameBoard')

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement('div')
        row.className = 'letterRow'

        for (let j = 0; j < 5; j++) {
            let box = document.createElement('div')
            box.className = 'letterBox'
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}
updateStatsModal()

// Call retrieveGameState to update game state from localStorage
retrieveGameState()

// Retrieve game state from localStorage
function retrieveGameState() {
    const gameState = JSON.parse(localStorage.getItem("gameState"));

    if (gameState !== null) {
        guessesRemaining = gameState.guessesRemaining;
        currentGuess = gameState.currentGuess;
        nextLetter = gameState.nextLetter;
        rightGuessString = gameState.rightGuessString;
        winPercentage = gameState.winPercentage

        // Set the game board based on the retrieved state
        let rows = document.getElementsByClassName('letterRow')
        for (let i = 0; i < rows.length; i++) {
            let boxes = rows[i].getElementsByClassName('letterBox')
            for (let j = 0; j < boxes.length; j++) {
                let index = i * 5 + j
                let box = boxes[j]
                box.textContent = currentGuess[index] ? currentGuess[index] : ''
                if (currentGuess[index]) {
                    box.classList.add('filledBox')
                }
            }
        }
    }
}

// Save game state to localStorage
function saveGameState() {
    const gameState = {
        guessesRemaining: guessesRemaining,
        currentGuess: currentGuess,
        nextLetter: nextLetter,
        rightGuessString: rightGuessString,
        numGamesPlayed: numGamesPlayed,
        numGamesWon: numGamesWon,
        numGamesLost: numGamesLost,
        winPercentage: winPercentage,
        currentWinStreak: currentWinStreak
    };

    localStorage.setItem("gameState", JSON.stringify(gameState));
}

initBoard()
initHelpModal()
initStatsModal()
// Local storage 

// Start a new game reset guesses
function startNewGame() {
    guessesRemaining = NUMBER_OF_GUESSES
    currentGuess = []
    nextLetter = 0
    rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
    console.log(rightGuessString)
  
    // Reset game board
    let letterBoxes = document.querySelectorAll('.letterBox')
    for (let i = 0; i < letterBoxes.length; i++) {
      letterBoxes[i].textContent = ''
      letterBoxes[i].classList.remove('filledBox')
      letterBoxes[i].style.backgroundColor = 'white'
    }
  
    // Reset keyboard
    let keyboardButtons = document.querySelectorAll('.keyboardButton')
    for (let i = 0; i < keyboardButtons.length; i++) {
      keyboardButtons[i].style.backgroundColor = 'white'
    }

    // Update game statistics
    let guessString = currentGuess.join('')
    if (guessesRemaining === 0) {
        numGamesLost++
        currentWinStreak = 0
    } else if (guessString === rightGuessString) {
        numGamesWon++
        currentWinStreak++
    } else {
        currentWinStreak =0
    }

    numGamesPlayed++
    winPercentage = numGamesWon / numGamesPlayed

    window.localStorage.setItem("currentWinStreak", currentWinStreak);
    window.localStorage.setItem("numGamesWon", numGamesWon);
    window.localStorage.setItem("numGamesPlayed", numGamesPlayed);
    window.localStorage.setItem("guessesRemaining", guessesRemaining);
    window.localStorage.setItem("currentGuess", currentGuess);
    window.localStorage.setItem("nextLetter", nextLetter);

        
  

  // Remove game state from localStorage
  localStorage.removeItem("gameState");

  // Save initial game state to localStorage
  saveGameState(); 
}
retrieveGameState()

// Keyup event listener for letter keys
document.addEventListener('keyup', (e) => {
    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === 'Enter') {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
    saveGameState()
})

// Insert letters into gameboard
function insertLetter(pressedKey) {
    if (guessesRemaining === 0 || nextLetter === 5) {
        return
    }

    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName('letterRow')[6 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add('filledBox')
    currentGuess.push(pressedKey)
    nextLetter += 1
}
saveGameState()

// Delete previous letter entered
function deleteLetter() {
    let row = document.getElementsByClassName('letterRow')[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove('filledBox')
    currentGuess.pop()
    nextLetter -= 1
}
saveGameState()

// Check guess
// replace notification alerts with toastr

function checkGuess() {
    let row = document.getElementsByClassName("letterRow")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 5) {
        toastr.error("Not enough letters!")
        return
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Word not in list!")
        return
    }


    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]

        let letterPosition = rightGuess.indexOf(currentGuess[i])
        // is letter in the correct guess
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            // now, letter is definitely in word
            // if letter index and right guess index are the same
            // letter is in the right position 
            if (currentGuess[i] === rightGuess[i]) {
                // shade green 
                letterColor = 'green'
            } else {
                // shade box yellow
                letterColor = 'yellow'
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(() => {
            //flip box
            animateCSS(box, 'flipInX')
            //shade box
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        toastr.success("You guessed right! Game over!")
        guessesRemaining = 0

        setTimeout(() => {
            startNewGame()
        }, 2000)

        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.error("You've run out of guesses! Game over!")
            toastr.info(`The right word was: "${rightGuessString}"`)

            setTimeout(() => {
                startNewGame()
            }, 2000)
        }
    }
}
saveGameState()

// shade keyboard to make letters
function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboardButton")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}
saveGameState()

// On screen keyboard functionality

document.getElementById("keyboardCont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboardButton")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

// Animation for animateCSS

const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        // const node = document.querySelector(element);
        const node = element
        node.style.setProperty('--animate-duration', '0.3s');

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });

    function initHelpModal() {
        const modal = document.getElementById("help-modal");
    
        // Get the button that opens the modal
        const btn = document.getElementById("help");
    
        // Get the <span> element that closes the modal
        const span = document.getElementById("close-help");
    
        // When the user clicks on the button, open the modal
        btn.addEventListener("click", function () {
          modal.style.display = "block";
        });
    
        // When the user clicks on <span> (x), close the modal
        span.addEventListener("click", function () {
          modal.style.display = "none";
        });
    
        // When the user clicks anywhere outside of the modal, close it
        window.addEventListener("click", function (event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        });
      }

      function updateStatsModal() {
        const currentWinStreak = window.localStorage.getItem("currentWinStreak");
        const numGamesWon = window.localStorage.getItem("numGamesWon");
        const numGamesPlayed = window.localStorage.getItem("numGamesPlayed");
    
        document.getElementById("total-played").textContent = numGamesPlayed;
        document.getElementById("total-wins").textContent = numGamesWon;
        document.getElementById("current-streak").textContent = currentWinStreak;
    
        const winPercentage = Math.round((numGamesWon / numGamesPlayed) * 100) || 0;
        document.getElementById("win-pct").textContent = winPercentage;
      }
    
      function initStatsModal() {
        const modal = document.getElementById("stats-modal");
    
        // Get the button that opens the modal
        const btn = document.getElementById("stats");
    
        // Get the <span> element that closes the modal
        const span = document.getElementById("close-stats");
    
        // When the user clicks on the button, open the modal
        btn.addEventListener("click", function () {
          updateStatsModal();
          modal.style.display = "block";
        });
    
        // When the user clicks on <span> (x), close the modal
        span.addEventListener("click", function () {
          modal.style.display = "none";
        });
    
        // When the user clicks anywhere outside of the modal, close it
        window.addEventListener("click", function (event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        });
      }

      