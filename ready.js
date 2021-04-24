#!/home/john/.nvm/versions/node/v11.15.0/bin/node

const fs = require('fs');


let contracts = ['VircleERC20', 'VircleSuperblocks', 'VircleERC20Manager', 'VircleBattleManager', 'VircleClaimManager'];
let inPath = "/mnt/ethereum/agents/vircletrx-contracts/build/contracts/";
let outPath = "/mnt/ethereum/agents/test-tron/";

contracts.forEach( contract => {
  let filename = inPath + contract + ".json";
  let data = fs.readFileSync(filename, {encoding:'ascii'});
  let data_json = JSON.parse(data);  

  let abi_filename = outPath + contract + "_abi.dat";
  let bytecode_filename = outPath + contract + "_bytecode.dat";

  
  let abi = JSON.stringify(data_json.abi);
  fs.writeFileSync(abi_filename, abi);

  let bytecode = data_json.bytecode;
  fs.writeFileSync(bytecode_filename, bytecode);
  

});

