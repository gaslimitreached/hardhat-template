// deploy/00_deploy_probably_nothing.ts
import * as ethers from 'ethers'

module.exports = async ({ getNamedAccounts, deployments }: any) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  await deploy('ProbablyNothing', {
    from: deployer,
    args: [
      2, // max supply
      ethers.utils.parseEther('0.04') // price 0.04 ether
    ],
    log: true
  })
}

module.exports.tags = ['ProbablyNothing']
