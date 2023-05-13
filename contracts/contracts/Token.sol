// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DevToken is ERC20, Ownable{
    constructor() ERC20("DevToken", "ZAP"){}

    //issue token. Every time energy is produced, token equivalent is issued.
    function issueToken(address receiver, uint256 amount) public{
        _mint(receiver, amount);
    }

    //burn token. Every time energy is set to consume, token equivalent is burned.
    function burnToken(address receiver, uint256 amount) public{
        _burn(receiver, amount);
    }
    
}