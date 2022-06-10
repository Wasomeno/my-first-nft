const { Contract } = require("ethers");
const hre = require("hardhat");


async function getBeanz(beanz) {
    for(let arrBeanz = 0; arrBeanz < beanz.length; arrBeanz++) {
        let beanzToOwner = hre.ethers.utils.formatUnits(beanz[arrBeanz], 0);
        // let beanzToOwner = hre.ethers.utils.BigNumber.toNumber();
        console.log(arrBeanz + 1 + ". Cool Beanz "+ beanzToOwner);
    }
}
// async function getBalance(address) {
//   const balance = await hre.waffle.provider.getBalance(address);
//   return hre.ethers.utils.formatEther(balance);
// }

async function main() {

    const[owner, user1, user2] = await hre.ethers.getSigners();

    const Beanz = await hre.ethers.getContractFactory("CoolBeanz");
    const beanz = await Beanz.deploy("https://ikzttp.mypinata.cloud/ipfs/QmPZKyuRw4nQTD6S6R5HaNAXwoQVMj8YydDmad3rC985WZ/");

    // const Marketplace = await hre.ethers.getContractFactory("BeanzMarketplace");
    // const marketplace = await Marketplace.deploy();
    const BeanzStaking = await hre.ethers.getContractFactory("BeanzStaking");
    const beanzStaking = await BeanzStaking.deploy();

    const NutToken = await hre.ethers.getContractFactory("Nutritions");
    const nutToken = await NutToken.deploy();

    await beanz.deployed();
    // await marketplace.deployed();
    await nutToken.deployed();
    await beanzStaking.deployed();

    await beanzStaking.connect(owner).setInterface(beanz.address, nutToken.address);

    // await marketplace.connect(owner).setInterface(beanz.address);

    console.log("Cool Beanz deployed at: "+ beanz.address);
    console.log("BeaznStaking deployed at: "+ beanzStaking.address);
    console.log("Nutritions Token deployed at: "+ nutToken.address);
    console.log("");


    // const nutBalance = await nutToken.balanceOf(owner.address);
    // const nutContract = await nutToken.balanceOf(nutToken.address);

    // console.log("Nut Owner balance: " + hre.ethers.utils.formatEther(nutBalance));
    // console.log("Nut Contract balance: " + hre.ethers.utils.formatEther(nutContract));
    
    console.log("=== CoolBeanz Minting ===");
    console.log("Minting Some Coolbeaanz.....");

    
    // await beanz.connect(user1).createBeanz(3, {value: hre.ethers.utils.parseEther((3 * mintPrice).toString())});
    // await beanz.connect(owner).startAuction(1);

    const mintPriceBigInt = await beanz.price();
    const mintPrice = hre.ethers.utils.formatEther(mintPriceBigInt);

    await beanz.connect(owner).createBeanz(3, {value: hre.ethers.utils.parseEther((3 * mintPrice).toString())});
    await beanz.connect(user1).createBeanz(2, {value: hre.ethers.utils.parseEther((3 * mintPrice).toString())});

    
    // console.log("=== Balance Before Transaction ===");
    // console.log("Balance Owner: " + await getBalance(owner.address));
    // console.log("Balance User 1: " + await getBalance(user1.address));
    // console.log("Balance User 2: " + await getBalance(user2.address));

    // console.log("");

    let ownerBeanz = await beanz.getBeanzOwner(owner.address)
    let user1Beanz = await beanz.getBeanzOwner(user1.address);

    console.log("Beanz owned by Owner: " + ownerBeanz);
    console.log(user1Beanz ? "Beanz owned by User 1: 0" : user1Beanz);

    // await beanz.connect(owner).approve(marketplace.address, 1);
    // await marketplace.connect(owner).sellBeanz(1, 1);

    // let beanzOnSale = await marketplace.currentOnSale();

    // console.log("Beanz on Sale: " + beanzOnSale);

    // await marketplace.connect(user1).buyBeanz(1, user1.address, {value: hre.ethers.utils.parseEther((1).toString())})

    // const user1BeanzAfter = await beanz.getBeanzOwner(user1.address);
    // console.log("Beanz owned by User 1: Beanz #"+ user1BeanzAfter);

    // const beanzOnSaleAfter = await marketplace.currentOnSale();
    // console.log("Beanz on Sale After Buying: " + beanzOnSaleAfter);

    // console.log("");
    // console.log("=== Balance After Transaction ===");
    // console.log("Balance Owner: " + await getBalance(owner.address));
    // console.log("Balance User 1: " + await getBalance(user1.address));
    // console.log("Contract Balance: " + await getBalance(marketplace.address));


    console.log("=== Balance of CoolBeanz Owner ===");
    
    const balance  = await beanz.balanceOf(user1.address);
    const Ownerbalance  = await beanz.balanceOf(owner.address);

    
    // let user1Beanz = await beanz.getBeanzOwner(user1.address);
    

    console.log("User 1 : "+ balance + " CoolBeanz");
    // console.log(await hre.ethers.utils.formatEther(user1Beanz));
    await getBeanz(user1Beanz);
    console.log("Owner : "+ Ownerbalance + " CoolBeanz");
    await getBeanz(ownerBeanz);
    console.log("");

    // // await beanz.setApprovalForAll(beanzStaking.address, true);
    // // console.log(await beanz.connect(owner).isApprovedForAll(owner.address, beanzStaking.address));

    console.log("=== Cool Beanz Staking ===");
    console.log("Sending beanz to adventure....");
    
    await beanz.connect(user1).approve(beanzStaking.address, 3);
    await beanz.connect(owner).approve(beanzStaking.address, 1);
    await beanzStaking.connect(owner).beanzAdventure(1);
    await beanzStaking.connect(user1).beanzAdventure(3);

    const staked = await beanzStaking.addressToStaked(owner.address,0);
    const countStaked = await beanzStaking.stakedArrayLength(owner.address);

    console.log("Owner Staked: Beanz #" +staked);
    console.log("How many beanz Owner Staked: " +countStaked);
    console.log("");
    console.log("=== Cool Beanz Returns From Adventure ===");

    await beanzStaking.connect(owner).beanzGoHome(owner.address, 3);
    await beanzStaking.connect(user1).beanzGoHome(user1.address, 1);

    // const stakedAfter = await beanzStaking.addressToStaked(owner.address,0);
    const countStakedAfter = await beanzStaking.stakedArrayLength(owner.address);
    // console.log("Owner Staked: " +stakedAfter.data);
    
    console.log("How many beanz Owner Staked: " +countStakedAfter);

    // const nutBalanceOwner = await nutToken.balanceOf(owner.address);
    // const nutBalanceUser1 = await nutToken.balanceOf(user1.address);

    // console.log("1. Owner NUT coin balance: " + hre.ethers.utils.formatEther(nutBalanceOwner));
    // console.log("2. User 1 NUT coin balance: " + hre.ethers.utils.formatEther(nutBalanceUser1));

    // console.log("=== Get CoolBeanz Metadata ===");
    // const tokenURI = await beanz.tokenURI(10);
    // console.log(tokenURI);

    
    



    // console.log(mintPriceBigInt);





}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});