pragma solidity ^0.5.13;

// @dev - Manages a battle session between superblock submitter and challenger
interface SyscoinBattleManagerI {
    // @dev - Start a battle session
    function beginBattleSession(bytes32 superblockHash, address submitter, address challenger)
        external;
}
