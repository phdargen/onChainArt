// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./PathNFT.sol";
import "./ShapeNFT.sol";

contract RandomNFTMinter is Ownable, IERC721Receiver {
    PathNFT pathNFT;
    ShapeNFT shapeNFT;

    constructor(address path, address shape) Ownable(msg.sender) {
        pathNFT = PathNFT(payable(path));
        shapeNFT = ShapeNFT(payable(shape));
    }
    
    function mintAndTransfer(address recipient) external payable {

        // Generate pseudo-random number using block data
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 2;
        
        uint256 tokenId;
        if (random == 0) {
            // Mint PathNFT
            uint256 price = pathNFT.price();        
            require(msg.value == price, string.concat("Wrong price for PathNFT, should be ", Strings.toString(price)));
            tokenId = pathNFT.mintNFT{value: msg.value}();
            pathNFT.safeTransferFrom(address(this), recipient, tokenId);
        } else {
            // Mint ShapeNFT
            uint256 price = shapeNFT.price();        
            require(msg.value == price, string.concat("Wrong price for ShapeNFT, should be ", Strings.toString(price)));
            tokenId = shapeNFT.mintNFT{value: msg.value}();
            shapeNFT.safeTransferFrom(address(this), recipient, tokenId);
        }
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    // Withdraw ETH from the contract
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    receive() external payable {}
}
