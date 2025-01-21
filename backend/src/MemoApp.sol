// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract MemoApp {
    struct Memo {
        uint256 id;
        address creator;
        string content;
        uint256 timestamp;
    }

    Memo[] private memos;
    uint256 private nextId;

    event MemoCreated(uint256 id, address creator, string content, uint256 timestamp);

    function createMemo(string calldata content) external {
        memos.push(Memo(nextId, msg.sender, content, block.timestamp));
        emit MemoCreated(nextId, msg.sender, content, block.timestamp);
        nextId++;
    }

    function getMemo(uint256 id) external view returns (Memo memory) {
        require(id < nextId, "Memo does not exist");
        return memos[id];
    }

    function getAllMemos() external view returns (Memo[] memory) {
        return memos;
    }
}