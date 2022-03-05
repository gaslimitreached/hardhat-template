import * as dotenv from 'dotenv';
dotenv.config();
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-deploy';
import 'hardhat-gas-reporter';
import 'hardhat-tracer';
import 'solidity-coverage';

import { HardhatUserConfig } from 'hardhat/config';

// default values are there to avoid failures when running tests
const RINKEBY_RPC = process.env.RIKENBY_RPC || '1'.repeat(32);
const PRIVATE_KEY = process.env.PRIVATE_KEY || '1'.repeat(64);

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: { chainId: 1337 },
    rinkeby: {
      url: RINKEBY_RPC,
      accounts: [PRIVATE_KEY],
    }
  },
  solidity: {
    version: '0.8.10',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 77,
    // API key for CoinMarketCap. https://pro.coinmarketcap.com/signup
    coinmarketcap: process.env.CMC_KEY ?? '',
  },
  etherscan: {
    // API key for Etherscan. https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY ?? '',
  },
  namedAccounts: {
    deployer: {
      default: 0, // take first account as deployer
    }
  }
};

export default config;
