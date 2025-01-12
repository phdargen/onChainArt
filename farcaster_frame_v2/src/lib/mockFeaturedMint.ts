import type { ApiGetFeaturedMint200Response } from './api';

export const mockFeaturedMintResponse: ApiGetFeaturedMint200Response = {
  result: {
    mint: {
      name: "Xonin",
      imageUrl: "https://xonin.vercel.app/xonin.gif?width=1000",
      description: "Xonin - Onchain generative art collection. The transaction hash is used as random seed for the algorithm creating unique patterns for each NFT mint. The artwork is stored fully onchain as SVG.",
      creator: {
        fid: 372088,
        username: "dudecaster",
        displayName: "Dudecaster 🔵🌈🖼️",
        pfp: {
          url: "https://i.imgur.com/baRn42j.png",
        //   verified: false
        }
      },
      chain: "base",
      collection: "0xc6a050398BB92CB077b119BEAd045f3b52eA9a17",
      contract: "0xc6a050398BB92CB077b119BEAd045f3b52eA9a17",
      isMinting: true,
      priceEth: "1000000000000000",
      priceUsd: 34,
      startsAt: 1734998438,
      endsAt: 1735603238
    }
  }
}; 