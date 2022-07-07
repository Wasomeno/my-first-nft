// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract CoolBeanz is ERC721Enumerable, Ownable {

    using Strings for uint;

    struct Auction {
        bool status;
        uint duration;
        uint startTime;
    }

    struct Beanz {
        uint level;
    }

    string private _baseTokenURI;
    uint public price = 0.02 ether;
    uint private currentSupply; 
    uint public currentWhitelisted;

    uint public startingPrice = 0.05 ether;
    uint public pricedroprate = 0.01 ether;
    uint public minimalPrice = 0.01 ether;
    

    Auction auctionDetails;

    mapping(address => bool) public whitelisted;
    mapping(uint => address) public beanzToOwner;
    mapping(uint => Beanz) public beanzLevel;


    constructor (string memory baseURI) ERC721("Cool Beanz", "CBZ") {
        setBaseURI(baseURI);
    }

    function createBeanz(uint _quantity) external payable{
        // require(auctionDetails.status == true, "Auction has not started");
        require(_quantity <= 3, "You can't mint more than 3 CoolBeanz");
        require(_quantity + currentSupply <= 5555, "You mint too many");
        require(msg.value >= price * _quantity, "Wrong value of ether");

        for(uint i; i < _quantity; ++i) {
            _safeMint(msg.sender, currentSupply);
            beanzToOwner[currentSupply] = msg.sender;
            beanzLevel[currentSupply] = Beanz(1);
            uint current = currentSupply;
            current++;
            currentSupply = current;
        }
    }

    function beanzLevelUp(uint _tokenId) public {
        uint level = beanzLevel[_tokenId].level;
        beanzLevel[_tokenId].level = level + 1;
    }

    function getBeanzLevel(uint _tokenId) external view returns(uint level){
        level = beanzLevel[_tokenId].level;
    }

    function getPrice() public view returns(uint){
        require(auctionDetails.status, "Auction has not started");
        uint timepassed = block.timestamp - auctionDetails.startTime;
        uint timepassedrate = timepassed / (auctionDetails.duration / 4);
        uint pricerate = timepassedrate * pricedroprate;
        uint mintprice = startingPrice - pricerate;
        uint auctionDuration = auctionDetails.startTime + auctionDetails.duration;
        if(auctionDuration > block.timestamp) {
            return mintprice;
        } else if(pricerate >= startingPrice) {
            return minimalPrice;
        }else {
            return minimalPrice;
        }
        return minimalPrice;
    }

    function setWhitelist(address[] calldata _address) external onlyOwner{
        uint length = _address.length;
        for(uint i; i < length ; ++i) {
            address whitelist = _address[i];
            whitelisted[whitelist] = true;
            currentWhitelisted ++;
        }
    }

    function startAuction(uint _duration) external onlyOwner {
        require(_duration <= 6 || _duration > 0 , "Auction time can't be above 6 hours");
        auctionDetails.status = true;
        auctionDetails.duration = _duration * 3600;
        auctionDetails.startTime = block.timestamp;
    }

    function getBeanzOwner(address _to) external view returns (uint[] memory beanzs){
        uint array = 0;
        beanzs = new uint[](balanceOf(_to));
        uint supply = currentSupply;
        for(uint idBeanz; idBeanz < supply; ++idBeanz){
            address owner = beanzToOwner[idBeanz];
            if (owner == _to) {
                beanzs[array] = idBeanz;
                array++;
            }
        }
    }

    function deleteBeanzFromOwner(uint _tokenId) public{
        delete beanzToOwner[_tokenId];
    }

    function addBeanzToOwner(uint _tokenId, address _to) public{
        beanzToOwner[_tokenId] = _to;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    receive() external payable{

    }   
}