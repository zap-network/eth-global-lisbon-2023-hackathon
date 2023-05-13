const hre = require("hardhat");

async function main() {
  const DevToken = await hre.ethers.getContractFactory("DevToken");
  const devToken = await DevToken.deploy();

  await devToken.issueToken("0x18e2CeE48035F4558Eb75a629C37d713EFC005c2", 100000000000);
  await devToken.deployed();

  console.log("Token deployed to:", devToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });