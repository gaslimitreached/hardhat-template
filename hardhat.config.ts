import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-deploy';
import 'hardhat-gas-reporter';
import 'hardhat-tracer';
import 'solidity-coverage';

import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: { chainId: 1337 },
  },
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
    },
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 77,
    coinmarketcap: process.env.CMC_KEY
  },
  namedAccounts: {
    deployer: {
      default: 0, // take first account as deployer
    }
  }
};

export default config;
