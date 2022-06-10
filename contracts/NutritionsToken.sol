// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Nutritions is ERC20{
    constructor() ERC20("Nutritions", "NUT") {
        _mint(msg.sender, 1000000 * 10 ** 18);
        approve(msg.sender, 750000 * 10 ** 18);
        transferFrom(msg.sender, address(this) , 750000 * 10 ** 18);
    }

    function mint(address _user, uint _amount) public {
        _mint(_user, _amount);
    }

    function levelUp(uint _amount) public {
        _burn(address(this), _amount);
    }
}