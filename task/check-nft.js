const{ task} = require('hardhat/config');
task('check-nft', 'Check NFT deployment').setAction(async function (args, hre) {
    const {firstAccount} = await getNamedAccounts();
    const nft = await ethers.getContract('MyToken', firstAccount);

    const totalSupply = await nft.totalSupply();
    console.log('Total supply of NFT: ', totalSupply.toString());

    console.log('List of NFT owners: ');
    for(let tokenId = 0; tokenId < totalSupply; tokenId++){
        const owner = await nft.ownerOf(tokenId);
        console.log(`Owner of NFT with ID ${tokenId}: ${owner}`);
    }
});

module.exports = {};