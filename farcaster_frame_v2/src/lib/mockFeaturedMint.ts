import { base } from 'wagmi/chains';

import type { 
  ApiGetFeaturedMint200Response, 
  ApiGetFeaturedMintTransaction200Response 
} from './api';

const chainId = base.id;

// Define both contracts
const contracts = {
  paths: (Number(chainId) === Number(base.id) 
    ? "0x1F21BB5e880828D1016FE2965A172407414c373c" 
    : "0x9c416b1B10Da99A6EBe639cD153eb740B06713dE") as `0x${string}`,
  shapes: (Number(chainId) === Number(base.id)
    ? "0xc6a050398BB92CB077b119BEAd045f3b52eA9a17"
    : "0x2d727e8375E85BFD5bDd5167FAb1F03973501C56") as `0x${string}`
};

export const mockFeaturedMintResponse: ApiGetFeaturedMint200Response = {
  result: {
    mint: {
      name: "Xonin",
      imageUrl: "https://xonin.vercel.app/xonin.gif?width=1000",
      description: "Xonin - Onchain generative art collection.",
      creator: {
        fid: 372088,
        username: "dudecaster",
        displayName: "Dudecaster 🔵🌈🖼️",
        pfp: {
          url: "https://i.imgur.com/baRn42j.png",
        }
      },
      chainId: chainId,
      isMinting: true,
      priceEth: "1000000000000000",
      startsAt: 1734998438,
      endsAt: 1735603238
    }
  }
};

export const mockFeaturedMintTransactionResponse = (collection: 'paths' | 'shapes'): ApiGetFeaturedMintTransaction200Response => ({
  result: {
    tx: {
      chainId,
      to: contracts[collection],
      value: `0x${(1000000000000000).toString(16)}` as `0x${string}`,
      data: "0x14f710fe" as `0x${string}`
    }
  }
});

export { chainId, contracts }; 