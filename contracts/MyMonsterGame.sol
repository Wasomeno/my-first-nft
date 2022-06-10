// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

contract Minigame {

    uint monsterPopulation = 0;
    uint creationCooldown = 1 minutes;
    uint missionCooldown = 5 minutes;
    uint feedingFee = 0.0001 ether;
    uint nonce = 0;
    
    struct Monster {
        string name;
        uint level;
        string element;
        uint hunger;
        uint experience;
        uint experienceCap;
        uint missionDuration;
        uint cooldown;
        // uint status;
    }

    struct Rarity {
        string name;
        uint chance;
    }

    struct Loot {
        string name;
        Rarity rarity;
    }

    struct Inventory {
        Loot loot;
        uint quantity;
    }

    Monster[] public monsters;
    Rarity[] public rarities;
    Loot[] public loots;
    Inventory[] public inventories;
    // uint[] public initialInventory;

    mapping(uint => address) public monsterToOwner;
    mapping(uint => address) public inventoryToAddress;
    mapping(address => uint) public addressToInventory;
    // mapping(address => uint) public test;
    // mapping(address => uint) public ownerToMonster;

    function createMonster (string memory _name) public{
        string memory _element;
        uint rng = randomNumber();
        
        if(rng < 33) {
            _element = "Fire";
        } else if (rng <= 66 && rng > 33) {
            _element = "Water";
        } else if (rng <= 99 && rng > 66) {
            _element = "Earth";
        }

        monsters.push(Monster(_name, 1, _element, 50, 0, 15, 0, (block.timestamp + creationCooldown)));
        uint _monsterId = monsters.length - 1;
        monsterToOwner[_monsterId] = msg.sender;
        monsterPopulation++;
    }

    function createRarity(string memory _name, uint _chance) public {
        rarities.push(Rarity(_name, _chance));
    }

    function lootCreation(string memory _name, Rarity memory _rarity) internal{
        loots.push(Loot(_name, _rarity));
    }

    function createLoot(string memory _name, uint _rarity) public {
        Rarity storage rarity = rarities[_rarity];
        lootCreation(_name, rarity);
    }

    function getLootRarity(uint _lootId) public view returns(string memory) {
        Loot storage loot = loots[_lootId];
        return loot.rarity.name;
    }

    function giveLoot(uint _lootId, uint _missionDuration) internal {
        Loot storage loot = loots[_lootId];
        uint quantity = _missionDuration / 4 weeks / 100;
        if(randomNumber() <= loot.rarity.chance) {
            inventories.push(Inventory(loot, quantity));
            uint inventoryId = inventories.length - 1;
            inventoryToAddress[inventoryId] = msg.sender;
            addressToInventory[msg.sender]++;
        }
    }

    function getRewards(uint _idMonster) public {
        Monster storage myMonster = monsters[_idMonster];
        // require(myMonster.missionDuration <= block.timestamp, "Duration not over yet");
        uint missionExp = 2;
        uint duration = myMonster.missionDuration - block.timestamp;
        uint expEarned = missionExp * duration /10;
        myMonster.experience = myMonster.experience + expEarned;
        giveLoot(0, myMonster.missionDuration);
        triggerCooldown(myMonster);
        monsterLevelUp(_idMonster);
    }

    function getInventory() public view returns(Inventory[] memory) {
        Inventory[] memory result = new Inventory[](addressToInventory[msg.sender]);
        uint counter = 0;
        for (uint i = 0; i < inventories.length; i++) {
            Inventory memory myInventory = inventories[i];
            if (inventoryToAddress[i] == msg.sender) {
                result[counter] = myInventory;
                counter++;
            }
        }
        return result;
    }

    function monsterReady (Monster memory _monster) public view returns(bool){
       return (_monster.cooldown <= block.timestamp);
    }

    function triggerCooldown(Monster storage _monster) internal {
        _monster.cooldown = block.timestamp + missionCooldown;
        _monster.missionDuration = 0;
    }

    function feedMonster (uint _idMonster, uint _foodAmount) public payable{
        require(msg.value == feedingFee * monsters[_idMonster].level * _foodAmount, "Not enough ether");
        Monster storage myMonster = monsters[_idMonster];
        require (myMonster.hunger < 100, "Your monster hunger is full");
        require(_foodAmount + myMonster.hunger <= 100, "Too much food for your monster");
        myMonster.hunger = _foodAmount + myMonster.hunger;
    }

    function monsterMission (uint _idMonster, uint _duration) public {
        Monster storage myMonster = monsters[_idMonster];
        uint missionHunger = myMonster.hunger - (_duration * 60 / 15 seconds / myMonster.level);
        require(monsterToOwner[_idMonster] == msg.sender, "It's not your monster");
        // require(myMonster.missionDuration == 0, "Your monster is still on a mission");
        // require(monsterReady(myMonster), " Your monster still on cooldown");
        require(myMonster.hunger >= missionHunger, "Not enough hunger");
        myMonster.hunger = missionHunger;
        myMonster.missionDuration = _duration * 60 + block.timestamp;
    }

    function monsterLevelUp(uint _idMonster) internal{
        // uint experienceCap = 15;
        // uint expPassed = 1;
        uint expCap = 15 + 8 * monsters[_idMonster].level;
        for (uint expPassed = 1; expPassed < 6 ; expPassed++) {
            if(monsters[_idMonster].experience >= monsters[_idMonster].experienceCap + expCap) {
                monsters[_idMonster].level++;
                monsters[_idMonster].experience = monsters[_idMonster].experience - monsters[_idMonster].experienceCap;
                monsters[_idMonster].experienceCap = 15 + 8 * monsters[_idMonster].level;
                // monsters[_idMonster].experienceCap = monsters[_idMonster].experienceCap * expPassed;
            }
        }
        

        // if(monsters[_idMonster].experience >= monsters[_idMonster].experienceCap) {
        //     monsters[_idMonster].level++;
        //     monsters[_idMonster].experience = monsters[_idMonster].experience - monsters[_idMonster].experienceCap;
        //     monsters[_idMonster].experienceCap = 15 + 8 * monsters[_idMonster].level;
        // }
    }

    function randomNumber () internal returns(uint){
        uint number = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % 100;
        nonce ++;
        return number;
    }

    function getLootsLength() public view returns(uint) {
        return loots.length;
    }

    function getMonstersLength() public view returns(uint) {
        return monsters.length;
    }
    
    

}