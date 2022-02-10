pragma solidity ^0.8.4;
//SPDX-License-Identifier: MIT

import "./Helper.sol";

contract pathSVG {

  function getSVG(uint256 rnd, string[] memory colorPalette, uint256 layers, uint256[] memory points, uint256[] memory curveType  ) public view returns (string memory) {

    string memory render =  string(abi.encodePacked(
      "<symbol id='p' viewBox='0 0 500 500'>"
    ));

    string memory grad = "";

    for(uint i = 0; i < layers; i++){

        uint256[] memory colors = Helper.expandRandom(rnd, i*10+3, 1, colorPalette.length, 2);
        uint256[] memory opacity = Helper.expandRandom(rnd, i*10+4, 25, 99, 2);
        uint256[] memory sign_prob = Helper.expandRandom(rnd, i*10+5, 3, 7, 2);

        grad =  string(abi.encodePacked(grad,
          "<radialGradient id='g", Helper.uint2str(i) ,"'>",
            "<stop offset='0%' style='stop-color:", colorPalette[colors[0]]  ,";stop-opacity:0." , Helper.uint2str(opacity[0]) , "'/>",
            "<stop offset='100%' style='stop-color:", colorPalette[colors[1]]  ,";stop-opacity:1'/>",
          "</radialGradient>"
        ));

        render = string(abi.encodePacked(render, "<path fill='url(#g", Helper.uint2str(i), ")' d='M250 250 "));
        if(curveType[i] == 1) render = string(abi.encodePacked(render, "t"));
        if(curveType[i] == 2) render = string(abi.encodePacked(render, "s"));
        if(curveType[i] == 3) render = string(abi.encodePacked(render, "q"));

        uint256[] memory x = Helper.expandRandom(rnd, i*10+6, 10, points[i] < 100 ? 200 : 50 , 2*points[i]);
        uint256[] memory sign_x = Helper.expandRandom(rnd, i*10+8, 0, 10, 2*points[i]);

        for(uint j = 0; j < 2*points[i]; j++){
            render = string(abi.encodePacked(render, 
                sign_x[j] < sign_prob[j%2] ? " " : " -", Helper.uint2str(x[j]) 
            ));
        }
        render = string(abi.encodePacked(render, "'/>"));
    }

    render = string(abi.encodePacked(grad, render,
      "</symbol>",
  		"<g fill='",colorPalette[0], "'>",
			  "<rect width='500' height='500' />",
			  "<use href='#p'",
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