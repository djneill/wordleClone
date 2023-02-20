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
function insertLetter (pressedKey) {
    if (nextLetter === 5) {
        return
    }

    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName('letterRow')[6 - guessesRemaining]
    let box = row.children[nextLetter]
    box.textContent = pressedKey
    box.classList.add('filledBox')
    currentGuess.push(pressedKey)
    nextLetter += 1
}

// Delete previous letter entered
function deleteLetter () {
    let row = document.getElementsByClassName('letterRow')[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove('filledBox')
    currentGuess.pop()
    nextLetter -= 1
}

// Check guess
function checkGuess() {
    let row = document.getElementsByClassName('letterRow')[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 5) {
        alert('Not enough letters!')
        return
    }

    if (!WORDS.includes(guessString)) {
        alert('Word no in list!')
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

            rightGuess[letterPosition] = '#'
        }

        let delay = 250 * i
        setTimeout(() => {
            // shade box
            box.style.backgroundColor = letterColor
            shadekeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        alert('You guessed right! Game Over!')
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1
        currentGuess = []
        nextLetter = 0

        if (guessesRemaining === 0) {
            alert(`You've run out of guesses! Game Over!`)
            alert(`The right word was: ${rightGuessString}`)
        }
    }
}