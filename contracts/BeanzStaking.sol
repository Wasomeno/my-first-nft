// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./INUT.sol";
import "./IBEANZ.sol";

contract BeanzStaking is IERC721Receiver{
    IERC721 public beanz;
    IERC20 public nutToken;
    INUT public nutInterface;
    IBEANZ public beanzCustomize;


    struct Staked {
        uint stakeTimeStamp;
        address beanzOwner;
    }

    uint dailyReward = 10;
    uint minAdventureDurations = 1 days;

    address private beanzAddress;
    address private nutAddress;

    mapping(uint => Staked) public stakedBeanz;
    mapping(address => uint[]) public addressToStaked;
    mapping(address => uint) public stakedArrayLength;

    function setInterface(address _beanzContract, address _nutToken) public{
        beanz = IERC721(_beanzContract);
        nutToken = IERC20(_nutToken);
        nutInterface = INUT(_nutToken);
        beanzCustomize = IBEANZ(_beanzContract);

        beanzAddress = _beanzContract;
        nutAddress = _nutToken;
    }

    function beanzAdventure(uint _tokenId) public {
        require(beanz.ownerOf(_tokenId) == msg.sender, "You are not the owner of this beanz");
        beanz.safeTransferFrom(msg.sender, address(this), _tokenId,"");
        beanzCustomize.deleteBeanzFromOwner(_tokenId);
        stakedBeanz[_tokenId] = Staked(block.timestamp, msg.sender);
        addressToStaked[msg.sender].push(_tokenId);
        stakedArrayLength[msg.sender] = stakedArrayLength[msg.sender] + 1;
    }

    function beanzGoHome(address _user, uint _tokenId) public {
        // require(stakedBeanz[_tokenId].stakeTimeStamp + minAdventureDurations <= block.timestamp, "Does not met with minimum requirements");
        // require(stakedBeanz[_tokenId].beanzOwner == _user, "You are not the owner of this beanz");
        uint rewards = rewardsCalc(_tokenId);
        delete stakedBeanz[_tokenId];
        deleteBeanz(_tokenId, _user);
        beanzCustomize.addBeanzToOwner(_tokenId, _user);
        stakedArrayLength[msg.sender] = stakedArrayLength[msg.sender] - 1;

        beanz.safeTransferFrom(address(this), _user, _tokenId,"");
        nutInterface.mint(_user, rewards * 10 ** 18);
    }

    function beanzLevelUp(address _user, uint _tokenId) public {
        require(stakedBeanz[_tokenId].beanzOwner == _user, "You are not the owner of this beanz");
        uint beanzLevel = beanzCustomize.getBeanzLevel(_tokenId);
        uint amount = beanzLevel * 60;
        require(nutToken.balanceOf(_user) > amount, "You don't have enough NUT to level up your beanz");
        nutInterface.levelUp(amount);
        beanzCustomize.beanzLevelUp(_tokenId);
    }

    function rewardsCalc(uint _tokenId) internal returns(uint){
        uint durations = block.timestamp - stakedBeanz[_tokenId].stakeTimeStamp;
        uint beanzLevel = beanzCustomize.getBeanzLevel(_tokenId);
        uint rewards = beanzLevel * durations * dailyReward / 1 days;

        return rewards;
    }

    function deleteBeanz(uint _tokenId, address _to) internal{
        uint index;
        for(uint i; i < stakedArrayLength[_to]; i++) {
            if(addressToStaked[_to][i] == _tokenId) {
                index = i;
            }
        }
        addressToStaked[_to][index] = addressToStaked[_to][stakedArrayLength[_to] - 1];
        addressToStaked[_to].pop();
    }


    function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
      return IERC721Receiver.onERC721Received.selector;
    }
}