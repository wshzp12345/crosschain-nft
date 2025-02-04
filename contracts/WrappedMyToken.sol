// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.22;

import {MyToken} from "./MyToken.sol";

contract WrappedMyToken is MyToken {
    constructor (string memory name, string memory symbol) 
    MyToken(name, symbol) {}

    function mintTokenWithSpecificTokenId(address to,uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

}