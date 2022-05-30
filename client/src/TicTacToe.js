import React, { useEffect, useState } from "react";
import GameAddressListContract from "./contracts/GameAddressList.json";
import TicTacToeContract from "./contracts/TicTacToe.json";

const TicTacToe = (props) => {
  const [web3, setWeb3] = useState(props.web3);
  const [accounts, setAccounts] = useState(props.accounts);
  const [gameAddress, setGame] = useState(props.gameAddress);
  const [board, setBoard] = useState([]);
  const [gameStatus, setGameStatus] = useState({});
  const [ticTacToeContract, setTicTacToeContract] = useState();

  useEffect(async () => {
    try{
      const ticTacToeContract = new web3.eth.Contract(TicTacToeContract.abi, gameAddress);
      setTicTacToeContract(ticTacToeContract); 
      
      updateBoard();
      updateGameStatus();

      ticTacToeContract.events.moveMade({}, async function(error, event){
        console.log(event);
        updateGameStatus();
        updateBoard();
  
      });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }, []);

  const updateBoard = async () => {
    const ticTacToeContract = new web3.eth.Contract(TicTacToeContract.abi, gameAddress);
    let temp = []
      for(let i = 0; i < 9; i++) {
        let a = await ticTacToeContract.methods.board(i).call();
        if(a == 1) {
          temp.push('O')
        } else if(a == 2){
          temp.push('X')
        } else {
          temp.push('')
        }
      }
    setBoard(temp);
  }

  const boardInfo = async (position) => {
    let value = await ticTacToeContract.methods.board(position).call();
    return value;
  }

  const move = async (position) => {
    await ticTacToeContract.methods.move(position).send({ from: accounts[0] });
  }

  const updateGameStatus = async () => {
    const ticTacToeContract = new web3.eth.Contract(TicTacToeContract.abi, gameAddress); 
    const player1 = await ticTacToeContract.methods.player1().call();
    const player2 = await ticTacToeContract.methods.player2().call();
    const whoseTurn = await ticTacToeContract.methods.whoseTurn().call();
    const gameOver = await ticTacToeContract.methods.gameOver().call();
    const winner = await ticTacToeContract.methods.winner().call();
    const betAmount = await ticTacToeContract.methods.betAmount().call();
    const status = {
      "player1" : player1,
      "player2" : player2,
      "whoseTurn" : whoseTurn,
      "gameOver" : gameOver,
      "winner" : winner,
      "betAmount" : betAmount,
    }
    setGameStatus(status);
  }

  const joinGame = async () => {
    const ticTacToeContract = new web3.eth.Contract(TicTacToeContract.abi, gameAddress); 
    await ticTacToeContract.methods.join().send({ from: accounts[0], value: web3.utils.toWei('5') });
  }

  return (
    <div>
      <p>1P (O) : {gameStatus.player1}</p>
      <p>2P (X) : {gameStatus.player2}</p>
      <p>차례 : {gameStatus.whoseTurn}</p>
      <p>gameover : {gameStatus.gameOver == true ? '게임 끝' : '게임 중'}</p>
      <p>승자 : {gameStatus.winner}</p>
      <p>참가비 : {gameStatus.betAmount / 10**18} 이더</p>
      <button onClick={joinGame}>참가하기</button>
      <button>클레임</button>
      <table>
        <tr id="tr1">
          <td onClick={() => {move(0)}}>{board[0]}</td>
          <td onClick={() => {move(1)}}>{board[1]}</td>
          <td onClick={() => {move(2)}}>{board[2]}</td>
        </tr>
        <tr id="tr2">
          <td onClick={() => {move(3)}}>{board[3]}</td>
          <td onClick={() => {move(4)}}>{board[4]}</td>
          <td onClick={() => {move(5)}}>{board[5]}</td>
        </tr>
        <tr id="tr3">
          <td onClick={() => {move(6)}}>{board[6]}</td>
          <td onClick={() => {move(7)}}>{board[7]}</td>
          <td onClick={() => {move(8)}}>{board[8]}</td>
        </tr>
      </table>
    </div>
  )

}

export default TicTacToe;