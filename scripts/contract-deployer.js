const hre = require("hardhat");



async function main() {
    
const Marketplace = await hre.ethers.getContractFactory("BeanzMarketplace");
const marketplace = await Marketplace.deploy();

// const Beanz = await hre.ethers.getContractFactory("CoolBeanz");
// const beanz = await Beanz.deploy("https://ikzttp.mypinata.cloud/ipfs/QmPZKyuRw4nQTD6S6R5HaNAXwoQVMj8YydDmad3rC985WZ/");

const BeanzStaking = await hre.ethers.getContractFactory("BeanzStaking");
const beanzStaking = await BeanzStaking.deploy();

// const NutToken = await hre.ethers.getContractFactory("Nutritions");
// const nutToken = await NutToken.deploy();


// beanz.deployed();
marketplace.deployed();
beanzStaking.deployed();
// nutToken.deployed();

console.log("Marketplace deployed at: "+ marketplace.address)
// console.log("CoolBeanz deployed at: "+ beanz.address)
console.log("BeanzStaking deployed at: "+ beanzStaking.address)
// console.log("NUT Token deployed at: "+ nutToken.address)

}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});