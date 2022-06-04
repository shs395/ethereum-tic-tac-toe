// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicTacToe {
    address public player1;
    address public player2;
    address public whoseTurn;
    address public winner;
    bool public gameOver;
    uint256 public betAmount;
    // 3 X 3 tic-tac-toe game board
    // 0 | 1 | 2
    // 3 | 4 | 5
    // 6 | 7 | 8
    uint8[9] public board;
    uint[][] winCondition = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]  
    ];

    event gameStart();
    event moveMade();
    event gameEnd();


    constructor() payable {
        player1 = msg.sender;
        betAmount = msg.value;
    }

    modifier playerOnly() {
        require(msg.sender == whoseTurn);
        _;
    }

    function join() public payable {
        require(msg.value == betAmount);

        player2 = msg.sender;
        whoseTurn = player1;
        emit gameStart();
    }

    function move(uint place) playerOnly public {
        require(!gameOver, "Game end.");
        if(msg.sender == player1) {
            board[place] = 1;
            whoseTurn = player2;
        } else {
            board[place] = 2;
            whoseTurn = player1;
        }
        checkWinner();
        emit moveMade();
    }

    function checkWinner() public {
        for(uint8 i = 0; i < 8; i++) {
            uint[] memory temp = winCondition[i];
            if(board[temp[0]] != 0 && board[temp[0]] == board[temp[1]] && board[temp[0]] == board[temp[2]]) {
                if(board[temp[0]] == 1) {
                    gameOver = true;
                    winner = player1;
                    whoseTurn = address(0);
                    emit gameEnd();
                } else {
                    gameOver = true;
                    winner = player2;
                    whoseTurn = address(0);
                    emit gameEnd();
                }
            }
        }
    }

    function claim() public {
        require(gameOver);
        require(msg.sender == winner);
        payable(msg.sender).transfer(address(this).balance);
    }
}