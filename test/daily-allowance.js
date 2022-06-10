const { helperNameMap } = require("@vue/compiler-core");
const { expect } = require("chai");
const { ethers,waffle } = require("hardhat");

describe("Contract Creation", () => {
    let DailyAllowance, dailyAllowance, owner, customer1;

    beforeEach(async () => {
        DailyAllowance = await ethers.getContractFactory("DailyAllowance");
        dailyAllowance = await DailyAllowance.deploy();
        [owner, customer1] = await ethers.getSigners();
    });
    

    describe("Tabung", () => {
        it("Should return contract ether value equals to ether value sent", async () => {
            const nominal = {value: ethers.utils.parseEther("2")};
    
            await dailyAllowance.connect(customer1).tabung(nominal);
    
            const allowanceBigInt = await dailyAllowance.connect(customer1).allowance(customer1.address);
            const contractBigInt = await waffle.provider.getBalance(dailyAllowance.address);
            const allowance = ethers.utils.formatUnits(allowanceBigInt, "ether");
            const contract = ethers.utils.formatEther(contractBigInt);   
            
            expect(allowance).to.equal(contract);
        });
    });

    describe("Get Daily Allowance", () => {
        it("Should send daily allowance to customer and reduce their allowance", async () => { 
            const nominal = {value: ethers.utils.parseEther("2")};
    
            await dailyAllowance.connect(customer1).tabung(nominal);
            
            await dailyAllowance.connect(customer1).getDailyAllowance();

            const newAllowanceBigInt = await dailyAllowance.connect(customer1).allowance(customer1.address);
            const newAllowance = ethers.utils.formatEther(newAllowanceBigInt);

            const customerAllowanceBigInt = await dailyAllowance.connect(customer1).dailyAllowance(customer1.address);
            const customerAllowance = ethers.utils.formatEther(customerAllowanceBigInt);

            expect(newAllowance).to.equal((2 - customerAllowance).toString());
        });
    })
});