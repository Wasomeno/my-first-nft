// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "./NutritionsToken.sol";

interface INUT {
    function mint(address _user, uint _amount) external;
    function levelUp(uint _amount) external;
}
