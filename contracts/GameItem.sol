// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GameItem is ERC1155 {
    uint256 public constant Red = 1;
    uint256 public constant Orange = 2;
    uint256 public constant Yellow = 3;
    uint256 public constant Green = 4;
    uint256 public constant Blue = 5;
    uint256 public constant Navy = 6;
    uint256 public constant Purple = 7;

    uint256 public mintRate = 0.005 ether;
    uint256[] public minted = [0, 0, 0, 0, 0 ,0 ,0];
    uint256[] public supplies = [10, 10, 10, 999, 50, 100, 777];


    constructor() ERC1155("https://ipfs.io/ipfs/bafybeihmf6ndejxavl756qmaczjzpybrus7diu466flxsjnhvx34wzkceq/{id}.json") {
        // _mint(msg.sender, Red, 1, "");
        // _mint(msg.sender, Orange, 1, "");
        // _mint(msg.sender, Yellow, 1, "");
        // _mint(msg.sender, Green, 1, "");
        // _mint(msg.sender, Blue, 1, "");
        // _mint(msg.sender, Navy, 1, "");
        // _mint(msg.sender, Purple, 1, "");
    }

    function mint(uint256 id, uint256 amount) payable public {
        require(id <= supplies.length, "Token doesn't exist");
        require(id > 0, "Token doesn't exist");
        require(msg.value >= (amount * mintRate), "Not enough ether sent");
        require(minted[id - 1] + amount <= supplies[id -1], "not enought supply left");
        minted[id-1]++;
        _mint(msg.sender, id, amount, "");
    }

    function uri(uint256 _tokenid) override public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "https://ipfs.io/ipfs/bafybeihmf6ndejxavl756qmaczjzpybrus7diu466flxsjnhvx34wzkceq/",
                Strings.toString(_tokenid),".json"
            )
        );
    }
}