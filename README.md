# Vircletrx contracts

[![Build Status](https://travis-ci.com/vircle/vircletrx-contracts.svg?branch=master)](https://travis-ci.com/vircle/vircletrx-contracts)

Ethereum contracts for the Vircle <=> Ethereum bridge.

If you are new to the Vircle <=> Ethereum bridge, please check the [docs](https://github.com/vircle/vircletrx-docs) repository first.

## Core components
* [VircleSuperblocks contract](contracts/VircleSuperblocks.sol)
  * Keeps a copy of the Vircle Superblockchain
  * Informs [VircleERC20Manager contract](contracts/token/VircleERC20Manager.sol) when a Vircle transaction locked or unlocked funds.
  * It's kind of a Vircle version of [BtcRelay](https://github.com/ethereum/btcrelay) but using Superblocks instead of blocks.
  * Parsing/working with Vircle blocks, txs and merkle trees 
* [VircleERC20Manager contract](contracts/token/VircleERC20Manager.sol)
  * An ERC20 manager contract to hold deposits or and transfer funds on unlock
  * Tokens are minted or transferred (for existing ERC20) when coins are locked on the Vircle blockchain.
  * Tokens are destroyed when coins should go back to the Vircle blockchain (balances are saved for when moving back to Ethereum).
* [VircleClaimManager contract](contracts/VircleClaimManager.sol)
  * Manages the interactive (challenge/response) validation of Superblocks.
* [VircleERC20](contracts/VircleParser/VircleERC20.sol) / [VircleERC20I](contracts/interfaces/VircleERC20I.sol) 
  - A class that follows ERC20 spec but is also has decimals, symbol and token name through the ERC20Detailed interface
  - Only ERC20's that are derived from ERC20Detailed are able to work with the bridge as we need access to decimals() (99.99% of ERC20's are compatible). If you originate from Vircle and are creating a new ERC20 to accompany the Vircle SPT, then you should mint, approve ERC20 Manager and then call freezeBurnERC20 (pass in a dummy vircleAddress such as "0x1" and not a real vircleAddress here) on ERC20 Manager to lock funds to a specific asset guid (the Vircle SPT). The amount locked is the amount that is transactable over the bridge, usually this is the total supply. If you originate from Ethereum as an existing ERC20 and wish to move to Vircle for fast, cheap, secure transactions and settling on Vircle blockchain, you may create a Vircle SPT with a supply equivalent to the total supply of your Ethereum's ERC20 and then send the SPT tokens to the "burn" address. When moving from Ethereum to Vircle, funds are extracted from the "burn" address of that SPT and moved into the users address based on the Ethereum proof-of-burn transaction (calling freezeBurnERC20).

## Running the Tests

* Install prerequisites
  * [nodejs](https://nodejs.org) v9.2.0 to v11.15.0.
  * [web3j](https://docs.web3j.io/command_line_tools/) command line tool
* Clone this repo.
* Install npm dependencies.
  * cd to the directory where the repo is cloned.
  ```
    npm install
  ```

* Compile contracts
  ```
    # compile contracts
    npx truffle compile --all
  ```

* Run tests:
  ```
    # first start ganache-cli - and do this again once your gas ran out
    npx ganache-cli --gasLimit 4000000000000 -e 1000000

    # run tests
    npx truffle test
  ```

## Deployment

To deploy the contracts

### Requirements

* A Rinkeby/Mainnet client running with rpc enabled

### Deployment

* Run `./scripts/exportAndInit.sh`

## License

MIT License<br/>
Copyright (c) 2019 Blockchain Foundry Inc<br/>
[License](LICENSE)

