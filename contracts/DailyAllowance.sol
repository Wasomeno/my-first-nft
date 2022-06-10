// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract DailyAllowance{
    mapping (address => uint) public allowance;
    mapping (address => uint) public timer;
    mapping (address => uint) public dailyReward;
    // mapping (address => uint) public myReward;

    event AllowanceChanged(address indexed _who, address indexed _byWhom, uint _oldValue, uint _newValue );

    function tabung() public payable {
        require(msg.value > 0, "You can't send 0 eth");
        setAllowance(msg.sender, msg.value);
    }

    function setAllowance (address _who, uint _amount) private{
        emit AllowanceChanged(_who, msg.sender, allowance[_who], _amount);
        allowance[_who] = _amount;
        dailyReward[_who] = _amount;
        timer[_who] = block.timestamp;
    }

    function reduceAllowance (address _who, uint _amount) public {
        emit AllowanceChanged(_who, msg.sender, allowance[_who], allowance[_who] - (_amount));
        allowance[_who] += allowance[_who] - _amount;
    }

    function dailyAllowance(address _who) public view returns(uint) {
        return (dailyReward[_who] / 10);
    }

    function getDailyAllowance() public payable{
        require(dailyReward[msg.sender] > 0, "You haven't deposited");
        // require(timer[msg.sender] + 1 minutes <= block.timestamp, "Not the time");
        payable(msg.sender).transfer(dailyAllowance(msg.sender));
        reduceAllowance(msg.sender, dailyAllowance(msg.sender));
        // timer[msg.sender] = block.timestamp + 1 minutes;
    }


    receive() external payable{

    }
}