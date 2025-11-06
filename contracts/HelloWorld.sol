// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloWorld {
    string public message = "Hello, Web3!";

    function updateMessage(string calldata newMessage) external {
        message = newMessage;
    }
}
