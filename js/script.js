import { WORDS } from "./words.js"

const NUMBER_OF_GUESSES = 6
let guessesRemaining = NUMBER_OF_GUESSES
let currentGuess = []
let nextLetter = 0
let rightGuessString = WORDS[Math.floor(Math.random()*WORDS.length)]
console.log(rightGuessString)

// Build game board of five rows with five boxes
function initBoard() {
    let board = document.getElementById('gameBoard')

    for(let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement('div')
        row.className = 'letterRow'

        for(let j = 0; j <5; j++) {
            let box = document.createElement('div')
            box.className = 'letterBox'
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

initBoard()

// Keyup event listener for letter keys
document.addEventListener('keyup', (e) => {
    if(guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if(pressedKey === "Backspace" && nextLetter !==0) {
        deleteLetter()
        return
    }

    if (pressedKey === 'Enter') {
        checkGuress()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})