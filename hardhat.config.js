require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');
require('hardhat-gas-reporter');
require('solidity-coverage');


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
module.exports = {
  // defaultNetwork: "hardhat",
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: { chainId: 1337 },
  },
  solidity: {
    version: '0.8.10',
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000,
      },
    },
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: '100',
    coinmarketcap: process.env.CMC_KEY
  }
};
