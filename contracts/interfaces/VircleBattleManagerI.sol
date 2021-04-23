pragma solidity ^0.5.4;

// @dev - Manages a battle session between superblock submitter and challenger
interface VircleBattleManagerI {
    // @dev - Start a battle session
    function beginBattleSession(bytes32 superblockHash, address submitter, address challenger)
        external;
}
