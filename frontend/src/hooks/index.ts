import { useContractFunction, useCall, useCalls } from "@usedapp/core";

export const useMintNFT = (contract: any) => {
  return useContractFunction(contract, "mintNFT", { transactionName: "Mint NFT", }) 
}

export function usePrice(contract: any) {
  const { value, error } =
  useCall(
       {
        contract: contract, 
        method: "price", 
        args: [], 
      }
  ) ?? {};
  if(error) {
    console.error(error.message)
    return undefined
  }
  return value?.[0]
}

export function useTotalSupply(contract: any) {
  const { value, error } =
  useCall(
       {
        contract: contract, 
        method: "totalSupply", 
        args: [], 
      }
  ) ?? {};
  if(error) {
    console.error(error.message)
    return undefined
  }
  return value?.[0]
}

export function useMaxSupply(contract: any) {
  const { value, error } =
  useCall(
       {
        contract: contract, 
        method: "maxSupply", 
        args: [], 
      }
  ) ?? {};
  if(error) {
    console.error(error.message)
    return undefined
  }
  return value?.[0]
}
  
export function useGetSVG(contract: any, tokenId:number) {
  const { value, error } =
  useCall(
       {
        contract: contract, 
        method: "getSVG", 
        args: [tokenId], 
      }
  ) ?? {};
  if(error) {
    console.error(error.message)
    return undefined
  }
  return value?.[0]
}

export function useGetAllSVGs(contract: any, tokenIds:number[]) {
  const calls = tokenIds?.map(index => ({
    contract: contract,
    method: 'getSVG',
    args: [index]
  })) ?? []
  const results = useCalls(calls) ?? []
  results.forEach((result, idx) => {
    if(result && result.error) {
      console.error(`Error encountered calling 'getSVG' on ${calls[idx]?.contract.address}: ${result.error.message}`)
    }
  })
  return results.map(result => result?.value?.[0])
}

export function useBalanceOf(contract: any, address:string) {
  const { value, error } =
  useCall(
       {
        contract: contract, 
        method: "balanceOf", 
        args: [address], 
      }
  ) ?? {};
  if(error) {
    console.error(error.message)
    return undefined
  }
  return value?.[0]
}

export function useTokenOfOwnerByIndex(contract: any, address:string, tokenId:number) {
  const { value, error } =
  useCall(
       {
        contract: contract, 
        method: "tokenOfOwnerByIndex", 
        args: [address, tokenId], 
      }
  ) ?? {};
  if(error) {
    console.error(error.message)
    return undefined
  }
  return value?.[0]
}

export function useTokenOfOwner(contract: any, address:string, ownedTokens:number[]) {

  const calls = ownedTokens?.map(index => ({
    contract: contract,
    method: 'tokenOfOwnerByIndex',
    args: [address, index]
  })) ?? []
  const results = useCalls(calls) ?? []
  results.forEach((result, idx) => {
    if(result && result.error) {
      console.error(`Error encountered calling 'tokenOfOwnerByIndex' on ${calls[idx]?.contract.address}: ${result.error.message}`)
    }
  })
  return results.map(result => result?.value?.[0])
}
