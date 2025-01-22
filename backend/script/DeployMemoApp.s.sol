// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {MemoApp} from "../src/MemoApp.sol";

// contract DeployMemoApp is Script {
//     function run() external {
//         vm.startBroadcast(); // トランザクションのブロードキャストを開始

//         // MemoAppコントラクトのバイトコードを取得
//         bytes memory bytecode = type(MemoApp).creationCode;

//         // ユニークなソルトを指定（適宜変更可能）
//         bytes32 salt = keccak256(abi.encodePacked("unique_salt"));

//         // CREATE2 によるデプロイメント
//         address memoAppAddress = deploy(salt, bytecode);

//         // デプロイ先のアドレスを確認
//         console.log("MemoApp deployed to:", memoAppAddress);

//         vm.stopBroadcast(); // トランザクションのブロードキャストを停止
//     }

//     function deploy(bytes32 salt, bytes memory bytecode) internal returns (address) {
//         address addr;
//         assembly {
//             addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
//             if iszero(extcodesize(addr)) {
//                 revert(0, 0)
//             }
//         }
//         return addr;
//     }
// }

contract DeployMemoApp is Script {
    function run() external {
        // uint256 deployerPrivateKey = vm.envUint("MY_PRIVATE_KEY");
        vm.startBroadcast();

        // 通常のnewによるデプロイメント
        MemoApp memoApp = new MemoApp();
        
        console.log("MemoApp deployed to:", address(memoApp));

        vm.stopBroadcast();
    }
}

