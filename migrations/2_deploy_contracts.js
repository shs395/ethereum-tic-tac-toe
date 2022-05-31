var GameAddressList = artifacts.require("./GameAddressList.sol");
var TicTacToe = artifacts.require("./TicTacToe.sol");
var GameItem = artifacts.require("./GameItem.sol");


module.exports = function(deployer) {
  deployer.deploy(GameAddressList);
  deployer.deploy(TicTacToe);
  deployer.deploy(GameItem);
};
