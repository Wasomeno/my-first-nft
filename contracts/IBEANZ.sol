// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "./BeanzNft.sol";

interface IBEANZ {
    function beanzLevelUp(uint _tokenId) external;
    function getBeanzLevel(uint _tokenId) external returns(uint);
    function deleteBeanzFromOwner(uint _tokenId) external;
    function addBeanzToOwner(uint _tokenId, address _to) external;
}

