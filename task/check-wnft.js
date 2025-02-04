const{ task} = require('hardhat/config');
task('check-wnft', 'Check WNFT deployment').setAction(async function (args, hre) {
    const {firstAccount} = await getNamedAccounts();
    const wnft = await ethers.getContract('WrappedMyToken', firstAccount);

    const totalSupply = await wnft.totalSupply();
    console.log('Total supply of NFT: ', totalSupply.toString());

    console.log('List of NFT owners: ');
    for(let tokenId = 0; tokenId < totalSupply; tokenId++){
        const owner = await nft.ownerOf(tokenId);
        console.log(`Owner of NFT with ID ${tokenId}: ${owner}`);
    }
});

module.exports = {};