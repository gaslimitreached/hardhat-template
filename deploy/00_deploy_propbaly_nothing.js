// deploy/00_deploy_probably_nothing.js
const { utils: { parseEther }} = require('ethers');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('ProbablyNothing', {
    from: deployer,
    args: [
      2, // max supply
      parseEther('0.04'), // price 0.04 ether
    ],
    log: true,
  });
}

module.exports.tags = ['ProbablyNothing'];
