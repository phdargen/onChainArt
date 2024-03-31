pragma solidity ^0.8.20;
//SPDX-License-Identifier: MIT

import "./Helper.sol";

contract SVG {

  function getSVG(uint256 rnd, string[] memory colorPalette ) public pure returns (string memory) {

    uint256 layers = Helper.expandRandom(rnd,0,15,25,1)[0];
    uint256[] memory figures = Helper.expandRandom(rnd,1,0,2,layers*3);

    uint256[] memory colors = Helper.expandRandom(rnd, 2, 1, colorPalette.length, layers*3);
    uint256[] memory x = Helper.expandRandom(rnd, 3, 0, 500, layers*3);
    uint256[] memory y = Helper.expandRandom(rnd, 4, 0, 500, layers*3);
    uint256[] memory scale = Helper.expandRandom(rnd, 5, 0, 5, layers*3);
    uint256[] memory scale2 = Helper.expandRandom(rnd, 6, 0, 99, layers*3);
    uint256[] memory opacity = Helper.expandRandom(rnd, 7, 60, 99, layers*3);
    uint256[] memory rotate = Helper.expandRandom(rnd, 8, 0, 360, layers*2);

    uint256[] memory filter = Helper.expandRandom(rnd,9,0,6,4);

    string memory render =  string(abi.encodePacked(
      "<symbol id='c' viewBox='0 0 100 100'>",
          "<circle cx='50' cy='50' r='25'>",
          "</circle>",
      "</symbol>",
      "<symbol id='t' viewBox='0 0 100 100'>",
        "<polygon points='0,100 100,100 50,0'>",
        "</polygon>",
      "</symbol>",
      "<symbol id='b' viewBox='0 0 100 100'>",
        "<rect width='500' height='50'>",
        "</rect>",
      "</symbol>",
			"<filter id='f1' width='200%' height='200%'>",
		    	"<feOffset in='SourceGraphic' result='r' dx='", Helper.uint2str(filter[0]*10) , "' dy='" , Helper.uint2str(filter[1]*10) , "' />",
			  	"<feGaussianBlur in='r' result='rb' stdDeviation='" , Helper.uint2str(filter[2]) ,"'/>",
				"<feMerge>",
					"<feMergeNode in='rb' />",
					"<feMergeNode in='SourceGraphic' />" ,
        "</feMerge>",
			"</filter>"	,
      "<symbol id='s'>"         
    ));

    for(uint i = 0; i < layers; i++){
 
      uint index = i;

      if(figures[index]==1)render = string(abi.encodePacked(render, 
        "<g class='g1'><use xlink:href='#b' width='100' height='100' ",
          " fill='", colorPalette[colors[index]],
          "' fill-opacity='0.", Helper.uint2str(opacity[index]),
          "' transform='translate(", Helper.uint2str(x[index]), " ", Helper.uint2str(y[index]) , ") ",
          " scale(", Helper.uint2str(scale[index]),".", Helper.uint2str(scale2[index]) , ") ",
          " rotate(", Helper.uint2str(rotate[index]), ")' > ",
        "</use></g>" ));

      index += layers;
      if(figures[index]==1)render = string(abi.encodePacked(render, 
        "<g class='g2'><use xlink:href='#t' width='100' height='100' ",
          " fill='", colorPalette[colors[index]],
          "' fill-opacity='0.", Helper.uint2str(opacity[index]),
          "' transform='translate(", Helper.uint2str(x[index]), " ", Helper.uint2str(y[index]) , ") ",
          " scale(", Helper.uint2str(scale[index]),".", Helper.uint2str(scale2[index]) , ") ",
          " rotate(", Helper.uint2str(rotate[index]), ")' > ",
        "</use></g>" ));

      index += layers;
      if(figures[index]==1)render = string(abi.encodePacked(render, 
        "<g class='g3'><use xlink:href='#c' width='100' height='100' ",
          " fill='", colorPalette[colors[index]],
          "' fill-opacity='0.", Helper.uint2str(opacity[index]),
          "' transform='translate(", Helper.uint2str(x[index]), " ", Helper.uint2str(y[index]) , ") ",
          " scale(", Helper.uint2str(scale[index]),".", Helper.uint2str(scale2[index]) , ")' > ",
        "</use></g>" ));
    }

    render = string(abi.encodePacked(render,
      "</symbol>",
  		"<g fill='",colorPalette[0], "'>",
			  "<rect width='500' height='500' />",
			  "<use href='#s'",
        filter[3] > 3 ? " filter='url(#f1)'" : "",
        "/>",
		  "</g>" 
    ));

    render = string(abi.encodePacked(
      "<svg width='500' height='500' viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>",
        render,
      "</svg>"
    ));

    return render;
  }

}