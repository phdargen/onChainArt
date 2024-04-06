const hre = require("hardhat");
const { utils } = require("ethers");
const fs = require('fs');

const sharp = require('sharp');
const xmldom = require('xmldom');

const numberOfMints = 1
const outDir = "examples/"

async function main() {

  // Get owner/deployer's wallet address
  const [owner] = await hre.ethers.getSigners();

  // Deploy contracts
  const contractFactoryColor = await hre.ethers.getContractFactory("ColorPalette");
  const contractColor = await contractFactoryColor.deploy();
  await contractColor.deployed();
  console.log("ColorPalette deployed to:", contractColor.address);

  const contractFactoryShapeSVG = await hre.ethers.getContractFactory("ShapeSVG");
  const contractShapeSVG = await contractFactoryShapeSVG.deploy();
  await contractShapeSVG.deployed();
  console.log("ShapeSVG deployed to:", contractShapeSVG.address);

  const contractFactoryShapeNFT = await hre.ethers.getContractFactory("ShapeNFT");
  const contractShapeNFT = await contractFactoryShapeNFT.deploy(contractColor.address,contractShapeSVG.address,owner.address);
  await contractShapeNFT.deployed();
  console.log("ShapeNFT deployed to:", contractShapeNFT.address);

  const contractFactoryPathSVG = await hre.ethers.getContractFactory("PathSVG");
  const contractPathSVG = await contractFactoryPathSVG.deploy();
  await contractPathSVG.deployed();
  console.log("PathSVG deployed to:", contractPathSVG.address);

  const contractFactoryPathNFT = await hre.ethers.getContractFactory("PathNFT");
  const contractPathNFT = await contractFactoryPathNFT.deploy(contractColor.address,contractPathSVG.address,owner.address);
  await contractPathNFT.deployed();
  console.log("PathNFT deployed to:", contractPathNFT.address);

  for(let i = 0; i < numberOfMints; i++){

    let priceShapeNFT =  await contractShapeNFT.price();
    let pricePathNFT =  await contractPathNFT.price();

    // Mint NFT
    txnShapeNFT = await contractShapeNFT.mintNFT( { value: priceShapeNFT, gasLimit: 2100000});
    txnPathNFT = await contractPathNFT.mintNFT( { value: pricePathNFT, gasLimit: 2100000});

    // Get all token IDs of the owner
    let tokensShapeNFT = await contractShapeNFT.balanceOf(owner.address)
    console.log("Owner has ShapeNFTs: ", tokensShapeNFT);

    let tokensPathNFT = await contractPathNFT.balanceOf(owner.address)
    console.log("Owner has PathNFTs: ", tokensPathNFT);

    // Get svg
    let svgShapeNFT = await contractShapeNFT.getSVG(i)
    fs.writeFileSync(outDir+`shapes/SVG/token${i}.svg`, svgShapeNFT);
    await downloadPNG(svgShapeNFT, i, outDir+ 'shapes/' )

    let svgPathNFT = await contractPathNFT.getSVG(i)
    fs.writeFileSync(outDir+`paths/SVG/token${i}.svg`, svgPathNFT);
    await downloadPNG(svgPathNFT, i, outDir+ 'paths/' )

    // Get metadata
    let uriShapeNFT = await contractShapeNFT.tokenURI(i)
    fs.writeFileSync(outDir+`shapes/JSON/token${i}.json`, uriShapeNFT);

    let uriPathNFT = await contractPathNFT.tokenURI(i)
    fs.writeFileSync(outDir+`paths/JSON/token${i}.json`, uriPathNFT);
  }

}

async function downloadPNG(svgdata, tokenId, dir)
{
  let resizewidth = 500;
  let resizedest = dir+"PNG/token" + tokenId + ".png";

  let IMAGE = new xmldom.DOMParser().parseFromString(svgdata, 'text/xml');
  let svgList = IMAGE.getElementsByTagName('svg');
  if (!svgList) {
      throw new Error(`No SVG in ${svgdata}`);
  }
  
  let svg = svgList.item(0);
  svg.setAttribute('width', '100em');
  svg.setAttribute('height', '100em');
  //svg.setAttribute('fill', 'black');
  
  let img = await sharp(Buffer.from(
      new xmldom.XMLSerializer().serializeToString(IMAGE)
  ));
  
  let resized = await img.resize(resizewidth);
  await resized.toFile(resizedest);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
