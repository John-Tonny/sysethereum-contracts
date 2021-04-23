pragma solidity ^0.5.4;

import "./VircleSuperblocks.sol";

contract VircleSuperblocksForTests is VircleSuperblocks {
    event DebugSuperblock(
        bytes32 superblockHash,
        bytes32 blocksMerkleRoot,
        uint timestamp,
        uint mtpTimestamp,
        bytes32 lastHash,
        bytes32 parentId,
        address submitter,
        uint32 lastBits,
        uint32 height,
        Status status
    );

    function addSuperblock(
        bytes32 superblockHash,
        bytes32 blocksMerkleRoot,
        uint timestamp,
        uint mtpTimestamp,
        bytes32 lastHash,
        bytes32 parentId,
        address submitter,
        uint32 lastBits,
        uint32 height,
        Status status
    ) public {
        superblocks[superblockHash].blocksMerkleRoot = blocksMerkleRoot;
        superblocks[superblockHash].timestamp = timestamp;
        superblocks[superblockHash].mtpTimestamp = mtpTimestamp;
        superblocks[superblockHash].lastHash = lastHash;
        superblocks[superblockHash].parentId = parentId;
        superblocks[superblockHash].submitter = submitter;
        superblocks[superblockHash].height = height;
        superblocks[superblockHash].lastBits = lastBits;
        superblocks[superblockHash].status = status;

        emit DebugSuperblock(
            superblockHash,
            superblocks[superblockHash].blocksMerkleRoot,
            timestamp,
            mtpTimestamp,
            lastHash,
            parentId,
            submitter,
            lastBits,
            height,
            status
        );
    }
}