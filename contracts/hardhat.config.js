require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks:{
    mumbai:{
      url: 'https://polygon-mumbai.g.alchemy.com/v2/PDm6T9vGwGPJ_b8pseDNqfVTnSppVWrj',
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
    scrollAlpha: {
      url: "https://alpha-rpc.scroll.io/l2" || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }


  }
};
