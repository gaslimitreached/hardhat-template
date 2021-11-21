const hre = require('hardhat')

async function main() {
  const Contract = await hre.ethers.getContractFactory('ProbablySomething')
  const contract = await Contract.deploy()
  console.log(contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
