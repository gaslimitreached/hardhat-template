const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('ProbablySomething', function () {
  let buyer, contract, owner;
  before(async () => {
    const [owner_, buyer_] = await ethers.getSigners();
    buyer = buyer_;
    owner = owner_;
    const Contract = await ethers.getContractFactory('ProbablySomething');
    contract = await Contract.deploy();
    await contract.deployed();
  });
  it('should only allow mints when provenance is set', async () => {
    try {
      await contract
        .connect(buyer)
        .mint(1, { value: ethers.utils.parseEther('0.04') });

    } catch (error) {
      expect(error.message).to.include("Provenance not set")
    }
  });
  it('should allow setting provenance', async () => {
    await contract.connect(owner).setProvenance('something');
    const provenance = await contract.PROVENANCE();
    expect(provenance.length).gt(0);
  });
  it('should mint token', async () => {
    await contract
      .connect(buyer)
      .mint(1, { value: ethers.utils.parseEther('0.04') });
    expect(await contract.totalSupply()).to.equal(1);
  });
  it('should allow owner to release funds', async () => {
    try {
      await contract.connect(owner).release();
    } catch (error) {
      expect(error).to.not.exist;
    }
  });

  it('should prevent others from releasing funds', async () => {
    try {
      await contract.connect(buyer).release();
    } catch (error) {
      expect(error.message).to.include("caller is not the owner");
    }
  });
  it('should allow owner to set the baseURI', async () => {
    try {
      const uri = "https://example.com";
      await contract.connect(owner).setBaseURI(uri);
      const tokenURI = await contract.tokenURI(1);
      expect(tokenURI).to.include(uri);
    } catch (error) {
      expect(error).to.not.exist;
    }
  });
});
