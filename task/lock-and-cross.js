const{taks} = require('hardhat/config');
const { networkConfig } = require('../helper-hardhat-config');
const { ethers } = require('hardhat');

task('lock-and-cross', 'Lock and cross tokens')
.addParam("chainselector","chain selector of the dest chain")
.addParam("receiver","receiver of the wrapped NFT")
.addParam("tokenid","tokenId of the NFT to be cross chain")
.setAction(async function (args, hre) {  
    
    let chainselector = args.chainselector;
    let receiver= args.receiver;
    let tokenId = args.tokenid;

    if(task.chainselector){
        chainselector = task.chainselector;
    }else{
        chainselector = networkConfig[network.config.chainId].compainionChainId;
        console.log('Chain selector is not set in command line, using default value from network config: ', chainselector);
    }
    console.log('Chain selector: ', chainselector);

    if(task.receiver){
        receiver = task.receiver;
    } else {
        const nftPoolBurnAndMintDeployment = 
        hre.compainNetworks["destchain"].deployments.get('NFTPoolBurnAndMint');
        receiver = nftPoolBurnAndMintDeployment.address;
        console.log('Receiver is not set in command line, using default value from network config: ', receiver);
    }
    console.log('Receiver: ', receiver);
    
    // transfer link token to address of the pool

    const linkTokenAddress = networkConfig[network.config.chainId].linkToken;
    const linkToken = await ethers.getContractAt('LinkToken', linkTokenAddress);
    const nftPoolLockAndRelease = await ethers.getContract('NFTPoolLockAndRelease');

    const transferTx = await linkToken.transfer(nftPoolLockAndRelease.target, ethers.parseEther('10'));
    await transferTx.wait(6);
    const balance = await linkToken.balanceOf(nftPoolLockAndRelease.target);
    console.log('Link balance of the pool: ', balance.toString());

    const nft = await ethers.getContract('MyToken', firstAccount);
    await nft.approve(nftPoolLockAndRelease.address, tokenId);
    console.log('Approve NFT to the pool');

    // call lockAndSendNFT

    const lockAndSendNFTtx = await nftPoolLockAndRelease.lockAndSendNFT(tokenId,
        firstAccount,
        chainselector, 
        receiver);
    console.log('')
} );

module.exports = {};  