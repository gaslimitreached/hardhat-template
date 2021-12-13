const { expect } = require('chai');
const { deployments, ethers } = require('hardhat');

describe('ProbablyNothing', function () {
  let Contract;
  let deployer;
  let buyer;

  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners();

    await deployments.fixture();
    Contract = await deployments.get('ProbablyNothing');
    contract = await ethers.getContractAt(
      'ProbablyNothing',
      Contract.address,
      deployer,
    );
  });

  it('prevents minting unless provenance is set', async () => {
    const tx  = contract
        .connect(buyer)
        .mint(1, { value: ethers.utils.parseEther('0.04') });

    await expect(tx).to.be.revertedWith('Provenance not set');
  });

  it('allows setting provenance', async () => {
    await contract.connect(deployer).setProvenance('something');
    const provenance = await contract.provenance();
    expect(provenance.length).gt(0);
  });

  it('does not allow setting provenance more than once', async () => {
    await contract.connect(deployer).setProvenance('something');
    const tx = contract.connect(deployer).setProvenance('something-else');
    expect(tx).to.be.revertedWith('Provenance set');
  });

  it('mints a single token', async () => {
    await contract.connect(deployer).setProvenance('something');
    await contract
      .connect(buyer)
      .mint(1, { value: ethers.utils.parseEther('0.04') });

    expect(await contract.totalSupply()).to.equal(1);
  });

  it('prevents minting more than allowed', async () => {
    await contract.connect(deployer).setProvenance('something');
    const tx = contract
      .connect(buyer)
      .mint(3, { value: ethers.utils.parseEther('0.04') });

    await expect(tx).to.be.revertedWith('Invalid amount');
    expect(await contract.totalSupply()).to.equal(0);
  });

  it('prevents minting for less than cost', async () => {
    await contract.connect(deployer).setProvenance('something');
    const tx = contract
      .connect(buyer)
      .mint(1, { value: ethers.utils.parseEther('0.01') });

      expect(tx).to.be.revertedWith('Invalid value');
      expect(await contract.totalSupply()).to.equal(0);
  });

  it('prevents minting more than the max supply', async () => {
    await contract.connect(deployer).setProvenance('something');
    await contract
      .connect(buyer)
      .mint(2, { value: ethers.utils.parseEther('0.08') });

    const tx = contract
      .connect(buyer)
      .mint(1, { value: ethers.utils.parseEther('0.04') });

    await expect(tx).to.be.revertedWith('Exceeds max supply');
    expect(await contract.totalSupply()).to.equal(2);
  });

  it('allows owner to release funds', async () => {
    await contract.connect(deployer).setProvenance('something');
    // expect contract to have zero value
    expect(await ethers.provider.getBalance(contract.address)).eq(0);
    // mint w/ value
    await contract
      .connect(buyer)
      .mint(1, { value: ethers.utils.parseEther('0.04') });
    // expect contract value realized
    expect(await ethers.provider.getBalance(contract.address)).gt(0);
    // release funds
    await contract.connect(deployer).release();
    // expect contract to have zero value
    expect(await ethers.provider.getBalance(contract.address)).eq(0);
  });

  it('prevents others from releasing funds', async () => {
    const tx = contract.connect(buyer).release();
    await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it('allows owner to set the baseURI', async () => {
    await contract.connect(deployer).setProvenance('something');
    await contract
      .connect(buyer)
      .mint(1, { value: ethers.utils.parseEther('0.04') });
    
    const uri = "https://example.com";
    await contract.connect(deployer).setBaseURI(uri)
    expect(await contract.tokenURI(1)).to.include(uri);
  });

  it('does not allow setting the baseURI more than once', async () => {
      await contract.connect(deployer).setBaseURI('something');
      const tx = contract.connect(deployer).setBaseURI('something-else');
      await expect(tx).to.be.revertedWith('Already set');
  });
});
