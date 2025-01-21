// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "../lib/forge-std/src/Script.sol";
import {MemoApp} from "../src/MemoApp.sol";

contract DeployMemoApp is Script {
    function run() external {
        vm.startBroadcast();
        new MemoApp();
        vm.stopBroadcast();
    }
}
