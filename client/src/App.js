import React, { useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import { Button, Tab, TabList, Card, Illustration, Table, Avatar, Tag, LinkTo, Typography, Input, Information, Row} from 'web3uikit';
import GameAddressListContract from "./contracts/GameAddressList.json";
import TicTacToeContract from "./contracts/TicTacToe.json";
import GameItemContract from "./contracts/GameItem.json";
const App = () => {

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [networkId , setNetworkId] = useState(null);
  const [ethBalance, setEthBalance] = useState(0);
  const [gameAddressListContract, setGameAddressListContract] = useState();
  const [gameAddressList, setGameAddressList] = useState();
  const [gameList, setGameList] = useState();
  const [gameTable, setGameTable] = useState([]);
  const [currentGameAddress, setCurrentGameAddres] = useState('');
  const [currentGameStatus, setCurrentGameStatus] = useState({});
  const [currentGameBoard, setCurrentGameBoard] = useState([]);
  const [ticTacToeContract, setTicTacToeContract] = useState();
  const [betAmount, setBetAmount] = useState(0);
  const [gameItemJson, setGameItemJson] = useState([]);
  const [myGameItem, setMyGameItem] = useState([]);
  const [mainItem, setMainItem] = useState();

  useEffect(() => {
    try {
      InitializeInfo();
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }, [])

  useEffect(() => {
    console.log(currentGameAddress);
    console.log('************************')
    console.log(gameList)
    if(currentGameAddress != '' && gameList != undefined) {
      for(let i = 0; i < gameList.length; i++) {
        console.log(gameList[i])
        if(gameList[i].gameAddress == currentGameAddress) {
          console.log(gameList[i].status);
          console.log(gameList[i].board)
          setCurrentGameStatus(gameList[i].status)
          setCurrentGameBoard(gameList[i].board)
        }
      }
    }
    
    // if(gameList != undefined && ga != '') {
      
    // }
    
  },[currentGameAddress, gameList, gameTable])

  const InitializeInfo = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const ethBalance = await web3.eth.getBalance(accounts[0]);

    setWeb3(web3);
    setAccounts(accounts);
    setNetworkId(networkId);
    setEthBalance(ethBalance);
    const tempGameAddressList = await getGameAddressList(web3, networkId);
    const tempGameList = await getGameList(web3, networkId, tempGameAddressList);
    console.log(tempGameAddressList);
    console.log(tempGameList)
    console.log(gameList)
    let temp = [];
    
    if(tempGameList != null) {
      tempGameList.forEach((game) => {
        temp.push(
          [
            <p id="game-contract-address" onClick={() => {selectGame(game.gameAddress)}}>{game.gameAddress.substr(0, 5)}...{game.gameAddress.substr(-5)}</p>,
            <p>{game.status.player1.substr(0, 5)}...{game.status.player1.substr(-4)}</p>,
            <p>{game.status.player2.substr(0, 5)}...{game.status.player2.substr(-4)}</p>,
            <p>{game.status.betAmount / 10**18 * 2} ETH / {game.status.betAmount / 10**18} ETH</p>,
            game.status.gameOver == true ? <p><Tag color="red" text="Game End" /></p> : game.status.player2 == 0 ? <p><Tag color="green" text="waiting for game" /></p> : <p><Tag color="blue" text="in game" /></p>,
            game.status.winner == 0 ? <p></p> : <p>{game.status.winner.substr(0, 5)}...{game.status.winner.substr(-4)}</p>,
          ]
        )
        console.log(temp)
        
      })
      setGameTable(temp);
    }
    

    const gameAddressListDeployedNetwork = GameAddressListContract.networks[networkId];
    const gameAddressListContract = new web3.eth.Contract(
      GameAddressListContract.abi,
      gameAddressListDeployedNetwork && gameAddressListDeployedNetwork.address,
    )
    gameAddressListContract.events.gameAdded({}, async function(error, event){
      console.log(event);

      const tempGameAddressList = await getGameAddressList(web3, networkId);
      const tempGameList = await getGameList(web3, networkId, tempGameAddressList);
      console.log(tempGameAddressList);
      console.log(tempGameList)
      console.log(gameList)
      let temp = [];
      
      tempGameList.forEach((game) => {
        temp.push(
          [
            <p id="game-contract-address" onClick={() => {selectGame(game.gameAddress)}}>{game.gameAddress.substr(0, 5)}...{game.gameAddress.substr(-5)}</p>,
            <p>{game.status.player1.substr(0, 5)}...{game.status.player1.substr(-4)}</p>,
            <p>{game.status.player2.substr(0, 5)}...{game.status.player2.substr(-4)}</p>,
            <p>{game.status.betAmount / 10**18 * 2} ETH / {game.status.betAmount / 10**18} ETH</p>,
            game.status.gameOver == true ? <p><Tag color="red" text="Game End" /></p> : game.status.player2 == 0 ? <p><Tag color="green" text="waiting for game" /></p> : <p><Tag color="blue" text="in game" /></p>,
            game.status.winner == 0 ? <p></p> : <p>{game.status.winner.substr(0, 5)}...{game.status.winner.substr(-4)}</p>,
          ]
        )
        console.log(temp)
        
      })
      setGameTable(temp);
    });

    const gameItemDeployedNetwork = GameItemContract.networks[networkId];
    let gameItemContract = new web3.eth.Contract(
      GameItemContract.abi,
      gameItemDeployedNetwork && gameItemDeployedNetwork.address,
    )
    let gameItemTemp = [];
    let myGameItemTemp = [];
    let isMainItemSet = false;
    for(let i = 1; i <= 7; i++) {
      
      let data = await gameItemContract.methods.uri(i).call();
      let myQuantity = await gameItemContract.methods.balanceOf(
        accounts[0],
        i
      ).call();
      let tempIndex = i - 1;
      let minted = await gameItemContract.methods.minted(tempIndex).call();
      // console.log(minted)
      let supplies = await gameItemContract.methods.supplies(tempIndex).call();
      console.log(myQuantity)
      // console.log(supplies)
      // temp.push(data);
      let response = await fetch(data);
      console.log(response)
      let responseJson = await response.json();
      console.log(responseJson)
      let tempJson = {
        "tokenId": i,
        "json": responseJson,
        "myQuantity": myQuantity,
        "minted": minted,
        "supplies": supplies
      }
      console.log(tempJson)
      gameItemTemp.push(tempJson)
      if(myQuantity > 0) {
        let tempJson = {
          "tokenId": i,
          "json": responseJson,
          "myQuantity": myQuantity,
        }
        myGameItemTemp.push(tempJson);
        if(isMainItemSet == false) {
          setMainItem(tempJson);
          isMainItemSet = !isMainItemSet;
        }
        
        console.log(tempJson)
      }
      if(i == 7) {
        console.log(gameItemTemp)
        setGameItemJson(gameItemTemp);
        setMyGameItem(myGameItemTemp);
      }
    }
    
    
  }

  const getGameAddressList = async (web3, networkId) => {
    const gameAddressListDeployedNetwork = GameAddressListContract.networks[networkId];
    const gameAddressListContract = new web3.eth.Contract(
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
    console.log(array)
    setGameAddressList(array)
    return array;
  }

  const getGameList = async (web3, networkId, gameAddressList) => {
    setCurrentGameAddres(gameAddressList[0]);
    const tempGameList = [];
    for (let i = 0; i < gameAddressList.length; i++ ) { 
      const ticTacToeContract = new web3.eth.Contract(TicTacToeContract.abi, gameAddressList[i]);
      
      const board = await getGameBoard(web3, gameAddressList[i]);
      const status = await getGameStatus(web3, gameAddressList[i]);
      
      // const player1 = await ticTacToeContract.methods.player1().call();
      // const player2 = await ticTacToeContract.methods.player2().call();
      // const whoseTurn = await ticTacToeContract.methods.whoseTurn().call();
      // const gameOver = await ticTacToeContract.methods.gameOver().call();
      // const winner = await ticTacToeContract.methods.winner().call();
      // const betAmount = await ticTacToeContract.methods.betAmount().call();
      // const status = {
      //   "player1" : player1,
      //   "player2" : player2,
      //   "whoseTurn" : whoseTurn,
      //   "gameOver" : gameOver,
      //   "winner" : winner,
      //   "betAmount" : betAmount,
      // }
      tempGameList.push(
        {
          "gameAddress": gameAddressList[i],
          "status": status,
          "board": board,
        }
      );
      console.log(tempGameList);
      console.log(gameAddressList.length)
      ticTacToeContract.events.allEvents({}, async function(error, event){
        console.log(event);
        // const status = await getGameStatus(web3, gameAddressList[i]);
        // const board = await getGameBoard(web3, gameAddressList[i]);
        console.log("dsflakdsjflkadsjfklasdfdsaf" + gameAddressList[i]);
        updateGameInfo(web3, gameAddressList[i], tempGameList);
        // currentGameStatus(status);
        // currentGameBoard(board);
      }); 
      if(i == gameAddressList.length - 1) {
        
        setGameList(tempGameList);
        return tempGameList;
      }
      
    } 
    
  }
  const updateGameInfo = async (web3, address, tempGameList) => {
    // let tempGameList = gameList;
    console.log(gameList);
    console.log(tempGameList);
    const status = await getGameStatus(web3, address);
    console.log(status)
    const board = await getGameBoard(web3, address);
    for(let i = 0; i < tempGameList.length; i++) {
      if(tempGameList[i].gameAddress == address) {
        tempGameList[i].status = status;
        tempGameList[i].board = board;
        setGameList(tempGameList);
      }
    }
    console.log(tempGameList);
    let temp = [];
    
    tempGameList.forEach((game) => {
      temp.push(
        [
          <p id="game-contract-address" onClick={() => {selectGame(game.gameAddress)}}>{game.gameAddress.substr(0, 5)}...{game.gameAddress.substr(-5)}</p>,
          <p>{game.status.player1.substr(0, 5)}...{game.status.player1.substr(-4)}</p>,
          <p>{game.status.player2.substr(0, 5)}...{game.status.player2.substr(-4)}</p>,
          <p>{game.status.betAmount / 10**18 * 2} ETH / {game.status.betAmount / 10**18} ETH</p>,
          game.status.gameOver == true ? <p><Tag color="red" text="Game End" /></p> : game.status.player2 == 0 ? <p><Tag color="green" text="waiting for game" /></p> : <p><Tag color="blue" text="in game" /></p>,
          game.status.winner == 0 ? <p></p> : <p>{game.status.winner.substr(0, 5)}...{game.status.winner.substr(-4)}</p>,
        ]
      )
      console.log(temp)
      
    })
    setGameTable(temp);

  }
  const getGameStatus = async (web3, gameAddress) => {
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
    return status;
  }

  const getGameBoard = async (web3, gameAddress) => {
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
    return temp;
  }

  const selectGame = (selectGame) => {
    setCurrentGameAddres(selectGame)
  }

  const makeGame = async() => {
    const ticTacToeContract = new web3.eth.Contract(TicTacToeContract.abi);
    ticTacToeContract.deploy({
      data: TicTacToeContract.bytecode,
      // arguments: [100]
    }).send({
      from: accounts[0],
      value: web3.utils.toWei(betAmount)
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

  const joinGame = async (tempBetAmount, currentGameAddress) => {
    const ticTacToeContract = new web3.eth.Contract(TicTacToeContract.abi, currentGameAddress);
    const betAmount = tempBetAmount / 10**18;
    await ticTacToeContract.methods.join().send({ from: accounts[0], value: web3.utils.toWei(betAmount.toString()) });
  }

  const move = async (position, currentGameAddress) => {
    const ticTacToeContract = new web3.eth.Contract(TicTacToeContract.abi, currentGameAddress); 
    await ticTacToeContract.methods.move(position).send({ from: accounts[0] });
    
  }

  const claim = async (currentGameAddress) => {
    const ticTacToeContract = new web3.eth.Contract(TicTacToeContract.abi, currentGameAddress); 
    await ticTacToeContract.methods.claim().send({ from: accounts[0] });
    

  }

  const mint = async () => {
    const gameItemDeployedNetwork = GameItemContract.networks[networkId];
    let gameItemContract = new web3.eth.Contract(
      GameItemContract.abi,
      gameItemDeployedNetwork && gameItemDeployedNetwork.address,
    )
    gameItemContract.methods.mint('1', '1').send({from: accounts[0], value: web3.utils.toWei('0.005')});
  }

  const buyGameItem = async (tokenId) => {
    const gameItemDeployedNetwork = GameItemContract.networks[networkId];
    let gameItemContract = new web3.eth.Contract(
      GameItemContract.abi,
      gameItemDeployedNetwork && gameItemDeployedNetwork.address,
    )
    gameItemContract.methods.mint(tokenId, 1).send({from: accounts[0], value: web3.utils.toWei('0.005')});
  }

  const gameItemList = gameItemJson.map((item) => 
    <div
      id="shop"
      style={{
        width: '250px'
      }}
      key={item.tokenId}
    >
      <Card
        id="card"
        onClick={function noRefCheck(){}}
        setIsSelected={function noRefCheck(){}}
      >
        {item.json.name} - {item.json.description}
        <div>
          <img className="gameItemImg" src={item.json.image}></img>
        </div>
        <p>own : {item.myQuantity}</p>
        <p>{item.supplies - item.minted} / {item.supplies} left</p>
        <p>price: 0.05 ETH</p>
        <Button
          id="test-button-primary"
          onClick={() => { buyGameItem(item.tokenId)}}
          isFullWidth
          text="Buy now"
          theme="primary"
          type="button"
        />
      </Card>
    </div>
  )

  const myGameItemList = myGameItem.map((item) => 
    <div
      id="shop"
      style={{
        width: '250px'
      }}
      key={item.tokenId}
    >
      <Card
        id="card"
        onClick={function noRefCheck(){}}
        setIsSelected={function noRefCheck(){}}
      >
        {item.json.name} - {item.json.description}
        <div>
          <img className="gameItemImg" src={item.json.image}></img>
        </div>
        <p>own : {item.myQuantity}</p>
        <Button
          id="test-button-primary"
          onClick={() => { setMainItem(item)}}
          isFullWidth
          text="Set as Main Item"
          theme="primary"
          type="button"
        />
      </Card>
    </div>
  )



  const test = async () => {
    // console.log(gameAddressList);
    // console.log(gameList);
    // console.log(gameTable);
    // console.log(currentGameAddress);
    // let a = gameTable.push(['f','d','d','d','a'])
    // setGameTable(a)
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
  }
  

  return( 
    <div className="App">
      <div>
        <Typography id="typo" variant="h1">Ethereum-tic-tac-toe</Typography>
        <Typography id="sub-typo" variant="h5">Only available on Ropsten network</Typography>
        {/* <button onClick={test}>test</button> */}
        <Row
          alignItems="center"
          justifyItems="center"
          lg={24}
          md={24}
          // sm={16}
          // xs={8}
        >

          <Row.Col
            breakpointsConfig={{
              lg: 12,
              md: 12,
              sm: 8,
              xs: 4
            }}
            span={12}
          >
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                // height: '50px',
                justifyContent: 'center',
                // width: '100%',
                margin: '20px'
              }}
            >
              <Information
                information={ accounts == null  ? '' : accounts[0].substr(0,5) + '...' + accounts[0].substr(-4) }
                topic="Your Address"
              />
            </div>
          </Row.Col>
          <Row.Col
            breakpointsConfig={{
              lg: 12,
              md: 12,
              sm: 8,
              xs: 4
            }}
            span={12}
          >
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                // height: '50px',
                justifyContent: 'center',
                // width: '100%',
                margin: '20px'
              }}
            >
              <Information
                information={ ethBalance == null  ? '' : `${ethBalance / 10**18} ETH` }
                topic="Your ETH Balance"
              />

            </div>
          </Row.Col>
        </Row>
        
      </div>
      <TabList
        defaultActiveKey={1}
        tabStyle="bulbUnion"
        className="TabList"
      > 
        <Tab
          tabKey={1}
          tabName="Game"
          className="Tab"
        >
          <div>
            <div id="make-game-outer">
              <Input
                label="Bet Amount"
                name="Test text Input"
                onBlur={function noRefCheck(){}}
                onChange={(e) => {setBetAmount(e.target.value)}}
                prefixIcon="eth"
                iconPosition="end"
                id="make-game-input"
              />
              <Button
                id="make-game-button"
                onClick={makeGame}
                size="large"
                text="Make Game"
                theme="primary"
                type="button"
              />
            </div>
            
            <Table
              // columnsConfig="80px 3fr 2fr 2fr 80px"
              columnsConfig="1fr 1fr 1fr 1fr 1fr 1fr"
              data={gameTable}
              header={[
                <span>Game Contract Address</span>,
                <span>Host (Player1)</span>,
                <span>Player2</span>,
                <span>Prize / betAmount</span>,
                <span>GameStatus</span>,
                <span>Winner</span>,
              ]}
              isColumnSortable={[
                false,
                true,
                false,
                false
              ]}
              maxPages={3}
              onPageNumberChanged={function noRefCheck(){}}
              pageSize={5}
            />
            <Typography variant="h4">Current Game : {currentGameAddress}</Typography>
            
            <Row
              alignItems="center"
              justifyItems="center"
              lg={24}
              md={24}
              // sm={16}
              // xs={8}
            >

              <Row.Col
                breakpointsConfig={{
                  lg: 12,
                  md: 12,
                  sm: 8,
                  xs: 4
                }}
                span={12}
              >
                <div
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    // height: '50px',
                    justifyContent: 'center',
                    // width: '100%',
                    margin: '20px'
                  }}
                >
                  <div>
                    {(mainItem == null) ? 
                    <table>
                      <tr id="tr1">
                        <td onClick={() => {move(0, currentGameAddress)}}>{currentGameBoard[0]}</td>
                        <td onClick={() => {move(1, currentGameAddress)}}>{currentGameBoard[1]}</td>
                        <td onClick={() => {move(2, currentGameAddress)}}>{currentGameBoard[2]}</td>
                      </tr>
                      <tr id="tr2">
                        <td onClick={() => {move(3, currentGameAddress)}}>{currentGameBoard[3]}</td>
                        <td onClick={() => {move(4, currentGameAddress)}}>{currentGameBoard[4]}</td>
                        <td onClick={() => {move(5, currentGameAddress)}}>{currentGameBoard[5]}</td>
                      </tr>
                      <tr id="tr3">
                        <td onClick={() => {move(6, currentGameAddress)}}>{currentGameBoard[6]}</td>
                        <td onClick={() => {move(7, currentGameAddress)}}>{currentGameBoard[7]}</td>
                        <td onClick={() => {move(8, currentGameAddress)}}>{currentGameBoard[8]}</td>
                      </tr>
                    </table> : 
                    <table style={{color: mainItem.json.name.toLowerCase()}}>
                      <tr id="tr1">
                        <td onClick={() => {move(0, currentGameAddress)}}>{currentGameBoard[0]}</td>
                        <td onClick={() => {move(1, currentGameAddress)}}>{currentGameBoard[1]}</td>
                        <td onClick={() => {move(2, currentGameAddress)}}>{currentGameBoard[2]}</td>
                      </tr>
                      <tr id="tr2">
                        <td onClick={() => {move(3, currentGameAddress)}}>{currentGameBoard[3]}</td>
                        <td onClick={() => {move(4, currentGameAddress)}}>{currentGameBoard[4]}</td>
                        <td onClick={() => {move(5, currentGameAddress)}}>{currentGameBoard[5]}</td>
                      </tr>
                      <tr id="tr3">
                        <td onClick={() => {move(6, currentGameAddress)}}>{currentGameBoard[6]}</td>
                        <td onClick={() => {move(7, currentGameAddress)}}>{currentGameBoard[7]}</td>
                        <td onClick={() => {move(8, currentGameAddress)}}>{currentGameBoard[8]}</td>
                      </tr>
                    </table>}
                    <div id="game-button-outer">
                      {
                        (currentGameStatus.player2 != 0) ?  
                        <Button
                          id="test-button-primary"
                          onClick={() => {
                          }}
                          size="large"
                          text="Join Game"
                          theme="primary"
                          type="button"
                          disabled="true"
                        /> :
                        <Button
                          id="test-button-primary"
                          onClick={() => {
                            joinGame(currentGameStatus.betAmount, currentGameAddress)
                          }}
                          size="large"
                          text="Join Game"
                          theme="primary"
                          type="button"
                        /> 
                      } 
                      {
                        (currentGameStatus.gameOver == true && currentGameStatus.winner == accounts[0]) ? 
                        <Button
                          id="test-button-primary"
                          onClick={() => {
                            claim(currentGameAddress)
                          }}
                          size="large"
                          text="Claim"
                          theme="primary"
                          type="button"
                        /> :
                        <Button
                          id="test-button-primary"
                          onClick={() => {
                            claim(currentGameAddress)
                          }}
                          size="large"
                          text="Claim"
                          theme="primary"
                          type="button"
                          disabled="true"
                        />

                      }
                    </div>
                    
                  </div>
                </div>
              </Row.Col>
              <Row.Col
                breakpointsConfig={{
                  lg: 12,
                  md: 12,
                  sm: 8,
                  xs: 4
                }}
                span={12}
              >
                <div
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    // height: '50px',
                    justifyContent: 'center',
                    // width: '100%',
                  }}
                >
                  <div>
                    {currentGameStatus.gameOver == true ? <Tag color="red" text="Game End" /> 
                    : currentGameStatus.player2 == 0 ? <Tag color="green" text="waiting for game" /> 
                    : <Tag color="blue" text="in game" />}
                    <p>1P (O) : {currentGameStatus.player1}</p>
                    <p>VS</p>
                    <p>2P (X) : {currentGameStatus.player2}</p>
                    <p>WhoseTurn : {currentGameStatus.whoseTurn}</p>
                    
                    <p>Winner : {currentGameStatus.winner}</p>
                    <p>Prize / BetAmount : {currentGameStatus.betAmount / 10**18 * 2} ETH / {currentGameStatus.betAmount / 10**18} ETH</p>
                    {mainItem == null ? <p>YourItem : None</p> : <p>Your Item : {mainItem.json.name} - {mainItem.json.description}</p>}
                  </div>

                </div>
              </Row.Col>
            </Row>
            
            
          </div>
        </Tab>
        <Tab
          tabKey={2}
          tabName="Shop"
          className="Tab"
        >
          <Typography variant="h2">Erc-1155</Typography>
          <button onClick={test}>test</button>
          <button onClick={mint}>mint</button>
          <p></p>
          {gameItemList}
        </Tab>
        <Tab
          tabKey={3}
          tabName="My Page"
          className="Tab"
        >
          <Typography variant="h2">My Items</Typography>
          <Typography variant="h4">Main Item</Typography>
          {(mainItem == null) ? <p></p> : <Card
            id="card"
            onClick={function noRefCheck(){}}
            setIsSelected={function noRefCheck(){}}
          >
            {mainItem.json.name} - {mainItem.json.description}
            <div>
              <img className="gameItemImg" src={mainItem.json.image}></img>
            </div>
            <p>own : {mainItem.myQuantity}</p>
          </Card>}
          <Typography variant="h4">Items</Typography>
          {myGameItemList}
        </Tab>
        
      </TabList>
    </div>
  )
}

export default App;