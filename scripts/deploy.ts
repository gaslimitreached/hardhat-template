import { run, ethers } from 'hardhat'

async function main () {
  await run('compile')
  const Contract = await ethers.getContractFactory('ProbablySomething')
  const contract = await Contract.deploy()
  console.log(contract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
