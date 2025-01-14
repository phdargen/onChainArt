import { contracts } from '@/lib/mockFeaturedMint';
import { useReadContract } from 'wagmi';

const ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "id", "type": "uint256"}],
    "name": "getSVG",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export function useNFTSvg(tokenId: number | undefined, collection: 'paths' | 'shapes' = 'paths') {
  const { data } = useReadContract({
    address: contracts[collection],
    abi: ABI,
    functionName: 'getSVG',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId
    }
  });
  
  return { data: data as string, isLoading: !data };
} 