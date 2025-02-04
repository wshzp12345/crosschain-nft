module.exports = async ({ getNamedAccounts, deployments }) => {
    const {firstAccount} = await getNamedAccounts();
    const {deploy, log} = deployments;

    log(`Deploying WrappedMyToken with ${firstAccount}`);
    await deploy("WrappedMyToken", {
        contract: "WrappedMyToken",
        from: firstAccount,
        log: true,
        args: ["WrappedMyToken", "WMT"],
    });
    log('WrappedMyToken deployed successfully');
}

module.exports.tags = ['destchain','all'];