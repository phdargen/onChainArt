import { useQuery } from '@tanstack/react-query';

async function fetchEthPrice() {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
  const data = await response.json();
  return data.ethereum.usd;
}

export function useEthPrice() {
  return useQuery({
    queryKey: ['ethPrice'],
    queryFn: fetchEthPrice,
    staleTime: 60 * 1000, // Price is fresh for 1 minute
  });
} 