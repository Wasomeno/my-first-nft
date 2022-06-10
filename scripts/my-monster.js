const hre = require("hardhat");


async function main() {
    const [owner, player1, player2] = await hre.ethers.getSigners();

    const MonsterGame = await hre.ethers.getContractFactory("Minigame");
    const monsterGame = await MonsterGame.deploy();

    await monsterGame.deployed();

    console.log("Monster Game deployed at : ", monsterGame.address);

    console.log("=== Creating Rarity and Item ===");

    await monsterGame.connect(owner).createRarity("Common", "80");
    await monsterGame.connect(owner).createRarity("Rare", "40");
    await monsterGame.connect(owner).createRarity("Epic", "20");
    await monsterGame.connect(owner).createLoot("Fish", "0");
    await monsterGame.connect(owner).createLoot("Head of Kraken", "1");
    await monsterGame.connect(owner).createLoot("Armour of Piorev", "2");

    
    // const Loots = await monsterGame.loots();
    // const Loots = [await monsterGame.loots()];
    const lootLength = await monsterGame.getLootsLength();
    for(let idLoot = 0; idLoot < lootLength; idLoot++) {
        const Loots = await monsterGame.loots(idLoot);
        console.log((idLoot + 1)+ ". " + Loots.name +" ("+ Loots.rarity.name +")");
    }

    console.log("=== Mint Monster ==");

    await monsterGame.connect(player1).createMonster("Monster 1");
    await monsterGame.connect(player2).createMonster("Monster 2");
    await monsterGame.connect(owner).createMonster("Monster 69");

    const monstersLength = await monsterGame.getMonstersLength();
    for(let idMonster = 0; idMonster < monstersLength; idMonster++) {
        const Monsters = await monsterGame.monsters(idMonster);
        console.log((idMonster + 1) + ". " + Monsters.name + " Hunger: " + Monsters.hunger + " Exp: " + Monsters.experience + " (" + Monsters.element + ") ");
    }

    console.log("=== Monster Mission ===");
    console.log("Sending monster on a mission.....");

    await monsterGame.connect(player1).monsterMission("0", "7");
    await monsterGame.connect(player2).monsterMission("1", "3");
    await monsterGame.connect(owner).monsterMission("2", "10");

    console.log("=== Monster Back from Mission ===");

    await monsterGame.connect(player1).getRewards("0");
    await monsterGame.connect(player2).getRewards("1");
    await monsterGame.connect(owner).getRewards("2");

    for(let idMonster = 0; idMonster < monstersLength; idMonster++) {
        const Monsters = await monsterGame.monsters(idMonster);
        console.log((idMonster + 1) + ". " + Monsters.name + " Hunger: " + Monsters.hunger + " Exp: " + Monsters.experience + " Exp Cap: "+ Monsters.experienceCap + " (" + Monsters.level + ") ");
    }

    console.log("=== Monster Feeding ===");

    const player1Fee = await monsterGame.monsters(0);
    const player2Fee = await monsterGame.monsters(1);
    const ownerFee = await monsterGame.monsters(2);

    const feedFee = 0.0001;
    // console.log((0.0001 * 4 * 9).toFixed(5));

    await monsterGame.connect(player1).feedMonster("0", "5", {value: hre.ethers.utils.parseEther((feedFee * player1Fee.level * 5).toFixed(5).toString())});
    await monsterGame.connect(player2).feedMonster("1", "8", {value: hre.ethers.utils.parseEther((feedFee * player2Fee.level * 8).toFixed(5).toString())});
    await monsterGame.connect(owner).feedMonster("2", "9", {value: hre.ethers.utils.parseEther((feedFee * ownerFee.level * 9).toFixed(5).toString())});

    for(let idMonster = 0; idMonster < monstersLength; idMonster++) {
        const Monsters = await monsterGame.monsters(idMonster);
        console.log((idMonster + 1) + ". " + Monsters.name + " Hunger: " + Monsters.hunger + " Exp: " + Monsters.experience + " (" + Monsters.element + ") ");
    }

    console.log("=== Player Inventory ===");

    const player1Inv = await monsterGame.connect(player1).getInventory();
    const player2Inv = await monsterGame.connect(player2).getInventory();
    const ownerInv = await monsterGame.connect(owner).getInventory();

    console.log("Player 1 loots in inventory: "+ player1Inv[0].loot.name + "( " + player1Inv[0].quantity + " )");
    console.log("Player 2 loots in inventory: "+ player2Inv[0].loot.name + "( " + player2Inv[0].quantity + " )");
    console.log("Owners loots in inventory: "+ ownerInv[0].loot.name + "( " + ownerInv[0].quantity + " )");
    

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });