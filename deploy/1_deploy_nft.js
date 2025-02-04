module.exports = async ({ getNamedAccounts, deployments }) => {
    const {firstAccount} = await getNamedAccounts();
    const {deploy, log} = deployments;

    log(`Deploying NFT with ${firstAccount}`);
    await deploy("MyToken", {
        contract: "MyToken",
        from: firstAccount,
        log: true,
        args: ["MyToken", "MT"],
    });
    log('NFT deployed successfully');
}

module.exports.tags = ['sourcechain','all'];