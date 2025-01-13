import { chainId, contract } from './mockFeaturedMint';

export const mockFeaturedMintTransactionResponse = {
  result: {
    tx: {
      chainId,
      to: contract,
      value: `0x${(1000000000000000).toString(16)}` as `0x${string}`,
      data: "0x14f710fe" as `0x${string}`
    }
  }
}; 