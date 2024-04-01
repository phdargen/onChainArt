import { ethers, utils, constants } from "ethers";
import { useContractFunction, useEthers, useEtherBalance, useCall, useCalls, Rinkeby, Sepolia } from "@usedapp/core";
import { Contract } from '@ethersproject/contracts'

import contractNftAbi from '../contracts/myNFT.json'
import contractAdresses from "../contracts/contracts.json"

const contractInterface = new utils.Interface(contractNftAbi.abi)
const contractAdress = contractAdresses["11155111"]["myNFT"] 
const contract = new Contract(contractAdress, contractInterface) as any

export const useMintNFT = () => {
  const { account, chainId } = useEthers()

  return useContractFunction(contract, "mintNFT", { transactionName: "Mint NFT", }) 
}

export function usePrice() {
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

export function useTotalSupply( ) {
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

export function useMaxSupply() {
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
  
export function useGetSVG(tokenId:number) {
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

export function useGetAllSVGs(tokenIds:number[]) {
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

export function useBalanceOf(address:string) {
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

export function useTokenOfOwnerByIndex(address:string, tokenId:number) {
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


export function useTokenOfOwner(address:string, ownedTokens:number[]) {
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
