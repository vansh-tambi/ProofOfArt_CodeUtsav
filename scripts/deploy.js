const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners();
  
  if (signers.length === 0) {
    throw new Error(
      "No signers found. Please set PRIVATE_KEY in your .env file.\n" +
      "Example: PRIVATE_KEY=your_private_key_here"
    );
  }

  const [deployer] = signers;
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    throw new Error("Account has no balance. Please fund your account with testnet ETH.");
  }

  const HelloWorld = await hre.ethers.getContractFactory("HelloWorld", deployer);
  const hello = await HelloWorld.deploy();

  await hello.waitForDeployment();
  console.log("Contract deployed at:", await hello.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

