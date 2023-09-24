// IMPORTS
import { GridSquare, GridManager } from "./board-manage-classes.js"
import { createGridSquareHTML } from "./renderBoard/createGridSquareHTML.js"
import { renderBoard, whichBoard } from "./renderBoard/renderBoard.js"
import { GameTurns } from "./turnManager.js"



// VARIABLES
//flag to prevent multiple clicks per turn
let clickFlag = true;

//flag to ensure user has turn before clicking next btn
let shipSet = false;

// FUNCTIONS


// SELECTORS
const gameBoard = document.querySelector('#board')
const titleNode = document.querySelector('.navbar-text')
const nextTurnBtn = document.querySelector('#next-turn-btn')

// STATE

//create boards for player 1 and player 2 seperately
const player1Board = new GridManager('Player 1')
player1Board.setupBoard()

const player2Board = new GridManager('Player 2')
player2Board.setupBoard()


// game turns
const turnManager = new GameTurns()
console.log(turnManager)


// ACTIONS


//create boards to play
const gameBoardsObj = {
    player1Board: player1Board,
    player2Board: player2Board
}

//render the player1Board for game start
//create object of parameters to pass in to function as same each call

const renderBoardParams = {
    boards: gameBoardsObj,
    boardNode: gameBoard,
    titleNode: titleNode,
    turnManager: turnManager,
    HTMLfn: createGridSquareHTML
}


renderBoard(renderBoardParams)


// BINDINGS

// this currently allows for many clicks per turn - limit to selection of a single square???
gameBoard.addEventListener('click', (event) => {

    //limit selection of one square using click flag - set to false after a click and reset by turn button.
    console.log(clickFlag)
    if (clickFlag) {
        //find square clicked
        const id = event.target.dataset.id

        //update properties of grid square

        //Find correct board player 1 or player 2 depending on game turns
        const board = whichBoard(turnManager, gameBoardsObj)
        //make ships when user clicks a tile before turn 6
        if (turnManager.turn < 6) {
            board.makeShipById(id)
        } else {
            //select square after turn 6 to show hit or miss
            board.selectGridSquareById(id)
        }

        //re-render board to show ship
        renderBoard(renderBoardParams)

        //set flags to allow for next turn BTN to be pressed
        clickFlag = false;
        shipSet = true;
    } else {
        console.log('location selected')
    }
})

//button to move to next turn
nextTurnBtn.addEventListener('click', () => {
    if (shipSet) {
        turnManager.turnComplete()
        clickFlag = true;
        renderBoard(renderBoardParams)
    } else {
        console.log("need to set ship")
    }

    //reset flag
    shipSet = false;
})

//this works but need to be confirmed by a click of a button rather than by instant click.

//initial clicks add a token blue marker then call make ship by ID on the eventual button press