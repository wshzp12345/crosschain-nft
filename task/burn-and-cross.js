const{taks} = require('hardhat/config');
const { networkConfig } = require('../helper-hardhat-config');
const { ethers } = require('hardhat');

task('burn-and-cross', 'burn and cross tokens')
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
        const nftPoolLockAndReleaseDeployment = 
        hre.compainNetworks["destchain"].deployments.get('NFTPoolLockAndRelease');
        receiver = nftPoolLockAndReleaseDeployment.address;
        console.log('Receiver is not set in command line, using default value from network config: ', receiver);
    }
    console.log('Receiver: ', receiver);
    
    // transfer link token to address of the pool

    const linkTokenAddress = networkConfig[network.config.chainId].linkToken;
    const linkToken = await ethers.getContractAt('LinkToken', linkTokenAddress);
    const nftPoolBurnAndMint = await ethers.getContract('NFTPoolBurnAndMint');

    const transferTx = await linkToken.transfer(nftPoolBurnAndMint.target, ethers.parseEther('10'));
    await transferTx.wait(6);
    const balance = await linkToken.balanceOf(nftPoolBurnAndMint.target);
    console.log('Link balance of the pool: ', balance.toString());

    const wnft = await ethers.getContract('WrappedMyToken', firstAccount);
    await wnft.approve(nftPoolBurnAndMint.address, tokenId);
    console.log('Approve NFT to the pool');

    // call lockAndSendNFT


    const lockAndSendNFTtx = await nftPoolBurnAndMint.burnAndSendNFT(tokenId,
        firstAccount,
        chainselector, 
        receiver);
    console.log('LockAndSendNFT tx: ', lockAndSendNFTtx.hash);
} );

module.exports = {};  