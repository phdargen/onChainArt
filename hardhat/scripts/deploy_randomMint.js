const hre = require("hardhat");
const fs = require('fs');

// Network-specific NFT addresses
const DEPLOYED_ADDRESSES = {
    baseSepolia: {
        pathNFT: "0x15077415012b6f5a6F2842928886B51e0E2CB2D6", 
        shapeNFT: "0xd58b1248D893f6Dc0f93d7C1A12deed75Bee3785" 
    },
    base: {
        pathNFT: "0x1F21BB5e880828D1016FE2965A172407414c373c", 
        shapeNFT: "0xc6a050398BB92CB077b119BEAd045f3b52eA9a17" 
    },
    sepolia: {
        pathNFT: "0x2d727e8375E85BFD5bDd5167FAb1F03973501C56", 
        shapeNFT: "0x9c416b1B10Da99A6EBe639cD153eb740B06713dE" 
    },
    localhost: {
        pathNFT: "0x...", 
        shapeNFT: "0x..." 
    }
};

async function main() {
    // Get the network name
    const networkName = hre.network.name;
    console.log("Deploying to network:", networkName);

    // Get contract addresses for the current network
    const addresses = DEPLOYED_ADDRESSES[networkName];
    if (!addresses) {
        throw new Error(`No addresses configured for network: ${networkName}`);
    }

    // Get owner/deployer's wallet address
    const [owner] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", owner.address);

    // Deploy RandomNFTMinter
    const RandomMinter = await hre.ethers.getContractFactory("RandomNFTMinter");
    const randomMinter = await RandomMinter.deploy(
        addresses.pathNFT,
        addresses.shapeNFT
    );
    await randomMinter.deployed();

    console.log("RandomNFTMinter deployed to:", randomMinter.address);

    // Write deployment info to a file
    const deployment = {
        network: networkName,
        randomMinter: randomMinter.address,
        pathNFT: addresses.pathNFT,
        shapeNFT: addresses.shapeNFT,
        timestamp: new Date().toISOString()
    };

    const deploymentPath = `deployments/${networkName}.json`;
    fs.mkdirSync('deployments', { recursive: true });
    fs.writeFileSync(
        deploymentPath,
        JSON.stringify(deployment, null, 2)
    );
    console.log(`Deployment info saved to ${deploymentPath}`);

    // Verify contract on Etherscan if not on local network
    if (networkName !== 'hardhat' && networkName !== 'localhost') {
        console.log('Waiting for block confirmations...');
        await randomMinter.deployTransaction.wait(6);
        
        console.log('Verifying contract...');
        await hre.run("verify:verify", {
            address: randomMinter.address,
            constructorArguments: [addresses.pathNFT, addresses.shapeNFT],
        });
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
