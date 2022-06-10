// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./IBEANZ.sol";

contract BeanzMarketplace is IERC721Receiver, Ownable{

    IERC721 public beanz;
    IBEANZ public beanzInterface;

    struct onSale {
        uint price;
        address owner;
    }

    uint public currentOnSale = 0;

    uint[] public beanzId;

    mapping(uint => onSale) public beanzOnSale;

    function setInterface(address _beanzAddress) public onlyOwner{
        beanz = IERC721(_beanzAddress);
        beanzInterface = IBEANZ(_beanzAddress);
    }

    function sellBeanz(uint _tokenId, uint _price) public {
        beanzInterface.deleteBeanzFromOwner(_tokenId);
        beanzOnSale[_tokenId] = onSale(_price, msg.sender);
        beanz.safeTransferFrom(msg.sender, address(this), _tokenId, "");
        beanzId.push(_tokenId);
        currentOnSale ++;
    }

    function buyBeanz(uint _tokenId, address _to) public payable{
        require(beanzOnSale[_tokenId].owner != _to, "You can't buy your own beanz");
        require(msg.value >= beanzOnSale[_tokenId].price, "Wrong price");
        beanz.safeTransferFrom(address(this), msg.sender, _tokenId, "");
        beanzInterface.addBeanzToOwner(_tokenId, _to);

        uint tax = msg.value / 5;
        uint priceOnTax = (msg.value - tax);

        (bool sent, bytes memory data) = beanzOnSale[_tokenId].owner.call{value: priceOnTax}("");
        require(sent, "Ether not sent");

        delete beanzOnSale[_tokenId];
        deleteBeanz(_tokenId);
        
        currentOnSale = currentOnSale - 1;
    }

    function deleteBeanz(uint _tokenId) internal{
        uint index;
        for(uint i; i < beanzId.length; i++) {
            if(beanzId[i] == _tokenId) {
                index = i;
            }
        }
        beanzId[index] = beanzId[beanzId.length - 1];
        beanzId.pop();
    }

    function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
      return IERC721Receiver.onERC721Received.selector;
    }

    receive() external payable{

    }   
}