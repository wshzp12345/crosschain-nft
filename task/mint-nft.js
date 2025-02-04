const {task} = require('hardhat/config');

task('mint-nft', 'Mint NFT').setAction(async function (args, hre) {
    const {firstAccount} = await getNamedAccounts();
    const nft = await ethers
        .getContract('MyToken', firstAccount);
    console.log('Minting NFT...');
    const mintTx =  await nft.safeMint(firstAccount);
    mintTx.wait(6);
    console.log('NFT minted successfully');
});

module.exports = {};