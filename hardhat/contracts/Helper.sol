pragma solidity ^0.8.20;
//SPDX-License-Identifier: MIT
library Helper {

  function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
      if (_i == 0) {
          return "0";
      }
      uint j = _i;
      uint len;
      while (j != 0) {
          len++;
          j /= 10;
      }
      bytes memory bstr = new bytes(len);
      uint k = len;
      while (_i != 0) {
          k = k-1;
          uint8 temp = (48 + uint8(_i - _i / 10 * 10));
          bytes1 b1 = bytes1(temp);
          bstr[k] = b1;
          _i /= 10;
      }
      return string(bstr);
  }

   function bytes3ToHexString(bytes3 _bytes) internal pure returns (string memory) {
        bytes memory hexChars = "0123456789abcdef";
        bytes memory hexString = new bytes(6);
        for (uint i = 0; i < 3; i++) {
            hexString[i * 2] = hexChars[uint8(_bytes[i] >> 4)];
            hexString[1 + i * 2] = hexChars[uint8(_bytes[i] & 0x0f)];
        }
        return string(hexString);
    }

  function expandRandom(uint256 randomValue, uint256 seed, uint256 min, uint256 max, uint256 n) internal pure returns (uint256[] memory expandedValues) {
    expandedValues = new uint256[](n);
    for (uint256 i = 0; i < n; i++) {
        expandedValues[i] = uint256(keccak256(abi.encode(randomValue, seed, i))) %  (max - min) + min;
    }
    return expandedValues;
  }

}