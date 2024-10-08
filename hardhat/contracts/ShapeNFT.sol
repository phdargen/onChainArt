pragma solidity ^0.8.20;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ColorPalette.sol";
import "./ShapeSVG.sol";
import "./Helper.sol";
//import "hardhat/console.sol";

contract ShapeNFT is ERC721Enumerable, IERC2981, Ownable {

  using Strings for uint256;
  uint256 private _nextTokenId = 0;

  uint public price = 0.001 ether;
  uint16 public maxSupply = 10000;

  uint16 public royalty = 1000; // 10%
  address public royaltyAddress = address(this);

  mapping (uint256 => uint256) private rnd;

  ColorPalette colorPaletteSet; 
  ShapeSVG svgMaker;

  constructor(address color, address svg, address initialOwner) ERC721("Xonin Shapes", "XON") Ownable(initialOwner) {
    colorPaletteSet = ColorPalette(color);
    svgMaker = ShapeSVG(svg);    
  }

  function mintNFT() public payable returns (uint256){
      require(msg.value == price, "Wrong price");
      require(totalSupply() < maxSupply, "Sold out!");

      uint256 id = _nextTokenId++;
      _safeMint(msg.sender, id);

      rnd[id] = uint256(keccak256(abi.encodePacked(id, blockhash(block.number-1), msg.sender, address(this)))); 

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      _requireOwned(id);
      
      string memory name = string(abi.encodePacked('Xonin Shapes #',id.toString()));
      string memory description = string(abi.encodePacked('Xonin - A generative art collection featuring unique abstract designs of layered vivid curves and geometric shapes, crafted with 100 distinct color palettes. The artworks are created, rendered, and stored fully onchain to ensure immutability and permanence. Employed art style: Shapes. '));
      
      string memory image = getSVG(id) ; 

      uint colorPaletteIndex = rnd[id] %  (colorPaletteSet.getPaletteSize());
      uint layers = Helper.expandRandom(rnd[id],0,15,25,1)[0];
      uint256[] memory filter = Helper.expandRandom(rnd[id],9,0,6,4);

      uint[] memory figures = Helper.expandRandom(rnd[id],1,0,2,layers*3);
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
                '"},{"trait_type": "Filter","value":"',
                filter[3] > 3 ? "1" : "0",
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
    _requireOwned(id);

    uint colorPaletteIndex = rnd[id] %  (colorPaletteSet.getPaletteSize());
    bytes3[5] memory colorPalette = colorPaletteSet.getColorpalette(colorPaletteIndex);

    // console.log(colorPaletteIndex);
    // console.logBytes3(colorPalette[1]);
    // console.log(Helper.bytes3ToHexString(colorPalette[1]));
    return svgMaker.getSVG(rnd[id], colorPalette);
  }

  /// @dev Support for IERC-2981, royalties
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, IERC165) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
  }

  function royaltyInfo(uint256, uint256 _salePrice) public view override returns (address, uint256){
        return (royaltyAddress, (_salePrice * royalty) / 10000);
  }

  function setPrice(uint256 newPrice) external onlyOwner {
        price = newPrice;
  }

  function setRoyalty(uint16 _royalty) external onlyOwner {
        require(_royalty >= 0, "Royalty must be >= 0%");
        require(_royalty <= 1000, "Royalty must be <= 10%" );
        royalty = _royalty;
  }
    
  function setRoyaltyAddress(address _royaltyAddress) external onlyOwner {
        royaltyAddress = _royaltyAddress;
  }

  // Withdraw from contract
  function withdraw() external onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
  }

  // Withdraw any ERC20 token
  function withdrawERC20(address token) external onlyOwner {
        IERC20(token).transfer(owner(), IERC20(token).balanceOf(address(this)));
  }

  receive() external payable {}
}