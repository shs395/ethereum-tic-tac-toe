// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameAddressList {
    address[] public gameAddressList;
    uint public gameCount;
    
    event gameAdded();

    constructor() {
        gameCount = 0;
    }

    function addGame(address gameAddress) public {
        gameAddressList.push(gameAddress);
        gameCount++;
        emit gameAdded();
    } 

}