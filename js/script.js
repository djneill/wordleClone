import { WORDS } from "./words"

const NUMBER_OF_GUESSES = 6
let guessesRemaining = NUMBER_OF_GUESSES
let currentGuess = []
let nextLetter = 0
let rightGuessString = WORDS[Math.floor(Math.random()*WORDS.lenght)]
console.log(rightGuessString)

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