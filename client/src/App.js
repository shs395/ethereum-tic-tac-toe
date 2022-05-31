import React, { useEffect, useState } from "react";
import GameAddressListContract from "./contracts/GameAddressList.json";
import TicTacToeContract from "./contracts/TicTacToe.json";
import GameItemContract from "./contracts/GameItem.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import TicTacToe from "./TicTacToe.js"
// import Pricing from './Pricing';


const App = () => {
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [networkId , setNetworkId] = useState();
  const [test, setTest] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [gameItemJson, setGameItemJson] = useState([]);

  // contracts 
  const [gameAddressListContract, setGameAddressListContract] = useState();

  // data
  const [gameAddressList, setGameAddressList] = useState([]);


  useEffect(() => {
    try {
      InitializeInfo();
      console.log('good')
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }, [])


  const InitializeInfo = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();

    setWeb3(web3);
    setAccounts(accounts);
    setNetworkId(networkId);

    const gameAddressListDeployedNetwork = GameAddressListContract.networks[networkId];
    let gameAddressListContract = new web3.eth.Contract(
      GameAddressListContract.abi,
      gameAddressListDeployedNetwork && gameAddressListDeployedNetwork.address,
    )
    setGameAddressListContract(gameAddressListContract);

    let gameCount = await gameAddressListContract.methods.gameCount().call();
    let array = [];
    for (let i = 0; i < gameCount; i++) {
      let item = await gameAddressListContract.methods.gameAddressList(i).call();
      array.push(item);
    }

    setGameAddressList(array);
    
    gameAddressListContract.events.gameAdded({}, async function(error, event){
      console.log(event);

      let gameCount = await gameAddressListContract.methods.gameCount().call();
      let array = [];
      for (let i = 0; i < gameCount; i++) {
        let item = await gameAddressListContract.methods.gameAddressList(i).call();
        array.push(item);
      }

      setGameAddressList(array);

    });

    const gameItemDeployedNetwork = GameItemContract.networks[networkId];
    let gameItemContract = new web3.eth.Contract(
      GameItemContract.abi,
      gameItemDeployedNetwork && gameItemDeployedNetwork.address,
    )
    let temp = [];
    for(let i = 1; i <= 7; i++) {
      let data = await gameItemContract.methods.uri(i).call();
      let myQuantity = await gameItemContract.methods.balanceOf(
        accounts[0],
        i
      ).call()
      console.log(myQuantity)
      // temp.push(data);
      let response = await fetch(data);
      let responseJson = await response.json();
      let tempJson = {
        "json": responseJson,
        "myQuantity": myQuantity,
      }
      temp.push(tempJson)
    }
    setGameItemJson(temp);

    
  }
  const getGameAddressList = async () => {
    console.log('함수 실행 : getGameAddressList')
    // const web3 = await getWeb3();
    const gameAddressListDeployedNetwork = GameAddressListContract.networks[networkId];
    let gameAddressListContract = new web3.eth.Contract(
      GameAddressListContract.abi,
      gameAddressListDeployedNetwork && gameAddressListDeployedNetwork.address,
    )
    console.log(gameAddressListContract)
    let gameCount = await gameAddressListContract.methods.gameCount().call();
    let array = [];
    for (let i = 0; i < gameCount; i++) {
      let item = await gameAddressListContract.methods.gameAddressList(i).call();
      array.push(item);
    }
    console.log(array);
    setGameAddressList(array);
  }

  const makeGame = async () => {
    console.log('함수 실행 : makeGame')
    const ticTacToeContract = new web3.eth.Contract(TicTacToeContract.abi);
    ticTacToeContract.deploy({
      data: TicTacToeContract.bytecode,
      // arguments: [100]
    }).send({
      from: accounts[0],value: web3.utils.toWei(betAmount)
    }, function(error, tx) {

    }).on('error', function(error){  })
    .on('transactionHash', function(transactionHash){ })
    .on('receipt', function(receipt){
      //  console.log(receipt.contractAddress) // contains the new contract address
    })
    .on('confirmation', function(confirmationNumber, receipt){  })
    .then(function(newContractInstance){
        // console.log(newContractInstance.options.address)
        gameAddressListContract.methods.addGame(newContractInstance.options.address).send({ from: accounts[0] });
    });
  }

  const listItems = gameAddressList.map((gameAddress) => 
    <div>
      <div>게임 컨트랙트 주소 : {gameAddress}</div>
      <TicTacToe
        web3={web3}
        accounts={accounts}
        gameAddress={gameAddress}
      />
    </div>
  )
  const getGameItemJsonList = async () => {
    const gameItemDeployedNetwork = GameItemContract.networks[networkId];
    let gameItemContract = new web3.eth.Contract(
      GameItemContract.abi,
      gameItemDeployedNetwork && gameItemDeployedNetwork.address,
    )
    let temp = [];
    for(let i = 1; i <= 7; i++) {
      let data = await gameItemContract.methods.uri(i).call();
      let myQuantity = await gameItemContract.methods.balanceOf(
        accounts[0],
        i
      ).call()
      console.log(myQuantity)
      // temp.push(data);
      let response = await fetch(data);
      let responseJson = await response.json();
      let tempJson = {
        "json": responseJson,
        "myQuantity": myQuantity,
      }
      temp.push(tempJson)
    }
    setGameItemJson(temp);
  }

  const gameItemList = gameItemJson.map((item) => 

    <div className="gameItem">
      <img className="gameItemImg" src={item.json.image}></img>
      <p>{item.json.name}</p>
      <p>{item.json.description}</p>
      <p>보유 수량 : {item.myQuantity}</p> 
      <button>구매하기</button> 
    </div>
   
  )


  const testf = async () => {
    console.log("test")
  }

  return(
    <div className="App">
      <h1>eth-tic-tac-toe</h1>
      <div>현재 지갑 주소 : {accounts}</div> 
      <div>
        betAmount : 
        <input 
          type="number"
          value={betAmount}
          onChange={(event) => setBetAmount(event.target.value)}
        />
        ether
        <button onClick={makeGame}>방 만들기</button>
        <button onClick={getGameAddressList}>새로고침</button>
        <button onClick={getGameItemJsonList}>테스트</button>
      </div>
      <hr></hr>
      <div className="shop">
        <p>상점</p>
        {gameItemList}
      </div>
      <hr></hr>
      <div className="gameList">
        <p>게임리스트</p>
        <hr></hr>
        {listItems}
      </div>
    </div>
  )
}

export default App;









