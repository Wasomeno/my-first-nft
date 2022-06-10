// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

// let owner, customer1, customer2;

async function getBalance(address) {
  const balance = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balance);
}

async function printBalances(addresses) {
  let idx = 0;
  for(const address of addresses) {
    console.log("Address "+ idx + " balance: " + await getBalance(address));
    idx++;
  }
}

async function main() {

  const[owner, customer1, customer2] = await hre.ethers.getSigners();

  const DailyAllowance = await hre.ethers.getContractFactory("DailyAllowance");
  const dailyAllowance = await DailyAllowance.deploy();

  await dailyAllowance.deployed();

  console.log("Daily Allowance deployed to:", dailyAllowance.address);

  const addresses = [owner.address, customer1.address, customer2.address];
  console.log("=== Starting States ===");

  await printBalances(addresses);

  console.log("=== Tabung ===");

  const nominal = {value: hre.ethers.utils.parseEther("2")};
  await dailyAllowance.connect(customer1).tabung(nominal);
  await dailyAllowance.connect(customer2).tabung(nominal);

  await printBalances(addresses);

  console.log("Ether dalam kontrak : " + await getBalance(dailyAllowance.address));
  
  console.log("=== Detail Customer ===");

  const customerAllowance1 = await dailyAllowance.connect(customer1).allowance(customer1.address);
  const customerAllowance2 = await dailyAllowance.connect(customer2).allowance(customer2.address);
  const customerDaily1 = await dailyAllowance.connect(customer1).dailyAllowance(customer1.address);
  const customerDaily2 = await dailyAllowance.connect(customer2).dailyAllowance(customer2.address);


  console.log("Allowance Customer 1 :" + hre.ethers.utils.formatUnits(customerAllowance1, "ether") + " Ether");
  console.log("Allowance Customer 2 :" + hre.ethers.utils.formatUnits(customerAllowance2, "ether") + " Ether");
  console.log("Daily Reward Customer 1 :" + hre.ethers.utils.formatUnits(customerDaily1, "ether") + " Ether");
  console.log("Daily Reward Customer 2 :" + hre.ethers.utils.formatUnits(customerDaily2, "ether") + " Ether");

  console.log("=== Claiming Daily Allowance ===")
  
  await dailyAllowance.connect(customer1).getDailyAllowance();
  await dailyAllowance.connect(customer2).getDailyAllowance();

  const customerNewAllowance1 = await dailyAllowance.connect(customer1).allowance(customer1.address);
  const customerNewAllowance2 = await dailyAllowance.connect(customer2).allowance(customer2.address);

  console.log("Allowance Customer 1 :" + hre.ethers.utils.formatUnits(customerNewAllowance1, "ether") + " Ether");
  console.log("Allowance Customer 2 :" + hre.ethers.utils.formatUnits(customerNewAllowance2, "ether") + " Ether");
  await printBalances(addresses);
  console.log("Ether dalam kontrak : " + await getBalance(dailyAllowance.address));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
