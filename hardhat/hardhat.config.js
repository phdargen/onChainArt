require("@nomiclabs/hardhat-waffle");
require('hardhat-contract-sizer');
require("@nomicfoundation/hardhat-verify");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const { apiKey, apiKeyBaseSepolia, etherscanApiKey, mnemonic } = require('./secrets.json');

module.exports = {
  solidity: "0.8.20",
  networks: {
          sepolia: {
              url: `https://sepolia.infura.io/v3/${apiKey}`,
              accounts: { mnemonic: mnemonic },
              //timeout: 10000000
          },
          goerli: {
              url: `https://goerli.infura.io/v3/${apiKey}`,
              accounts: { mnemonic: mnemonic },
          },
          hardhat: {
              allowUnlimitedContractSize: true ,
              gasMultiplier: 2,
              blockGasLimit: 100_000_000
          },
          base: {
            url: "https://mainnet.base.org",
            accounts: { mnemonic: mnemonic },
          },
          baseSepolia: {
            url: apiKeyBaseSepolia,
            accounts: { mnemonic: mnemonic },
          },
          scrollSepolia: {
            url: "https://sepolia-rpc.scroll.io",
            accounts: { mnemonic: mnemonic },
          },
          scroll: {
            url: "https://rpc.scroll.io",
            accounts: { mnemonic: mnemonic },
          },
  },

  etherscan: {
    apiKey: {
      sepolia: etherscanApiKey,
    },
  },

  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    }
  },

};
