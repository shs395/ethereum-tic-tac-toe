var GameAddressList = artifacts.require("./GameAddressList.sol");
var TicTacToe = artifacts.require("./TicTacToe.sol");


module.exports = function(deployer) {
  deployer.deploy(GameAddressList);
  deployer.deploy(TicTacToe);
};
