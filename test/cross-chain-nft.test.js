
const {getNamedAccounts, ethers} = require('hardhat');
const {expect} = require('chai')

let firstAccount
let ccipSimulator
let nft
let wnft
let nftPoolBurnAndMint
let nftPoolLockAndRelease
let chainSelector

// prepare variable: contract, account
before(async function () {
    firstAccount = (await getNamedAccounts()).firstAccount;
    await deployments.fixture(['all'])
    ccipSimulator = await ethers.getContract("CCIPLocalSimulator", firstAccount)

    nft = await ethers.getContract("MyToken", firstAccount)
    nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease",firstAccount)

    wnft = await ethers.getContract("WrappedMyToken", firstAccount)
    nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint",firstAccount)

    const config = await ccipSimulator.configuration()
    chainSelector = config.chainSelector_
})


// source chain -> dest chain

describe('source chain to dest chain tests',async function () {
    it("test if user can mint NFTs on the source chain", async function () {
        await nft.safeMint(firstAccount)
        const owner = await nft.ownerOf(0)
        expect(owner).to.equal(firstAccount)
    })

    it("test if user can lock the nft in the pool and send ccip message on the source chain", async function () {
        await nft.approve(nftPoolLockAndRelease.target, 0)
        await ccipSimulator.requestLinkFromFaucet(
            nftPoolLockAndRelease, ethers.parseEther("10"))
        await nftPoolLockAndRelease.lockAndSendNFT(
            0,
            firstAccount,
            chainSelector,
            nftPoolBurnAndMint.target)
        
        const owner = await nft.ownerOf(0)
        expect(owner).to.equal(nftPoolLockAndRelease)
        // error: InvalidExtraArgsTag() in MockRouter.sol 126
        // checking sourcing code, the source code is same
    })

    it('test if user can get the wrapped NFT on the target chain', async function () {
        const owner = await wnft.ownerOf(0)
        expect(owner).to.equal(firstAccount)
    })


})
// test if user can lock the nft in the pool and send ccip message on the source chain

// test if user can get the wrapped NFT on the target chain


describe('dest chain to source chain tests',async function () {

    it("test if user can burn the wnft and send the ccip message on dest chain", async function () {
        await wnft.approve(nftPoolBurnAndMint.target, 0)
        await ccipSimulator.requestLinkFromFaucet(
            nftPoolBurnAndMint, ethers.parseEther("10"))
        await nftPoolBurnAndMint.burnAndSendNFT(
            0,
            firstAccount,
            chainSelector,
            nftPoolLockAndRelease.target)
        const totalSupply = await wnft.totalSupply()
        
        expect(totalSupply).to.equal(0)
    })

    it("test if user have the nft unlocked on source chain", async function () {
        const owner = await nft.ownerOf(0)
        expect(owner).to.equal(firstAccount)
    })
})


// dest chain -> source chain

// test if user can burn the wnft and send the ccip message on dest chain

// test if user have the nft unlocked on source chain

