const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("myNFT", function () {

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
    contractColor = await contractFactoryColor.deploy(owner.address);

    const contractFactorySVG = await hre.ethers.getContractFactory("SVG");
    contractSVG = await contractFactorySVG.deploy();
  
    const contractFactory = await hre.ethers.getContractFactory("myNFT");
    contract = await contractFactory.deploy(contractColor.address,contractSVG.address,owner.address);

    price = await contract.price();

    await contract.connect(minter1).mintNFT({ value: price });
  });

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      expect(await contractColor.owner()).to.equal(owner.address);
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should set the right color", async function () {
      expect(await contractColor.getColor(0,0)).to.equal("#69d2e7");
      const colorPalette = await contractColor.getColorpalette(0);
      expect(colorPalette[0]).to.equal("#69d2e7");
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
      ).to.be.revertedWith("Wrong price");
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

describe("pathNFT", function () {

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
    contractColor = await contractFactoryColor.deploy(owner.address);

    const contractFactorySVG = await hre.ethers.getContractFactory("SVG");
    contractSVG = await contractFactorySVG.deploy();
  
    const contractFactory = await hre.ethers.getContractFactory("pathNFT");
    contract = await contractFactory.deploy(contractColor.address,contractSVG.address,owner.address);

    price = await contract.price();

    await contract.connect(minter1).mintNFT({ value: price });
  });

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      expect(await contractColor.owner()).to.equal(owner.address);
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should set the right color", async function () {
      expect(await contractColor.getColor(0,0)).to.equal("#69d2e7");
      const colorPalette = await contractColor.getColorpalette(0);
      expect(colorPalette[0]).to.equal("#69d2e7");
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
      ).to.be.revertedWith("Wrong price");
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