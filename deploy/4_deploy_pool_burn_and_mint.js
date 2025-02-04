
const {deployments, getNamedAccounts, network} = require('hardhat');
const {developmentChains, networkConfig} = require('../helper-hardhat-config');


module.exports = async ({ getNamedAccounts, deployments }) => {
    const {firstAccount} = await getNamedAccounts();
    const {deploy, log} = deployments;

    let destinationRouter
    let linkTokenAddress
    log(`Deploying NFTPoolBurnAndMint...`);
    if(!developmentChains.includes(network.name)){
        destinationRouter=  networkConfig[network.config.chainId].router
        linkTokenAddress = networkConfig[network.config.chainId].linkToken
    }else {

        const ccipSimulatorDeployment =await deployments.get('CCIPLocalSimulator');
        const ccipSimulator = await ethers.getContractAt('CCIPLocalSimulator', ccipSimulatorDeployment.address);
        const ccipConfig = await ccipSimulator.configuration()
        destinationRouter = ccipConfig.destinationRouter_;
        linkTokenAddress = ccipConfig.linkToken_;
    }
    const wnftDeployment = await deployments.get('WrappedMyToken');
    const wnftAddress = wnftDeployment.address;

    await deploy("NFTPoolBurnAndMint", {
        contract: "NFTPoolBurnAndMint",
        from: firstAccount,
        log: true,
        args: [destinationRouter, linkTokenAddress, wnftAddress],
    });
    log('NFTPoolBurnAndMint deployed successfully');
}

module.exports.tags = ['destchain','all'];