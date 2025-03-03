# Xonin - Fully Onchain Generative Art NFT Collection

Xonin is a generative art collection featuring unique abstract designs created and stored 100% on the blockchain. 
Unlike most NFTs that only store links to external databases which may break over time, Xonin's artwork is fully immutable and permanent on the blockchain.

![xonin 001](https://github.com/phdargen/onChainArt/assets/29732335/3e90a293-a8a0-49f6-bc34-b58c48bde36e)

[Collection on OpenSea](https://opensea.io/XoninNFT/created)

## Key Features

- **100% Onchain Artwork**: SVG art generation with gas-efficient storage, pseudo-random number generation and rendering
- **Two Unique Collections**: Shapes and Paths editions, each with distinct generative algorithms
- **Multi-platform Minting**: Mint via web interface or directly from Farcaster social media feeds
- **AI Integration**: [X (Twitter) agent](https://github.com/phdargen/xoninAgent) ([@XoninNFT](https://x.com/XoninNFT)) analyzes blockchain activity and rewards users 
- **Robust Royalty System**: ERC-2981 implementation for sustainable creator economics

## Technical Stack

- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: React, ethers.js, useDApp
- **Social Integration**: Farcaster Frames, viem, wagmi
- **AI Agent**: LangChain, Python

## Smart contract deployments

### Base Mainnet
- ShapeNFT: [0xc6a050398BB92CB077b119BEAd045f3b52eA9a17](https://basescan.org/address/0xc6a050398BB92CB077b119BEAd045f3b52eA9a17)
- PathNFT: [0x1F21BB5e880828D1016FE2965A172407414c373c](https://basescan.org/address/0x1F21BB5e880828D1016FE2965A172407414c373c)

### Sepolia Testnet
- ShapeNFT: [0x2d727e8375E85BFD5bDd5167FAb1F03973501C56](https://sepolia.etherscan.io/address/0x2d727e8375E85BFD5bDd5167FAb1F03973501C56)
- PathNFT: [0x9c416b1B10Da99A6EBe639cD153eb740B06713dE](https://sepolia.etherscan.io/address/0x9c416b1B10Da99A6EBe639cD153eb740B06713dE)

## Live mints
- **Website**: [https://xonin.vercel.app/](https://xonin.vercel.app/)
- **Farcaster Frame**:  [v1](https://warpcast.com/dudecaster/0xf13a3979), [v2](https://warpcast.com/dudecaster/0x1c534766)

## Development Setup

### Smart Contracts
```shell
cd hardhat
npm install
npx hardhat compile
npx hardhat run --network base scripts/deploy.js
```

### Frontend
```shell
cd frontend
npm install
npm run dev
```

### Farcaster Frame v1
```shell
cd farcaster_frame
npm install
npm run dev
```
### Farcaster Frame v2
```shell
cd farcaster_frame_v2
npm install
npm run dev
```
