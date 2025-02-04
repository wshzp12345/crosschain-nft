
const {deployments, getNamedAccounts, network} = require('hardhat');
const {developmentChains, networkConfig} = require('../helper-hardhat-config');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const {firstAccount} = await getNamedAccounts();
    const {deploy, log} = deployments;
    let sourcechainRouter
    let linkTokenAddress
    log(`Deploying NFTPoolLockAndRelease...`);
    if(!developmentChains.includes(network.name)){
        sourcechainRouter=  networkConfig[network.config.chainId].router
        linkTokenAddress = networkConfig[network.config.chainId].linkToken

    }else {
        const ccipSimulatorDeployment =await deployments.get('CCIPLocalSimulator');
        const ccipSimulator = await ethers.getContractAt('CCIPLocalSimulator', ccipSimulatorDeployment.address);
        log(`CCIP LocalSimulator deployed at ${ccipSimulator.address}`);
        const ccipConfig = await ccipSimulator.configuration()
        sourcechainRouter = ccipConfig.sourceRouter_;
        linkTokenAddress = ccipConfig.linkToken_;
        log(`CCIP configuration: sourcechainRouter=${sourcechainRouter}, linkTokenAddress=${linkTokenAddress}`);
    }
    const nftDeployment = await deployments.get('MyToken');
    
    const nftAddress = nftDeployment.address;
    log(`NFT address: ${nftAddress}`);

    await deploy("NFTPoolLockAndRelease", {
        contract: "NFTPoolLockAndRelease",
        from: firstAccount,
        log: true,
        args: [sourcechainRouter, linkTokenAddress, nftAddress],
    });
    log('NFTPoolLockAndRelease deployed successfully');
}

module.exports.tags = ['sourcechain','all'];