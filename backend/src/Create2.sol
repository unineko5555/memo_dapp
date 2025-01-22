// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Create2Deployer {
    function deploy(bytes32 salt, bytes memory bytecode) public returns (address) {
        address addr;
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        require(addr != address(0), "CREATE2: Failed on deploy");
        return addr;
    }
}