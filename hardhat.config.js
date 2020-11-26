require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");

// This is a sample Hardhat task. To learn how to create your own go to https://hardhat.org/guides/create-task.html

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

//npx hardhat balance --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async taskArgs => {
    const account = web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await web3.eth.getBalance(account);

    console.log(web3.utils.fromWei(balance, "ether"), "ETH");
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const privateKey1 = ""
const privateKey2 = ""
module.exports = {
  // defaultNetwork: "rinkeby",
  // networks: {
  //   hardhat: {
  //   },
  //   rinkeby: {
  //     url: "https://rinkeby.infura.io/v3/34d79804349241d8a6bbfb1351e33a62",
  //     accounts: [privateKey1, privateKey2]
  //   }
  // },
  solidity: {
    version: "0.7.5",
    settings: {
      optimizer: {
        enabled: false,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
};

