import { useContractFunction, useCall, useCalls, Falsy, QueryParams } from "@usedapp/core";
import { BigNumber } from 'ethers'
import { Contract } from 'ethers'

import network from "../contracts/network.json"
const networkId = network.ChainId 

export const useMintNFT = (contract: Contract | Falsy) => {
  return useContractFunction(contract, "mintNFT", { transactionName: "Mint NFT", }) 
}

export const useSetPrice = (contract: Contract | Falsy) => {
  return useContractFunction(contract, "setPrice", { transactionName: "Set Price", }) 
}

export const useWithdraw = (contract: Contract | Falsy) => {
  return useContractFunction(contract, "withdraw", { transactionName: "Withdraw", }) 
}

export const useSetRoyaltyAddress = (contract: Contract | Falsy) => {
  return useContractFunction(contract, "setRoyaltyAddress", { transactionName: "Set Royalty Address", }) 
}

export const useTransferOwnership = (contract: Contract | Falsy) => {
  return useContractFunction(contract, "transferOwnership", { transactionName: "Transfer Ownership", }) 
}

export function usePrice(contract: Contract | Falsy, refresh: number | 'everyBlock' | 'never' = 'everyBlock'): BigNumber | undefined  {
  const { value, error } =
  useCall(
    contract && {
        contract: contract, 
        method: "price", 
        args: [], 
      }, { chainId: networkId, refresh: refresh}
  ) ?? {};
  if(error) {
    console.error('usePrice::Error::', error.message)
    return undefined
  }
  return value?.[0]
}

export function useTotalSupply(contract: Contract | Falsy, refresh: number | 'everyBlock' | 'never' = 'everyBlock'): string | undefined  {
  const { value, error } =
  useCall(
    contract && {
        contract: contract, 
        method: "totalSupply", 
        args: [], 
      }, { chainId: networkId, refresh: refresh}
  ) ?? {};
  if(error) {
    console.error('useTotalSupply::Error::', error.message)
    return undefined
  }
  return value?.[0]
}

export function useMaxSupply(contract: Contract | Falsy, refresh: number | 'everyBlock' | 'never' = 'everyBlock'): string | undefined  {
  const { value, error } =
  useCall(
    contract && {
        contract: contract, 
        method: "maxSupply", 
        args: [], 
      }, {chainId: networkId, refresh: refresh}
  ) ?? {};
  if(error) {
    console.error('useMaxSupply::Error::', error.message)
    return undefined
  }
  return value?.[0]
}
  
export function useGetSVG(contract: Contract | Falsy, tokenId:number | Falsy, refresh: number | 'everyBlock' | 'never' = 'everyBlock') {
  const { value, error } =
  useCall(
    contract && tokenId && {
        contract: contract, 
        method: "getSVG", 
        args: [tokenId], 
      }, { chainId: networkId, refresh: refresh}
  ) ?? {};
  if(error) {
    console.error('useGetSVG::Error::', error.message)
    return undefined
  }
  return value?.[0]
}

export function useGetAllSVGs(contract: Contract| Falsy, tokenIds:number[], refresh: number | 'everyBlock' | 'never' = 'everyBlock') {
  const calls = contract && tokenIds.length > 0 && tokenIds[0] !== undefined ? (tokenIds?.map(index => ({
    contract: contract,
    method: 'getSVG',
    args: [index]
  })) ?? []) : [];
  const results = useCalls(calls, { chainId: networkId, refresh: refresh}) ?? []
  results.forEach((result, idx) => {
    if(result && result.error) {
       console.error(`useGetAllSVGs::Error encountered calling 'getSVG' on ${calls[idx]?.contract.address}: ${result.error.message}`)
       console.error("useGetAllSVGs::Error::tokenIds ", tokenIds)
    }
  })
  return results.map(result => result?.value?.[0])
}

export function useBalanceOf(contract: Contract | Falsy, address:string | Falsy, refresh: number | 'everyBlock' | 'never' = 'everyBlock') {
  const { value, error } =
  useCall(
       contract && address && {
        contract: contract, 
        method: "balanceOf", 
        args: [address], 
      }, { chainId: networkId, refresh: refresh}
  ) ?? {};
  if(error) {
    console.error('useBalanceOf::Error::', error.message)
    console.error('useBalanceOf::Error::address ', address)
    return undefined
  }
  return value?.[0]
}

export function useTokenOfOwnerByIndex(contract: Contract | Falsy, address:string | Falsy, tokenId:number | Falsy, refresh: number | 'everyBlock' | 'never' = 'everyBlock') {
  const { value, error } =
  useCall(
       contract && address && tokenId && {
        contract: contract, 
        method: "tokenOfOwnerByIndex", 
        args: [address, tokenId], 
      }, { chainId: networkId, refresh: refresh}
  ) ?? {};
  if(error) {
    console.error('useTokenOfOwnerByIndex::Error::', error.message)
    return undefined
  }
  return value?.[0]
}

export function useTokenOfOwner(contract: Contract| Falsy, address:string | Falsy, ownedTokens:number[], refresh: number | 'everyBlock' | 'never' = 'everyBlock') {

  const calls = contract && address && ownedTokens.length>0 && ownedTokens[0] !== undefined ? (ownedTokens?.map(index => ({
    contract: contract,
    method: 'tokenOfOwnerByIndex',
    args: [address, index]
  }), { chainId: networkId, refresh: refresh}) ?? []) : [];
  const results = useCalls(calls) ?? []
  results.forEach((result, idx) => {
    if(result && result.error) {
      console.error(`useTokenOfOwner::Error encountered calling 'tokenOfOwnerByIndex' on ${calls[idx]?.contract.address}: ${result.error.message}`)
      console.error("useTokenOfOwner::Error::ownedTokens ", ownedTokens)
    }
  })
  return results.map(result => result?.value?.[0])
}

export function useOwner(contract: Contract | Falsy, refresh: number | 'everyBlock' | 'never' = 'everyBlock'): String | undefined  {
  const { value, error } =
  useCall(
    contract && {
        contract: contract, 
        method: "owner", 
        args: [], 
      }, { chainId: networkId, refresh: refresh}
  ) ?? {};
  if(error) {
    console.error('useOwner::Error::', error.message)
    return undefined
  }
  return value?.[0]
}

export function useRoyalyAddress(contract: Contract | Falsy, refresh: number | 'everyBlock' | 'never' = 'everyBlock'): String | undefined  {
  const { value, error } =
  useCall(
    contract && {
        contract: contract, 
        method: "royalyAddress", 
        args: [], 
      }, { chainId: networkId, refresh: refresh}
  ) ?? {};
  if(error) {
    console.error('useRoyalyAddress::Error::', error.message)
    return undefined
  }
  return value?.[0]
}