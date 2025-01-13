import type { ApiGetFeaturedMint200Response } from './api';
import { base, sepolia } from 'wagmi/chains';

const chainId = sepolia.id;
const contract = (Number(chainId) === Number(base.id) 
  ? "0x1F21BB5e880828D1016FE2965A172407414c373c" 
  : "0x2d727e8375E85BFD5bDd5167FAb1F03973501C56") as `0x${string}`;

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
        }
      },
      chainId: chainId,
      collection: contract,
      contract,
      isMinting: true,
      priceEth: "1000000000000000",
      priceUsd: 34,
      startsAt: 1734998438,
      endsAt: 1735603238
    }
  }
};

export { chainId, contract }; 