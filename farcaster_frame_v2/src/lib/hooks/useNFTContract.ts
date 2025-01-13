import { useReadContract } from 'wagmi';

const CONTRACT_ADDRESS = "0x2d727e8375E85BFD5bDd5167FAb1F03973501C56";
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
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getSVG',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId
    }
  });
  
  return { data: data as string, isLoading: !data };
} 