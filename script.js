// Gameboard Module

const gameBoard = (() => {
    let gameArray = new Array(9);

    const setBox = (index, team) => gameArray.splice(index,1,team);

    const getBox = (index) => gameArray[index];

    const reset = () => gameArray = new Array(9);

    const consolePrint = () => console.table(gameArray);

    return { setBox, getBox, reset, consolePrint };

})();

//Display Controller Module

const displayController = (() => {
    const boxElements = document.querySelectorAll('.box');
    const clearBtn = document.querySelector(".clearBtn");
    const messageBox = document.querySelector('.message');

    boxElements.forEach((box) => 
        box.addEventListener('click',(e) => {
        if (e.target.classList.contains('box')){
            let id = e.target.id;
            let index = Number(id.charAt(id.length-1));
            gameController.playRound(index);
            updateBoard();
            }
        })
    )
    
    clearBtn.addEventListener('click', () => {  clearBoard();});

    const updateBoard = () => {
        boxElements.forEach((box,index) => box.textContent = gameBoard.getBox(index));
    };
   
    const clearBoard = () => {
        gameBoard.reset();
        boxElements.forEach((box,index) => box.textContent = '');        
    }

    const displayMessage = (message) => messageBox.textContent = message;

    const clearMessage = () => messageBox.textContent = '';

    return {displayMessage, clearMessage};
})();


// Player Factory
const Player = (team) => {
    this.team = team;

    const getTeam = () => team;

    return{ getTeam };  
}

// Game Module

const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");

    let currentPlayer = playerX;

    const playRound = (index) => {
        if (gameBoard.getBox(index)) return;
        gameBoard.setBox(index, currentPlayer.getTeam());
        checkWinner(index);
        console.log(checkTie());
        currentPlayer.getTeam() === 'X' ? currentPlayer = playerO : currentPlayer = playerX
       
    }

    const checkTie = () => {
        for (let i = 0; i < 9; i++){
            if (!gameBoard.getBox(i))
                return false;
        }
        return true;
    }

    const checkWinner = (index) => {
        const winConditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
        ];

        return(winConditions.filter((combinations) => combinations.includes(index))
            .some((possibleCombination)=> 
                possibleCombination.every((index)=> gameBoard.getBox(index) == currentPlayer.getTeam())));
    };
    
    const displayWinner = () => {

    }

    return {playRound};
})();