import { WORDS } from "./words.js"

const NUMBER_OF_GUESSES = 6
let guessesRemaining = NUMBER_OF_GUESSES
let currentGuess = []
let nextLetter = 0
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
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

initBoard()

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
  }

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
})

// Insert letters into gameboard
function insertLetter(pressedKey) {
    if (nextLetter === 5) {
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

// Delete previous letter entered
function deleteLetter() {
    let row = document.getElementsByClassName('letterRow')[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove('filledBox')
    currentGuess.pop()
    nextLetter -= 1
}

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

    