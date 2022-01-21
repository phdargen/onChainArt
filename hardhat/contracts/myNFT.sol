pragma solidity ^0.8.4;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ColorPalette.sol";
import "./SVG.sol";
import "./Helper.sol";
//import "hardhat/console.sol";

contract myNFT is ERC721, Ownable {

  using Strings for uint256;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  uint public constant PRICE = 0.0 ether;

	ColorPalette colorPaletteSet; 
  SVG svgMaker;

  // Events
  event newNFT(address minter, uint tokenId, bytes32 rnd, bytes3 color, uint chub);

  constructor(address color, address svg) public ERC721("Onchain Art", "OCA") {
    colorPaletteSet = ColorPalette(color);
    svgMaker = SVG(svg);    
  }

  mapping (uint256 => uint256) public rnd;

  function mintNFT() public payable returns (uint256)
  {
      require(msg.value == PRICE, "Wrong price");

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      rnd[id] = uint256(keccak256(abi.encodePacked(id, blockhash(block.number-1), msg.sender, address(this)))); 

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      
      string memory name = string(abi.encodePacked('RandomArt #',id.toString()));
      string memory description = string(abi.encodePacked('Onchain generative art'));
      
      string memory image = getSVG(id) ; 

      uint colorPaletteIndex = rnd[id] %  (colorPaletteSet.getPaletteSize());
      uint256 layers = Helper.expandRandom(rnd[id],0,15,25,1)[0];

      uint256[] memory figures = Helper.expandRandom(rnd[id],1,0,2,layers*3);
      uint boxes = 0;
      uint triangles = 0;
      uint circles = 0;

      for(uint i = 0; i < layers; i++){
          uint index = i;
          boxes += figures[index];

          index += layers;
          triangles += figures[index];

          index += layers;
          circles += figures[index];
        }

        string memory attributes = string(
            abi.encodePacked(
                 '", "attributes":[',
                '{"trait_type": "Color Palette","value":"',
                Helper.uint2str(colorPaletteIndex),
                '"},{"trait_type": "Layers","value":"',
                Helper.uint2str(layers),
                '"},{"trait_type": "Boxes","value":"',
                Helper.uint2str(boxes),
                '"},{"trait_type": "Triangles","value":"',
                Helper.uint2str(triangles),
                '"},{"trait_type": "Circles","value":"',
                Helper.uint2str(circles),
                '"}',
                "]}"
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;utf8,",
                    (
                        (
                            abi.encodePacked(
                                '{"name":"', name,
                                '","description":"', description,  
                                '","image": ',
                                '"',
                                "data:image/svg+xml;utf8,",
                                (abi.encodePacked(image)),
                                attributes
                            )
                        )
                    )
                )
            );
  }

  function getSVG(uint256 id) public view returns (string memory) {

    uint colorPaletteIndex = rnd[id] %  (colorPaletteSet.getPaletteSize());
    string[] memory colorPalette = colorPaletteSet.getColorpalette(colorPaletteIndex);

    return svgMaker.getSVG(rnd[id], colorPalette);
  }

}