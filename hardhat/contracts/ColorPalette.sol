pragma solidity ^0.8.20;
//SPDX-License-Identifier: MIT

contract ColorPalette {

  bytes3[5][100] colorPalettes;

  constructor()  {
      colorPalettes  = [
          [bytes3(0x69d2e7),bytes3(0xa7dbd8),bytes3(0xe0e4cc),bytes3(0xf38630),bytes3(0xfa6900)],
          [bytes3(0xfe4365),bytes3(0xfc9d9a),bytes3(0xf9cdad),bytes3(0xc8c8a9),bytes3(0x83af9b)],
          [bytes3(0xecd078),bytes3(0xd95b43),bytes3(0xc02942),bytes3(0x542437),bytes3(0x53777a)],
          [bytes3(0x556270),bytes3(0x4ecdc4),bytes3(0xc7f464),bytes3(0xff6b6b),bytes3(0xc44d58)],
          [bytes3(0x774f38),bytes3(0xe08e79),bytes3(0xf1d4af),bytes3(0xece5ce),bytes3(0xc5e0dc)],
          [bytes3(0xe8ddcb),bytes3(0xcdb380),bytes3(0x036564),bytes3(0x033649),bytes3(0x031634)],
          [bytes3(0x490a3d),bytes3(0xbd1550),bytes3(0xe97f02),bytes3(0xf8ca00),bytes3(0x8a9b0f)],
          [bytes3(0x594f4f),bytes3(0x547980),bytes3(0x45ada8),bytes3(0x9de0ad),bytes3(0xe5fcc2)],
          [bytes3(0x00a0b0),bytes3(0x6a4a3c),bytes3(0xcc333f),bytes3(0xeb6841),bytes3(0xedc951)],
          [bytes3(0xe94e77),bytes3(0xd68189),bytes3(0xc6a49a),bytes3(0xc6e5d9),bytes3(0xf4ead5)],
          [bytes3(0x3fb8af),bytes3(0x7fc7af),bytes3(0xdad8a7),bytes3(0xff9e9d),bytes3(0xff3d7f)],
          [bytes3(0xd9ceb2),bytes3(0x948c75),bytes3(0xd5ded9),bytes3(0x7a6a53),bytes3(0x99b2b7)],
          [bytes3(0xffffff),bytes3(0xcbe86b),bytes3(0xf2e9e1),bytes3(0x1c140d),bytes3(0xcbe86b)],
          [bytes3(0xefffcd),bytes3(0xdce9be),bytes3(0x555152),bytes3(0x2e2633),bytes3(0x99173c)],
          [bytes3(0x343838),bytes3(0x005f6b),bytes3(0x008c9e),bytes3(0x00b4cc),bytes3(0x00dffc)],
          [bytes3(0x413e4a),bytes3(0x73626e),bytes3(0xb38184),bytes3(0xf0b49e),bytes3(0xf7e4be)],
          [bytes3(0xff4e50),bytes3(0xfc913a),bytes3(0xf9d423),bytes3(0xede574),bytes3(0xe1f5c4)],
          [bytes3(0x99b898),bytes3(0xfecea8),bytes3(0xff847c),bytes3(0xe84a5f),bytes3(0x2a363b)],
          [bytes3(0x655643),bytes3(0x80bca3),bytes3(0xf6f7bd),bytes3(0xe6ac27),bytes3(0xbf4d28)],
          [bytes3(0x00a8c6),bytes3(0x40c0cb),bytes3(0xf9f2e7),bytes3(0xaee239),bytes3(0x8fbe00)],
          [bytes3(0x351330),bytes3(0x424254),bytes3(0x64908a),bytes3(0xe8caa4),bytes3(0xcc2a41)],
          [bytes3(0x554236),bytes3(0xf77825),bytes3(0xd3ce3d),bytes3(0xf1efa5),bytes3(0x60b99a)],
          [bytes3(0x5d4157),bytes3(0x838689),bytes3(0xa8caba),bytes3(0xcad7b2),bytes3(0xebe3aa)],
          [bytes3(0x8c2318),bytes3(0x5e8c6a),bytes3(0x88a65e),bytes3(0xbfb35a),bytes3(0xf2c45a)],
          [bytes3(0xfad089),bytes3(0xff9c5b),bytes3(0xf5634a),bytes3(0xed303c),bytes3(0x3b8183)],
          [bytes3(0xff4242),bytes3(0xf4fad2),bytes3(0xd4ee5e),bytes3(0xe1edb9),bytes3(0xf0f2eb)],
          [bytes3(0xf8b195),bytes3(0xf67280),bytes3(0xc06c84),bytes3(0x6c5b7b),bytes3(0x355c7d)],
          [bytes3(0xd1e751),bytes3(0xffffff),bytes3(0x000000),bytes3(0x4dbce9),bytes3(0x26ade4)],
          [bytes3(0x1b676b),bytes3(0x519548),bytes3(0x88c425),bytes3(0xbef202),bytes3(0xeafde6)],
          [bytes3(0x5e412f),bytes3(0xfcebb6),bytes3(0x78c0a8),bytes3(0xf07818),bytes3(0xf0a830)],
          [bytes3(0xbcbdac),bytes3(0xcfbe27),bytes3(0xf27435),bytes3(0xf02475),bytes3(0x3b2d38)],
          [bytes3(0x452632),bytes3(0x91204d),bytes3(0xe4844a),bytes3(0xe8bf56),bytes3(0xe2f7ce)],
          [bytes3(0xeee6ab),bytes3(0xc5bc8e),bytes3(0x696758),bytes3(0x45484b),bytes3(0x36393b)],
          [bytes3(0xf0d8a8),bytes3(0x3d1c00),bytes3(0x86b8b1),bytes3(0xf2d694),bytes3(0xfa2a00)],
          [bytes3(0x2a044a),bytes3(0x0b2e59),bytes3(0x0d6759),bytes3(0x7ab317),bytes3(0xa0c55f)],
          [bytes3(0xf04155),bytes3(0xff823a),bytes3(0xf2f26f),bytes3(0xfff7bd),bytes3(0x95cfb7)],
          [bytes3(0xb9d7d9),bytes3(0x668284),bytes3(0x2a2829),bytes3(0x493736),bytes3(0x7b3b3b)],
          [bytes3(0xbbbb88),bytes3(0xccc68d),bytes3(0xeedd99),bytes3(0xeec290),bytes3(0xeeaa88)],
          [bytes3(0xb3cc57),bytes3(0xecf081),bytes3(0xffbe40),bytes3(0xef746f),bytes3(0xab3e5b)],
          [bytes3(0xa3a948),bytes3(0xedb92e),bytes3(0xf85931),bytes3(0xce1836),bytes3(0x009989)],
          [bytes3(0x300030),bytes3(0x480048),bytes3(0x601848),bytes3(0xc04848),bytes3(0xf07241)],
          [bytes3(0x67917a),bytes3(0x170409),bytes3(0xb8af03),bytes3(0xccbf82),bytes3(0xe33258)],
          [bytes3(0xaab3ab),bytes3(0xc4cbb7),bytes3(0xebefc9),bytes3(0xeee0b7),bytes3(0xe8caaf)],
          [bytes3(0xe8d5b7),bytes3(0x0e2430),bytes3(0xfc3a51),bytes3(0xf5b349),bytes3(0xe8d5b9)],
          [bytes3(0xab526b),bytes3(0xbca297),bytes3(0xc5ceae),bytes3(0xf0e2a4),bytes3(0xf4ebc3)],
          [bytes3(0x607848),bytes3(0x789048),bytes3(0xc0d860),bytes3(0xf0f0d8),bytes3(0x604848)],
          [bytes3(0xb6d8c0),bytes3(0xc8d9bf),bytes3(0xdadabd),bytes3(0xecdbbc),bytes3(0xfedcba)],
          [bytes3(0xa8e6ce),bytes3(0xdcedc2),bytes3(0xffd3b5),bytes3(0xffaaa6),bytes3(0xff8c94)],
          [bytes3(0x3e4147),bytes3(0xfffedf),bytes3(0xdfba69),bytes3(0x5a2e2e),bytes3(0x2a2c31)],
          [bytes3(0xfc354c),bytes3(0x29221f),bytes3(0x13747d),bytes3(0x0abfbc),bytes3(0xfcf7c5)],
          [bytes3(0xcc0c39),bytes3(0xe6781e),bytes3(0xc8cf02),bytes3(0xf8fcc1),bytes3(0x1693a7)],
          [bytes3(0x1c2130),bytes3(0x028f76),bytes3(0xb3e099),bytes3(0xffeaad),bytes3(0xd14334)],
          [bytes3(0xa7c5bd),bytes3(0xe5ddcb),bytes3(0xeb7b59),bytes3(0xcf4647),bytes3(0x524656)],
          [bytes3(0xdad6ca),bytes3(0x1bb0ce),bytes3(0x4f8699),bytes3(0x6a5e72),bytes3(0x563444)],
          [bytes3(0x5c323e),bytes3(0xa82743),bytes3(0xe15e32),bytes3(0xc0d23e),bytes3(0xe5f04c)],
          [bytes3(0xedebe6),bytes3(0xd6e1c7),bytes3(0x94c7b6),bytes3(0x403b33),bytes3(0xd3643b)],
          [bytes3(0xfdf1cc),bytes3(0xc6d6b8),bytes3(0x987f69),bytes3(0xe3ad40),bytes3(0xfcd036)],
          [bytes3(0x230f2b),bytes3(0xf21d41),bytes3(0xebebbc),bytes3(0xbce3c5),bytes3(0x82b3ae)],
          [bytes3(0xb9d3b0),bytes3(0x81bda4),bytes3(0xb28774),bytes3(0xf88f79),bytes3(0xf6aa93)],
          [bytes3(0x3a111c),bytes3(0x574951),bytes3(0x83988e),bytes3(0xbcdea5),bytes3(0xe6f9bc)],
          [bytes3(0x5e3929),bytes3(0xcd8c52),bytes3(0xb7d1a3),bytes3(0xdee8be),bytes3(0xfcf7d3)],
          [bytes3(0x1c0113),bytes3(0x6b0103),bytes3(0xa30006),bytes3(0xc21a01),bytes3(0xf03c02)],
          [bytes3(0x000000),bytes3(0x9f111b),bytes3(0xb11623),bytes3(0x292c37),bytes3(0xcccccc)],
          [bytes3(0x382f32),bytes3(0xffeaf2),bytes3(0xfcd9e5),bytes3(0xfbc5d8),bytes3(0xf1396d)],
          [bytes3(0xe3dfba),bytes3(0xc8d6bf),bytes3(0x93ccc6),bytes3(0x6cbdb5),bytes3(0x1a1f1e)],
          [bytes3(0xf6f6f6),bytes3(0xe8e8e8),bytes3(0x333333),bytes3(0x990100),bytes3(0xb90504)],
          [bytes3(0x1b325f),bytes3(0x9cc4e4),bytes3(0xe9f2f9),bytes3(0x3a89c9),bytes3(0xf26c4f)],
          [bytes3(0xa1dbb2),bytes3(0xfee5ad),bytes3(0xfaca66),bytes3(0xf7a541),bytes3(0xf45d4c)],
          [bytes3(0xc1b398),bytes3(0x605951),bytes3(0xfbeec2),bytes3(0x61a6ab),bytes3(0xaccec0)],
          [bytes3(0x5e9fa3),bytes3(0xdcd1b4),bytes3(0xfab87f),bytes3(0xf87e7b),bytes3(0xb05574)],
          [bytes3(0x951f2b),bytes3(0xf5f4d7),bytes3(0xe0dfb1),bytes3(0xa5a36c),bytes3(0x535233)],
          [bytes3(0x8dccad),bytes3(0x988864),bytes3(0xfea6a2),bytes3(0xf9d6ac),bytes3(0xffe9af)],
          [bytes3(0x2d2d29),bytes3(0x215a6d),bytes3(0x3ca2a2),bytes3(0x92c7a3),bytes3(0xdfece6)],
          [bytes3(0x413d3d),bytes3(0x040004),bytes3(0xc8ff00),bytes3(0xfa023c),bytes3(0x4b000f)],
          [bytes3(0xeff3cd),bytes3(0xb2d5ba),bytes3(0x61ada0),bytes3(0x248f8d),bytes3(0x605063)],
          [bytes3(0xffefd3),bytes3(0xfffee4),bytes3(0xd0ecea),bytes3(0x9fd6d2),bytes3(0x8b7a5e)],
          [bytes3(0xcfffdd),bytes3(0xb4dec1),bytes3(0x5c5863),bytes3(0xa85163),bytes3(0xff1f4c)],
          [bytes3(0x9dc9ac),bytes3(0xfffec7),bytes3(0xf56218),bytes3(0xff9d2e),bytes3(0x919167)],
          [bytes3(0x4e395d),bytes3(0x827085),bytes3(0x8ebe94),bytes3(0xccfc8e),bytes3(0xdc5b3e)],
          [bytes3(0xa8a7a7),bytes3(0xcc527a),bytes3(0xe8175d),bytes3(0x474747),bytes3(0x363636)],
          [bytes3(0xf8edd1),bytes3(0xd88a8a),bytes3(0x474843),bytes3(0x9d9d93),bytes3(0xc5cfc6)],
          [bytes3(0x046d8b),bytes3(0x309292),bytes3(0x2fb8ac),bytes3(0x93a42a),bytes3(0xecbe13)],
          [bytes3(0xf38a8a),bytes3(0x55443d),bytes3(0xa0cab5),bytes3(0xcde9ca),bytes3(0xf1edd0)],
          [bytes3(0xa70267),bytes3(0xf10c49),bytes3(0xfb6b41),bytes3(0xf6d86b),bytes3(0x339194)],
          [bytes3(0xff003c),bytes3(0xff8a00),bytes3(0xfabe28),bytes3(0x88c100),bytes3(0x00c176)],
          [bytes3(0xffedbf),bytes3(0xf7803c),bytes3(0xf54828),bytes3(0x2e0d23),bytes3(0xf8e4c1)],
          [bytes3(0x4e4d4a),bytes3(0x353432),bytes3(0x94ba65),bytes3(0x2790b0),bytes3(0x2b4e72)],
          [bytes3(0x0ca5b0),bytes3(0x4e3f30),bytes3(0xfefeeb),bytes3(0xf8f4e4),bytes3(0xa5b3aa)],
          [bytes3(0x4d3b3b),bytes3(0xde6262),bytes3(0xffb88c),bytes3(0xffd0b3),bytes3(0xf5e0d3)],
          [bytes3(0xfffbb7),bytes3(0xa6f6af),bytes3(0x66b6ab),bytes3(0x5b7c8d),bytes3(0x4f2958)],
          [bytes3(0xedf6ee),bytes3(0xd1c089),bytes3(0xb3204d),bytes3(0x412e28),bytes3(0x151101)],
          [bytes3(0x9d7e79),bytes3(0xccac95),bytes3(0x9a947c),bytes3(0x748b83),bytes3(0x5b756c)],
          [bytes3(0xfcfef5),bytes3(0xe9ffe1),bytes3(0xcdcfb7),bytes3(0xd6e6c3),bytes3(0xfafbe3)],
          [bytes3(0x9cddc8),bytes3(0xbfd8ad),bytes3(0xddd9ab),bytes3(0xf7af63),bytes3(0x633d2e)],
          [bytes3(0x30261c),bytes3(0x403831),bytes3(0x36544f),bytes3(0x1f5f61),bytes3(0x0b8185)],
          [bytes3(0xaaff00),bytes3(0xffaa00),bytes3(0xff00aa),bytes3(0xaa00ff),bytes3(0x00aaff)],
          [bytes3(0xd1313d),bytes3(0xe5625c),bytes3(0xf9bf76),bytes3(0x8eb2c5),bytes3(0x615375)],
          [bytes3(0xffe181),bytes3(0xeee9e5),bytes3(0xfad3b2),bytes3(0xffba7f),bytes3(0xff9c97)],
          [bytes3(0x73c8a9),bytes3(0xdee1b6),bytes3(0xe1b866),bytes3(0xbd5532),bytes3(0x373b44)],
          [bytes3(0x805841),bytes3(0xdcf7f3),bytes3(0xfffcdd),bytes3(0xffd8d8),bytes3(0xf5a2a2)]
          ];
  }

  function getColorpalette(uint i) external view returns (bytes3[5] memory ) {
      require(i < colorPalettes.length, "Colorpalette access out of bounds");
      bytes3[5] memory myPalette =  colorPalettes[i];
      return myPalette;
  }

  function getPaletteSize() public view returns (uint){
    return colorPalettes.length;
  }

}