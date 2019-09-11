const utils = require('./utils');

contract('validateDifficultyAdjustment', (accounts) => {
  const owner = accounts[0];
  const submitter = accounts[1];
  const challenger = accounts[2];
  let claimManager;
  let superblocks;
  let proposedSuperblock;
  let ClaimManagerEvents;

  describe('Validate difficulty adjustment algorithm', () => {
    let genesisSuperblockHash;
    let proposesSuperblockHash;
    let battleSessionId;
    // 71999 - c1bc0d1b4ed2eefea08050aca58613d86f3834802bdff6b418bff8ce0bd29018
    const genesisHeaders = [
      `0401001047cbd4c89cc09df42d8677d04bf478b818b4649d36f605e25bc7b196f8ee92b35edd7df79d22806b599c84ec25b13bf5774f87dc0da9874b1e039e0c49f5e9780bab315de34a0a180000000001000000010000000000000000000000000000000000000000000000000000000000000000ffffffff590344f108162f5669614254432f4d696e6564206279206c7a71312f2cfabe6d6d03246f5c5a7ac61005245191ccf80f48d784645deb1cf9fd1424d8d20c69649c100000000000000010356fe50cd79458c147e565c03b920000ffffffff022d9fa44d000000001976a914536ffa992491508dca0354e52f32a3a7a679a53a88ac0000000000000000266a24aa21a9ed3c745ee959d0a96bba3cb37e8e3c950fbdedf1e5ebe5889ac2181e8491e3e1740000000000000000000000000000000000000000000000000000000000000000000000000c6ff9fa8b17ae305bd8ace6cedac837ff412c5d6d2fa38355ff7aaef3f8d72835aa7b91b7de9e02e2b061bccf9e2062b57aac2179f3b947bad8397d4ed47fde88087e7ce90ae9e0f674797b7a447a329a138963f6c45b4f1871545974118406928703d44df4836926f49259ff2f4927118e0931ae6d6e9c54c6d3d449a4cb8843fa2945e08e32931d21e7a5df0ecaf0974f0a36ffdd63275ae19eaaee165798b2728da659912e6bff521b156cc8089a20eab7bc77f783d4e67aeb170b2dcfb31f13b33aeb0b20de08a4fb2c767aeb566e33d360b3438b8619e53d23bae4e91fef69387bb0f7096b79aab4cedd16bf8ac682ea920c8d0f2628842a30c8b0aa1dab11c3cc4cad39b4f46e9a5a1f9112bb06d8f5d86bb95231f992a39b954103ee7a37e5181204f0fa8b776d030cd4ddef4b28379cc3b4c3f018b78b3f8666be0aad70b61a68a5907244964f06a7612f1e61351abdc66c91c9859e9dd66ce89a4e3605779751c60c43c041134e3563e51c913d735cc2cbb5784794ab3e169ee140a400000000040000000000000000000000000000000000000000000000000000000000000000e2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf9cc05624f2205c980deea3a65a31ec92af55a7810a1840b60a6d5f976f08848794ac9f5b61c01abce2bf69897cf6b9b4affdcd3c0e03c1499626388f6a6ef6c390e000000000000207f19065bbf8718c86acbe757b97145e0f59c5b1247a209000000000000000000ec9b4f0f3db9b7c4741a22b530823d1881efee377abc08f0b5bd81c0c990f9a20bab315d9b0d1f17037521a9`,
      `040100101890d20bcef8bf18b4f6df2b8034386fd81386a5ac5080a0feeed24e1b0dbcc128d6674ad5025a466f2d7ca54ba6044486e91d3caeaea8f656470a818168a41810ab315dc01f0b180000000001000000010000000000000000000000000000000000000000000000000000000000000000ffffffff640344f1082cfabe6d6dfe0afc06f1dca615b9ba2d3ee08429db6da4084299b80d864afe615364414d1710000000f09f909f00174d696e656420627920687963313337333133323833373800000000000000000000000000000000000000000500c75601000000000004a41cb14d000000001976a914c825a1ecf2a6830c4401620c3a16f1995057c2ab88ac00000000000000002f6a24aa21a9ede16d7e551abce017907e4dee66d40e209fba1a4ef21cfd9f0a514f899a680f8108000000000000000000000000000000002c6a4c2952534b424c4f434b3a5310c032524979bc49dd4ce9b41c5ed9913ab8f4bf01d95e36d425b57510b3f90000000000000000266a24b9e11b6df185d3f1edd2f3941618d89655cfaa1bf66a7cd15ad2cf039925926afc0331e23830bc3a00000000000000000000000000000000000000000000000000000000000000000cf155776087f7700dd9a5b8064a6215abbd65661da51ec75d12ad17ad242daa53105189c349b2c8cbfced63a998952473ef97b62215e3e6c8f45de6e938ebec40631cfa4c885cca2d9289c66d9323b491ed799709db99f763fdab04894264fb951718632d336dc9dda34da25201d118a475b62245e00a2831285a1750e41b1de09ecf54da19b6d9730c53dd69cc6151d7c23d2ea5e71f90eec9204298be6750d1fbd9878ba2ef6c99f5368e0867f6ca0a881cb540f0db9d26d0ff10bb52fb35c04fd9fbf3df643486bfd34c0e29cef5aec03ff7a7b47648ae56b89d11c2af96016ebd5a0e124eedd6924d7fed5848d2c00a563f45352e2521697ecf1ebae33407568d09bab5c01f76e3b74d0c4e2d39fed46c7eac280c6c86e94dd3f3dcab69ee33e97c8118b844ee84d1de90e99a970deab5f2e70bc7d3d807fad822d3225a217fb78906adfe9f84346b1be2b898ef1692cd6abba254be8d9bdfda061434731a0d76837a21cb6ced151b222b703ec8d54946ef6c0d78479a19240e2e569ca9a10000000004e5ea1ba563465de363f0bdb2d556ec6f0b6d38f2185b4c3a91856900fe11660b3feee5244c18afb612c4846a8bf1b07759fedbdec9d139ade9f4c82736e17fe8515781de95533de686107fd825918e6a24963594a526493c2c13d1c867b4c448e28a68a639b1ffe8b8cc9cf9849fce07d59992d5c4175dd8ace583a1736385f10e000000000000207f19065bbf8718c86acbe757b97145e0f59c5b1247a2090000000000000000005ceafc0c8c5208bd7ed0086006b15f1b88574f9098b94ec1a7612cd3c27071d818ab315d9b0d1f1704783b54`,
    ];
    // 72001 - 0d08feb11a90703ad21d87f5fa3aea2f1014aeba2d1437fc0794b0e823957c98
    const headers = [
      `0401001079cf7adb7e0785d004c5ade38afbd8098def81543d889d6505024c06b16484acf2e24c28c07bb0cdc41edb68725e5739cbd60bc3f7fefc5c286b4a03a4b5e6fd2fab315dc01f0b180000000001000000010000000000000000000000000000000000000000000000000000000000000000ffffffff640344f1082cfabe6d6d49759fd6053f6629bcbbc0891a7c9009db191113a443d3baaa21b05637d657d110000000f09f909f000d4d696e656420627920736367790000000000000000000000000000000000000000000000000000000000000500f88f00000000000004e2c3ca4d000000001976a914c825a1ecf2a6830c4401620c3a16f1995057c2ab88ac00000000000000002f6a24aa21a9ed198fa0075b4d1f46defe8daf734d91769a3879ac9614c03843335aad4e50722a08000000000000000000000000000000002c6a4c2952534b424c4f434b3a4a8e4a17e629fc2151679da1dcf2323fb92bb250a38e78e488fafe6c7f6808640000000000000000266a24b9e11b6dd0e119a8ee780db4d4211c6324e136333f23da6d941770f3a14115397471351659afd93900000000000000000000000000000000000000000000000000000000000000000cd1a68ca78273ffc7e98aa9368c4d9599ddc2dde12f6b078ca82d61ce692bb760972a7dc9acfa070bfd828506136121ed273d0c99fcb16f1acb6b3e4058f88cec53cf1b2e2b9216fe01976f33327932bcd3b94b0c7f250f3a3bd2564ea543442b201a0d9db0661df4fd18957b5b8a40769ed0d082d2c834dfa5b724bdbc9eb2213b819709ad28872ec06b9815d964c2ee8541da6736c970db6a67d917211c0a50a29c1f37af897c9cb2aaf9b4e1c1578b5716d022ee942843f3a6c83f4530c7287922c5e0152cef5da09c93dca64e8062dc9771ae8d82bacf6a189c5f7937572ed0757caa5de7ccbf2359be246e953a1f7a9ff5020a509389930eaf0dd560d654b21578a898242a57ed26a04d694c249f3ebf109f04a7adeddca942ef39435cc0c809443078985e690f5601a5eeb1d6fbffb27229dda083b84f9c014934ad4529384293f0183faca5402854a657933ec89203eb1b4a848aebc3afe457c1aebf165b3e9a60657589315d5c2ed3ce1871a3bc8e28338defb8386dc4c2c8a7dc92110000000004d3e642b5894a20e0bb95dd433c670d95868f1e77602a4a06d82ffbd3ca611e943feee5244c18afb612c4846a8bf1b07759fedbdec9d139ade9f4c82736e17fe8515781de95533de686107fd825918e6a24963594a526493c2c13d1c867b4c448d64f2fb3304c65bd16758dd1ef37ae2d3ef64c46690d9b23a9fbf484cb555d750e0000000000c0207f19065bbf8718c86acbe757b97145e0f59c5b1247a209000000000000000000e2f274bfd8129d3dabc41032bb3112b12882161f84293729918a9cc05362ee6552ab315d9b0d1f17252bef09`,
      `04010010987c9523e8b09407fc37142dbaae14102fea3afaf5871dd23a70901ab1fe080d7892ce50a793023a632e3430dbd2323d38a9b4d8e79da9337a06523a104471bc63ab315dc01f0b180000000001000000010000000000000000000000000000000000000000000000000000000000000000ffffffff5a0344f108172f5669614254432f4d696e656420627920746f706d732f2cfabe6d6d798a3a7243c23a2fadf46faaf52821cbba66372de4c4d872dd2b9c36c130d226100000000000000010e26f830cd4901537583c74dc2e6a0000ffffffff02692bde4d000000001976a914536ffa992491508dca0354e52f32a3a7a679a53a88ac0000000000000000266a24aa21a9eda449c1b2504c4f05795f167860ac0340abead88f107067c4e6be566e35b47a030000000000000000000000000000000000000000000000000000000000000000000000000c6ff9fa8b17ae305bd8ace6cedac837ff412c5d6d2fa38355ff7aaef3f8d72835aa7b91b7de9e02e2b061bccf9e2062b57aac2179f3b947bad8397d4ed47fde88087e7ce90ae9e0f674797b7a447a329a138963f6c45b4f1871545974118406928703d44df4836926f49259ff2f4927118e0931ae6d6e9c54c6d3d449a4cb8843fa2945e08e32931d21e7a5df0ecaf0974f0a36ffdd63275ae19eaaee165798b2728da659912e6bff521b156cc8089a20eab7bc77f783d4e67aeb170b2dcfb31f57dd83da91839a2130fd5c660a70556b4a8d8791a29b9740c5ba518a6f49924d738e5283a81f0bab331840ba98d7fd2efe4c5f9d7764dc2619376d1c50fce341265ac37ec6abe20aa481fee0782feb0ef4e68144ea0fd3d80dd48d068cd403b17c36014a6c2a4b6286f1f4cd613b9635249285da0f934e55556df90a1b791a31abfbee4f95021dc7f95bfbf3cf7976a0517330ce849fbd1285f1b89a92d77d9902a0d17b68199a844e83ea9137d34039b6afa455045ff53e2238be69540f7ab000000000040000000000000000000000000000000000000000000000000000000000000000e2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf926afda83ce4a70dfee7dc9f30522882ea02c797a0027e7dcab44007dfe6700db9d1d462484bfbdcfe9df0801eb8942e2b5db7dcae9807c9aa088a7d7d00a928c0e000000000080207f19065bbf8718c86acbe757b97145e0f59c5b1247a209000000000000000000d1b45684b6dff1bd4497ae3385e4e38500a2b67880a448c9450867f1825ea06b90ab315d9b0d1f179173604a`
    ];
    const initAccumulatedWork = web3.utils.toBN("0x000000000000000000000000000000000000000000150ef0ec99ee1645b37008");
    const initParentHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const genesisSuperblock = utils.makeSuperblock(genesisHeaders, initParentHash, initAccumulatedWork);
    const hashes = headers.map(header => utils.calcBlockSha256Hash(header));
    proposedSuperblock = utils.makeSuperblock(headers,
      genesisSuperblock.superblockHash,
      genesisSuperblock.accumulatedWork
    );

    beforeEach(async () => {
      ({
        superblocks,
        claimManager,
        battleManager,
      } = await utils.initSuperblockChain({
        network: utils.SYSCOIN_REGTEST,
        genesisSuperblock,
        params: utils.OPTIONS_SYSCOIN_REGTEST,
        from: owner,
      }));
      genesisSuperblockHash = genesisSuperblock.superblockHash;
      const best = await superblocks.methods.getBestSuperblock().call();
      assert.equal(genesisSuperblockHash, best, 'Best superblock should match');
      await claimManager.methods.makeDeposit().send({ value: utils.DEPOSITS.MIN_REWARD, from: submitter, gas: 300000 });
      await claimManager.methods.makeDeposit().send({ value: utils.DEPOSITS.MIN_REWARD, from: challenger, gas: 300000 });
    });
    it('Confirm difficulty adjusts and convicts challenger', async () => {
      result = await claimManager.methods.proposeSuperblock(
        proposedSuperblock.merkleRoot,
        proposedSuperblock.accumulatedWork.toString(),
        proposedSuperblock.timestamp,
        proposedSuperblock.lastHash,
        proposedSuperblock.lastBits,
        proposedSuperblock.parentId).send({ from: submitter, gas: 2100000 });

      assert.ok(result.events.SuperblockClaimCreated, 'New superblock proposed');
      proposesSuperblockHash = result.events.SuperblockClaimCreated.returnValues.superblockHash;
      claim1 = proposesSuperblockHash;
      await claimManager.methods.makeDeposit().send({ value: utils.DEPOSITS.MIN_REWARD, from: challenger, gas: 300000 });
      result = await claimManager.methods.challengeSuperblock(proposesSuperblockHash).send({ from: challenger, gas: 2100000 });
      assert.ok(result.events.SuperblockClaimChallenged, 'Superblock challenged');
      assert.equal(claim1, result.events.SuperblockClaimChallenged.returnValues.superblockHash);

      assert.ok(result.events.VerificationGameStarted, 'Battle started');
      battleSessionId = result.events.VerificationGameStarted.returnValues.sessionId;



      result = await battleManager.methods.respondBlockHeaders(battleSessionId, Buffer.from(headers.join(""), 'hex'), headers.length).send({ from: submitter, gas: 5000000 });
      assert.ok(result.events.ChallengerConvicted, 'Challenger failed');

      // Confirm superblock
      await utils.blockchainTimeoutSeconds(2*utils.OPTIONS_SYSCOIN_REGTEST.TIMEOUT);
      result = await claimManager.methods.checkClaimFinished(proposesSuperblockHash).send({ from: submitter, gas: 300000 });
      assert.ok(result.events.SuperblockClaimPending, 'Superblock semi approved');
    });
   
  });
});
