import { expect } from "chai"
import { ethers } from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"

describe("Pandora", function () {

  async function deployBeforeAll() {
    const [admin, alice, bob, carol, david, eric] = await ethers.getSigners()

    const tokenName = "Pandora"

    const pandora = await ethers.deployContract(tokenName)

    // console.log(`\x1b[0m${tokenName} deployed to:\x1b[32m ${await pandora.getAddress()}`)
    // console.log(`\x1b[0mThe admin address is:\x1b[32m ${admin.address}`)
    return { admin, alice, bob, carol, david, eric, pandora }
  }

  it("pre-mint 10000 to admin", async function () {
    const { admin, pandora } = await loadFixture(deployBeforeAll)
    expect(await pandora.balanceOf(admin.address)).to.equal(10000_000000_000000_000000n)

    expect(await pandora.decimals()).to.equal(18)
    expect(await pandora.totalSupply()).to.equal(10000_000000_000000_000000n)

    expect(await pandora.minted()).to.equal(0)
  })

  it("should have NFT URI", async function () {
    const { admin, pandora, alice } = await loadFixture(deployBeforeAll)
    expect(await pandora.balanceOf(admin.address)).to.equal(10000_000000_000000_000000n)

    expect(await pandora.decimals()).to.equal(18)
    expect(await pandora.totalSupply()).to.equal(10000_000000_000000_000000n)

    expect(await pandora.minted()).to.equal(0)
    await pandora.transfer(alice.address, 50n * 10n ** 17n)
    expect(await pandora.minted()).to.equal(5)

    // Alice 5
    expect(await pandora.minted()).to.equal(5)
    await pandora.setDataURI("https://example.com/")
    console.log(await pandora.tokenURI(1))
    console.log(await pandora.tokenURI(2))
    console.log(await pandora.tokenURI(3))
    console.log(await pandora.tokenURI(4))
    console.log(await pandora.tokenURI(5))


    await pandora.setTokenURI("https://example.com/")
    expect((await pandora.tokenURI(1))).to.equal("https://example.com/1")
    expect((await pandora.tokenURI(2))).to.equal("https://example.com/2")
    expect((await pandora.tokenURI(3))).to.equal("https://example.com/3")
    expect((await pandora.tokenURI(4))).to.equal("https://example.com/4")
    expect((await pandora.tokenURI(5))).to.equal("https://example.com/5")

    await pandora.setTokenURI("")
    expect((await pandora.tokenURI(1))).not.to.equal("https://example.com/1")
    expect((await pandora.tokenURI(2))).not.to.equal("https://example.com/2")
    expect((await pandora.tokenURI(3))).not.to.equal("https://example.com/3")
    expect((await pandora.tokenURI(4))).not.to.equal("https://example.com/4")
    expect((await pandora.tokenURI(5))).not.to.equal("https://example.com/5")

  })


  it("transfer to create NFT", async function () {
    const { admin, alice, bob, david, pandora } = await loadFixture(deployBeforeAll)

    expect(await pandora.balanceOf(admin.address)).to.equal(10000n * 10n ** 18n)
    expect(await pandora.minted()).to.equal(0)
    await expect(pandora.ownerOf(1)).to.be.revertedWithCustomError(pandora, "NotFound")

    await pandora.transfer(alice.address, 8n * 10n ** 17n)
    // Alice 0.8

    expect(await pandora.balanceOf(admin.address)).to.equal(99992n * 10n ** 17n)
    expect(await pandora.balanceOf(alice.address)).to.equal(8n * 10n ** 17n)
    expect(await pandora.minted()).to.equal(0)
    await expect(pandora.ownerOf(1)).to.be.revertedWithCustomError(pandora, "NotFound")

    await pandora.transfer(alice.address, 3n * 10n ** 17n)

    // Alice 0.8+0.3 = 1.1
    expect(await pandora.balanceOf(admin.address)).to.equal(99989n * 10n ** 17n)
    expect(await pandora.balanceOf(alice.address)).to.equal(11n * 10n ** 17n)
    expect(await pandora.ownerOf(1)).to.equal(alice.address)
    expect(await pandora.minted()).to.equal(1)

    await pandora.transfer(alice.address, 29n * 10n ** 17n)

    // Alice 0.8+0.3+2.9 = 4
    expect(await pandora.balanceOf(admin.address)).to.equal(99960n * 10n ** 17n)
    expect(await pandora.balanceOf(alice.address)).to.equal(40n * 10n ** 17n)
    expect(await pandora.ownerOf(1)).to.equal(alice.address)
    expect(await pandora.ownerOf(2)).to.equal(alice.address)
    expect(await pandora.ownerOf(3)).to.equal(alice.address)
    expect(await pandora.ownerOf(4)).to.equal(alice.address)
    expect(await pandora.minted()).to.equal(4)

    await pandora.connect(alice).transfer(bob.address, 15n * 10n ** 17n)

    // Alice 4-1.5 = 2.5
    // Bob = 1.5
    expect(await pandora.balanceOf(alice.address)).to.equal(25n * 10n ** 17n)
    expect(await pandora.balanceOf(bob.address)).to.equal(15n * 10n ** 17n)

    expect(await pandora.ownerOf(1)).to.equal(alice.address)
    expect(await pandora.ownerOf(2)).to.equal(alice.address)
    await expect(pandora.ownerOf(3)).to.be.revertedWithCustomError(pandora, "NotFound")
    await expect(pandora.ownerOf(4)).to.be.revertedWithCustomError(pandora, "NotFound")
    expect(await pandora.ownerOf(5)).to.equal(bob.address)
    expect(await pandora.minted()).to.equal(5)


    await pandora.connect(bob).transfer(alice.address, 15n * 10n ** 17n)

    // Alice 1.5+2.5=4
    // Bob = 0
    expect(await pandora.balanceOf(alice.address)).to.equal(40n * 10n ** 17n)
    expect(await pandora.balanceOf(bob.address)).to.equal(0n * 10n ** 17n)
    expect(await pandora.ownerOf(1)).to.equal(alice.address)
    expect(await pandora.ownerOf(2)).to.equal(alice.address)
    await expect(pandora.ownerOf(3)).to.be.revertedWithCustomError(pandora, "NotFound")
    await expect(pandora.ownerOf(4)).to.be.revertedWithCustomError(pandora, "NotFound")
    await expect(pandora.ownerOf(5)).to.be.revertedWithCustomError(pandora, "NotFound")
    expect(await pandora.ownerOf(6)).to.equal(alice.address)
    expect(await pandora.ownerOf(7)).to.equal(alice.address)
    expect(await pandora.minted()).to.equal(7)


  })

  it("whitelist skip create NFT", async function () {
    const { admin, alice, bob, carol, pandora } = await loadFixture(deployBeforeAll)

    // Bob in whitelist
    await pandora.setWhitelist(bob.address, true)

    expect(await pandora.minted()).to.equal(0)

    await pandora.transfer(alice.address, 50n * 10n ** 17n)
    expect(await pandora.minted()).to.equal(5)

    await pandora.connect(alice).transfer(bob.address, 25n * 10n ** 17n)
    expect(await pandora.minted()).to.equal(5)

    await pandora.connect(alice).transfer(carol.address, 25n * 10n ** 17n)
    expect(await pandora.minted()).to.equal(7)

    await pandora.connect(bob).transfer(carol.address, 20n * 10n ** 17n)
    expect(await pandora.minted()).to.equal(9)

    await pandora.connect(bob).transfer(carol.address, 5n * 10n ** 17n)
    expect(await pandora.minted()).to.equal(10)


    // Bob not in whitelist
    await pandora.setWhitelist(bob.address, false)

    await pandora.connect(carol).transfer(bob.address, 50n * 10n ** 17n)
    expect(await pandora.minted()).to.equal(15)

  })


  it("should support approve & transferFrom", async function () {
    const { admin, alice, bob, carol, david, pandora } = await loadFixture(deployBeforeAll)

    await pandora.transfer(alice.address, 50n * 10n ** 17n)
    expect(await pandora.minted()).to.equal(5)

    expect(await pandora.ownerOf(1)).to.equal(alice.address)
    expect(await pandora.ownerOf(2)).to.equal(alice.address)
    expect(await pandora.ownerOf(3)).to.equal(alice.address)
    expect(await pandora.ownerOf(4)).to.equal(alice.address)
    expect(await pandora.ownerOf(5)).to.equal(alice.address)
    expect(await pandora.balanceOf(alice.address)).to.equal(50n * 10n ** 17n)

    await pandora.connect(alice).approve(david.address, 1)
    await pandora.connect(alice).approve(david.address, 2)
    await pandora.connect(alice).approve(david.address, 3)
    await pandora.connect(alice).approve(david.address, 4)
    await pandora.connect(alice).approve(david.address, 5)
    await pandora.connect(alice).approve(david.address, 50n * 10n ** 17n)

    expect(await pandora.getApproved(4)).to.equal(david.address)
    await pandora.connect(david).transferFrom(alice.address, carol.address, 4)
    await pandora.connect(david).transferFrom(alice.address, bob.address, 5)
    expect(await pandora.getApproved(4)).to.equal("0x0000000000000000000000000000000000000000")

    expect(await pandora.ownerOf(1)).to.equal(alice.address)
    expect(await pandora.ownerOf(2)).to.equal(alice.address)
    expect(await pandora.ownerOf(3)).to.equal(alice.address)
    expect(await pandora.ownerOf(4)).to.equal(carol.address)
    expect(await pandora.ownerOf(5)).to.equal(bob.address)
    expect(await pandora.balanceOf(alice.address)).to.equal(30n * 10n ** 17n)
    expect(await pandora.balanceOf(carol.address)).to.equal(10n * 10n ** 17n)
    expect(await pandora.balanceOf(bob.address)).to.equal(10n * 10n ** 17n)


    expect(await pandora.allowance(alice.address, david.address)).to.equal(50n * 10n ** 17n)
    await pandora.connect(david).transferFrom(alice.address, david.address, 10n * 10n ** 17n)
    expect(await pandora.allowance(alice.address, david.address)).to.equal(40n * 10n ** 17n)

    expect(await pandora.balanceOf(david.address)).to.equal(10n * 10n ** 17n)
    expect(await pandora.balanceOf(alice.address)).to.equal(20n * 10n ** 17n)

    await pandora.connect(david).transferFrom(alice.address, david.address, 15n * 10n ** 17n)
    expect(await pandora.allowance(alice.address, david.address)).to.equal(25n * 10n ** 17n)
    expect(await pandora.balanceOf(david.address)).to.equal(25n * 10n ** 17n)
    expect(await pandora.balanceOf(alice.address)).to.equal(5n * 10n ** 17n)

    await pandora.connect(david).transferFrom(alice.address, david.address, 5n * 10n ** 17n)
    expect(await pandora.allowance(alice.address, david.address)).to.equal(20n * 10n ** 17n)
    expect(await pandora.balanceOf(david.address)).to.equal(30n * 10n ** 17n)
    expect(await pandora.balanceOf(alice.address)).to.equal(0n * 10n ** 17n)

  })


})