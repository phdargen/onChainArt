import { useContractFunction, useCall, useCalls, Falsy } from "@usedapp/core";
import { BigNumber } from 'ethers'
import { Contract } from 'ethers'

import network from "../contracts/network.json"
const networkId = network.ChainId 

export const useMintNFT = (contract: any) => {
  return useContractFunction(contract, "mintNFT", { transactionName: "Mint NFT", }) 
}

export function usePrice(contract: Contract | Falsy): BigNumber | undefined  {
  const { value, error } =
  useCall(
    contract && {
        contract: contract, 
        method: "price", 
        args: [], 
      }, { chainId: networkId}
  ) ?? {};
  if(error) {
    console.error('usePrice::Error::', error.message)
    return undefined
  }
  return value?.[0]
}

export function useTotalSupply(contract: Contract | Falsy): string | undefined  {
  const { value, error } =
  useCall(
    contract && {
        contract: contract, 
        method: "totalSupply", 
        args: [], 
      }, { chainId: networkId}
  ) ?? {};
  if(error) {
    console.error('useTotalSupply::Error::', error.message)
    return undefined
  }
  return value?.[0]
}

export function useMaxSupply(contract: Contract | Falsy): string | undefined  {
  const { value, error } =
  useCall(
    contract && {
        contract: contract, 
        method: "maxSupply", 
        args: [], 
      }, {chainId: networkId, refresh: 'never'}
  ) ?? {};
  if(error) {
    console.error('useMaxSupply::Error::', error.message)
    return undefined
  }
  return value?.[0]
}
  
export function useGetSVG(contract: Contract | Falsy, tokenId:number | Falsy) {
  const { value, error } =
  useCall(
    contract && tokenId && {
        contract: contract, 
        method: "getSVG", 
        args: [tokenId], 
      }, { chainId: networkId}
  ) ?? {};
  if(error) {
    console.error('useGetSVG::Error::', error.message)
    return undefined
  }
  return value?.[0]
}

export function useGetAllSVGs(contract: Contract| Falsy, tokenIds:number[]) {
  const calls = contract && tokenIds.length > 0 && tokenIds[0] !== undefined ? (tokenIds?.map(index => ({
    contract: contract,
    method: 'getSVG',
    args: [index]
  })) ?? []) : [];
  const results = useCalls(calls, { chainId: networkId}) ?? []
  results.forEach((result, idx) => {
    if(result && result.error) {
       console.error(`useGetAllSVGs::Error encountered calling 'getSVG' on ${calls[idx]?.contract.address}: ${result.error.message}`)
       console.error("useGetAllSVGs::Error::tokenIds ", tokenIds)
    }
  })
  return results.map(result => result?.value?.[0])
}

export function useBalanceOf(contract: Contract | Falsy, address:string | Falsy) {
  const { value, error } =
  useCall(
       contract && address && {
        contract: contract, 
        method: "balanceOf", 
        args: [address], 
      }, { chainId: networkId}
  ) ?? {};
  if(error) {
    console.error('useBalanceOf::Error::', error.message)
    console.error('useBalanceOf::Error::address ', address)
    return undefined
  }
  return value?.[0]
}

export function useTokenOfOwnerByIndex(contract: Contract | Falsy, address:string | Falsy, tokenId:number | Falsy) {
  const { value, error } =
  useCall(
       contract && address && tokenId && {
        contract: contract, 
        method: "tokenOfOwnerByIndex", 
        args: [address, tokenId], 
      }, { chainId: networkId}
  ) ?? {};
  if(error) {
    console.error('useTokenOfOwnerByIndex::Error::', error.message)
    return undefined
  }
  return value?.[0]
}

export function useTokenOfOwner(contract: Contract| Falsy, address:string | Falsy, ownedTokens:number[]) {

  const calls = contract && address && ownedTokens.length>0 && ownedTokens[0] !== undefined ? (ownedTokens?.map(index => ({
    contract: contract,
    method: 'tokenOfOwnerByIndex',
    args: [address, index]
  }), { chainId: networkId}) ?? []) : [];
  const results = useCalls(calls) ?? []
  results.forEach((result, idx) => {
    if(result && result.error) {
      console.error(`useTokenOfOwner::Error encountered calling 'tokenOfOwnerByIndex' on ${calls[idx]?.contract.address}: ${result.error.message}`)
      console.error("useTokenOfOwner::Error::ownedTokens ", ownedTokens)
    }
  })
  return results.map(result => result?.value?.[0])
}
