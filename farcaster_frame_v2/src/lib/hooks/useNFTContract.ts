import { contract } from '@/lib/mockFeaturedMint';
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

export function useNFTSvg(tokenId: number | undefined) {
  const { data } = useReadContract({
    address: contract,
    abi: ABI,
    functionName: 'getSVG',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId
    }
  });
  
  return { data: data as string, isLoading: !data };
} 