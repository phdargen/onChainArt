import type { ApiGetFeaturedMintTransaction200Response } from './api';

export const mockFeaturedMintTransactionResponse: ApiGetFeaturedMintTransaction200Response = {
  result: {
    tx: {
      // chain: "base",
      // to: "0xc6a050398BB92CB077b119BEAd045f3b52eA9a17",
      chain: "sepolia",
      to: "0x2d727e8375E85BFD5bDd5167FAb1F03973501C56",
      data: "0x14f710fe", // mintNFT()
      value: `0x${(1000000000000000).toString(16)}`  // 0.001 ETH in wei
    }
  }
}; 