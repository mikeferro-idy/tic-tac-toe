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
    const startBtn = document.querySelector('.start-button');
    const messageBox = document.querySelector('.message');
    const input = document.querySelectorAll('input');

    const startScreen = document.querySelector('.start-screen');
    const container = document.querySelector('.container');

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

    startBtn.addEventListener('click', (e) => {
        gameController.setPlayerNames(input[0].value,input[1].value);
        console.log(input[0].value,input[1].value);
        startScreen.style.display = 'none';
        container.style.display = 'grid';
        clearBtn.style.display = 'grid'; 

    })

    const updateBoard = () => {
        boxElements.forEach((box,index) => box.textContent = gameBoard.getBox(index));
    };
   
    const clearBoard = () => {
        gameBoard.reset();
        boxElements.forEach((box,index) => box.textContent = '');
        startScreen.style.display = 'grid';
        container.style.display = 'none';
        clearBtn.style.display = 'none';
        gameController.restart(); 

    }

    const displayMessage = (message) => messageBox.textContent = message;

    const clearMessage = () => messageBox.textContent = '';

    return {displayMessage, clearMessage};
})();


// Player Factory
const Player = (team) => {
    this.team = team;
    let name = String("player" + team);

    const setName = (newName) => name = newName;

    const getName = () => name;

    const getTeam = () => team;

    return{ getTeam, setName, getName };  
}

// Game Module

const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");

    let currentPlayer = playerX;
    let gameOver = false;

    const playRound = (index) => {
        if (gameBoard.getBox(index) || gameOver) return;
        gameBoard.setBox(index, currentPlayer.getTeam());
        if (checkWinner(index)) {
            displayWinner();
            gameOver = true;
        }
        if (checkTie()) {
            displayTie();
            gameOver = true;
        }
        currentPlayer.getTeam() === 'X' ? currentPlayer = playerO : currentPlayer = playerX;
       
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

    const setPlayerNames = (name1,name2) => {
        playerX.setName(name1);
        playerO.setName(name2);
    }
    
    const displayWinner = () => displayController.displayMessage(currentPlayer.getName() + " has Won! ");
        
    
    const displayTie = () => displayController.displayMessage("Tie");

    const restart = () => {
        currentPlayer = playerX;
        gameOver = false;
        displayController.clearMessage();
    }

    return {playRound, setPlayerNames, restart};
})();