const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ShapeNFT", function () {

  provider = ethers.provider;

  let contractColor;
  let contractSVG;
  let contract;

  let owner;
  let minter1;
  let minter2;
  let minters;

  let price;

  beforeEach(async function () {

    [owner, minter1, minter2, ...minters] = await ethers.getSigners();

    // Deploy contracts
    const contractFactoryColor = await ethers.getContractFactory("ColorPalette");
    contractColor = await contractFactoryColor.deploy();

    const contractFactorySVG = await hre.ethers.getContractFactory("ShapeSVG");
    contractSVG = await contractFactorySVG.deploy();
  
    const contractFactory = await hre.ethers.getContractFactory("ShapeNFT");
    contract = await contractFactory.deploy(contractColor.address,contractSVG.address,owner.address);

    price = await contract.price();

    await contract.connect(minter1).mintNFT({ value: price });
  });

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should set the right color", async function () {
      const colorPalette = await contractColor.getColorpalette(0);
      expect(colorPalette[0]).to.equal("0x69d2e7");
    });

  });

  describe("Mint", function () {

    it("Should mint nft", async function () {
      await contract.connect(minter2).mintNFT({ value: price });
      const balance2 = await contract.balanceOf(minter2.address);
      expect(balance2).to.equal(1);
    });

    it("Should fail if not paid enough", async function () {
      await expect( 
         contract.connect(minter2).mintNFT({ value: price/2 })
      ).to.be.reverted;
    });

    it("Should update price and mint nft", async function () {
      await contract.setPrice(price / 2);
      await contract.connect(minter2).mintNFT({ value: price / 2 });
      const balance2 = await contract.balanceOf(minter2.address);
      expect(balance2).to.equal(1);
    });

  });

  describe("Royalties", function () {

    it("Should set default royalty", async function () {
      const royaltyInfo = await contract.royaltyInfo(0, ethers.utils.parseUnits("1", "ether"));
      expect(royaltyInfo[0]).to.equal(contract.address);
      expect(royaltyInfo[1]).to.equal(ethers.utils.parseUnits("0.1", "ether"));
    });

    it("Should update royalty info and price", async function () {
      await contract.setRoyaltyAddress(minter1.address);
      await contract.setRoyalty(500);

      const royaltyInfo = await contract.royaltyInfo(0, ethers.utils.parseUnits("1", "ether"));
      expect(royaltyInfo[0]).to.equal(minter1.address);
      expect(royaltyInfo[1]).to.equal(ethers.utils.parseUnits("0.05", "ether"));
    });

  });

  describe("Access control", function () {

    it("Should withdraw", async function () {
      let balance = await provider.getBalance(contract.address);
      expect(balance).to.be.above(0);

      await expect( await contract.withdraw() ).to.changeEtherBalances([contract, owner], [-balance, balance]);

      balance = await provider.getBalance(contract.address);
      expect(balance).to.equal(0);
    });

    it("Should not withdraw if not owner", async function () {
      await expect( 
          contract.connect(minter1).withdraw()
      ).to.be.reverted;
    });

    it("Should not update price if not owner", async function () {
      await expect( 
          contract.connect(minter1).setPrice(price * 10)
      ).to.be.reverted;
    });

    it("Should not updated royalty info if not owner", async function () {
      await expect( 
          contract.connect(minter1).setRoyaltyAddress(minter1.address)
      ).to.be.reverted;
    });
      
  });

});

describe("PathNFT", function () {

  provider = ethers.provider;

  let contractColor;
  let contractSVG;
  let contract;

  let owner;
  let minter1;
  let minter2;
  let minters;

  let price;

  beforeEach(async function () {

    [owner, minter1, minter2, ...minters] = await ethers.getSigners();

    // Deploy contracts
    const contractFactoryColor = await ethers.getContractFactory("ColorPalette");
    contractColor = await contractFactoryColor.deploy();

    const contractFactorySVG = await hre.ethers.getContractFactory("PathSVG");
    contractSVG = await contractFactorySVG.deploy();
  
    const contractFactory = await hre.ethers.getContractFactory("PathNFT");
    contract = await contractFactory.deploy(contractColor.address,contractSVG.address,owner.address);

    price = await contract.price();

    await contract.connect(minter1).mintNFT({ value: price });
  });

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should set the right color", async function () {
      const colorPalette = await contractColor.getColorpalette(0);
      expect(colorPalette[0]).to.equal("0x69d2e7");
    });

  });

  describe("Mint", function () {

    it("Should mint nft", async function () {
      await contract.connect(minter2).mintNFT({ value: price });
      const balance2 = await contract.balanceOf(minter2.address);
      expect(balance2).to.equal(1);
    });

    it("Should fail if not paid enough", async function () {
      await expect( 
         contract.connect(minter2).mintNFT({ value: price/2 })
      ).to.be.reverted;
    });

    it("Should update price and mint nft", async function () {
      await contract.setPrice(price / 2);
      await contract.connect(minter2).mintNFT({ value: price / 2 });
      const balance2 = await contract.balanceOf(minter2.address);
      expect(balance2).to.equal(1);
    });

  });

  describe("Royalties", function () {

    it("Should set default royalty", async function () {
      const royaltyInfo = await contract.royaltyInfo(0, ethers.utils.parseUnits("1", "ether"));
      expect(royaltyInfo[0]).to.equal(contract.address);
      expect(royaltyInfo[1]).to.equal(ethers.utils.parseUnits("0.1", "ether"));
    });

    it("Should update royalty info and price", async function () {
      await contract.setRoyaltyAddress(minter1.address);
      await contract.setRoyalty(500);

      const royaltyInfo = await contract.royaltyInfo(0, ethers.utils.parseUnits("1", "ether"));
      expect(royaltyInfo[0]).to.equal(minter1.address);
      expect(royaltyInfo[1]).to.equal(ethers.utils.parseUnits("0.05", "ether"));
    });

  });

  describe("Access control", function () {

    it("Should withdraw", async function () {
      let balance = await provider.getBalance(contract.address);
      expect(balance).to.be.above(0);

      await expect( await contract.withdraw() ).to.changeEtherBalances([contract, owner], [-balance, balance]);

      balance = await provider.getBalance(contract.address);
      expect(balance).to.equal(0);
    });

    it("Should not withdraw if not owner", async function () {
      await expect( 
          contract.connect(minter1).withdraw()
      ).to.be.reverted;
    });

    it("Should not update price if not owner", async function () {
      await expect( 
          contract.connect(minter1).setPrice(price * 10)
      ).to.be.reverted;
    });

    it("Should not updated royalty info if not owner", async function () {
      await expect( 
          contract.connect(minter1).setRoyaltyAddress(minter1.address)
      ).to.be.reverted;
    });
      
  });

});

describe("RandomNFTMinter", function () {
    let pathNFT;
    let shapeNFT;
    let randomMinter;
    let owner;
    let minter1;
    let price;

    beforeEach(async function () {
        [owner, minter1] = await ethers.getSigners();

        // Deploy dependencies
        const ColorPalette = await ethers.getContractFactory("ColorPalette");
        const colorPalette = await ColorPalette.deploy();

        const PathSVG = await ethers.getContractFactory("PathSVG");
        const pathSVG = await PathSVG.deploy();

        const ShapeSVG = await ethers.getContractFactory("ShapeSVG");
        const shapeSVG = await ShapeSVG.deploy();

        // Deploy NFT contracts
        const PathNFT = await ethers.getContractFactory("PathNFT");
        pathNFT = await PathNFT.deploy(colorPalette.address, pathSVG.address, owner.address);

        const ShapeNFT = await ethers.getContractFactory("ShapeNFT");
        shapeNFT = await ShapeNFT.deploy(colorPalette.address, shapeSVG.address, owner.address);

        // Deploy RandomNFTMinter
        const RandomMinter = await ethers.getContractFactory("RandomNFTMinter");
        randomMinter = await RandomMinter.deploy(pathNFT.address, shapeNFT.address);

        price = await pathNFT.price();
    });

    describe("Minting", function () {
        it("Should mint either PathNFT or ShapeNFT", async function () {
            await randomMinter.connect(minter1).mintAndTransfer(minter1.address, { value: price });
            
            const pathBalance = await pathNFT.balanceOf(minter1.address);
            const shapeBalance = await shapeNFT.balanceOf(minter1.address);
            
            // Either PathNFT or ShapeNFT should be minted, but not both
            expect(pathBalance.add(shapeBalance)).to.equal(1);
            expect(pathBalance.mul(shapeBalance)).to.equal(0);
        });

        it("Should fail with correct error message if wrong price sent", async function () {
            const wrongPrice = price.div(2);
            const pathPrice = await pathNFT.price();
            const shapePrice = await shapeNFT.price();
            
            await expect(
                randomMinter.connect(minter1).mintAndTransfer(minter1.address, { value: wrongPrice })
            ).to.be.revertedWith(
                wrongPrice < pathPrice 
                    ? `Wrong price for PathNFT, should be ${pathPrice.toString()}`
                    : `Wrong price for ShapeNFT, should be ${shapePrice.toString()}`
            );
        });

        it("Should fail if not enough ETH sent", async function () {
            await expect(
                randomMinter.connect(minter1).mintAndTransfer(minter1.address, { value: price.div(2) })
            ).to.be.reverted;
        });
    });

    describe("Withdrawal", function () {
        it("Should allow owner to withdraw", async function () {
            // First approve RandomMinter to spend tokens
            await pathNFT.setApprovalForAll(randomMinter.address, true);
            await shapeNFT.setApprovalForAll(randomMinter.address, true);
            
            // Send some ETH to the contract directly
            await owner.sendTransaction({
                to: randomMinter.address,
                value: price
            });
            
            const balance = await ethers.provider.getBalance(randomMinter.address);
            expect(balance).to.equal(price);
            
            await expect(
                await randomMinter.withdraw()
            ).to.changeEtherBalances([randomMinter, owner], [-balance, balance]);
        });

        it("Should not allow non-owner to withdraw", async function () {
            await expect(
                randomMinter.connect(minter1).withdraw()
            ).to.be.reverted;
        });
    });
});