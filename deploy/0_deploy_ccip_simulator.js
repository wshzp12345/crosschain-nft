const { developmentChains } = require('../helper-hardhat-config');

module.exports = async ({ getNamedAccounts, deployments }) => {
    // skip this deployment script if the network is not in the developmentChains
    if(!developmentChains.includes(network.name)){
        return;
    }
    const {firstAccount} = await getNamedAccounts();
    const {deploy, log} = deployments;

    log(`Deploying CCIP simulator contract...`);
    await deploy("CCIPLocalSimulator", {
        contract: "CCIPLocalSimulator",
        from: firstAccount,
        log: true,
        args: [],
    });
    log('CCIP simulator deployed successfully');
}

module.exports.tags = ['test ','all'];