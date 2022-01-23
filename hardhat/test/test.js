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
    contractColor = await contractFactoryColor.deploy();

    const contractFactorySVG = await hre.ethers.getContractFactory("SVG");
    contractSVG = await contractFactorySVG.deploy();
  
    const contractFactory = await hre.ethers.getContractFactory("myNFT");
    contract = await contractFactory.deploy(contractColor.address,contractSVG.address);

    price = contract.price();

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

  });

  describe("Access control", function () {

    describe("Withdrawal", function () {

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
        ).to.be.revertedWith("Ownable: caller is not the owner");

      });

      
    });
  

  });


});
