import { ethers, utils, constants } from "ethers";
import { useContractCall, useContractCalls, useContractFunction, useEthers } from "@usedapp/core";
import { Contract } from '@ethersproject/contracts'

import contractNftAbi from '../contracts/myNFT.json'
import contractAdresses from "../contracts/contracts.json"

const contractInterface = new ethers.utils.Interface(contractNftAbi.abi)
const contractAdress = contractAdresses["4"]["myNFT"] 

export const useMintNFT = () => {

  const contract = new Contract(contractAdress, contractInterface)

  return useContractFunction(contract, "mintNFT", { transactionName: "Mint NFT", }) 
}

export function usePrice() {

    const [price]: any = useContractCall({
      abi: contractInterface,
      address: contractAdress,
      method: "price",
      args: [],
    }) ?? [];
    return price;
  
}

export function useTotalSupply() {

  const [supply]: any = useContractCall({
    abi: contractInterface,
    address: contractAdress,
    method: "totalSupply",
    args: [],
  }) ?? [];
  return supply;

}

export function useMaxSupply() {

  const [supply]: any = useContractCall({
    abi: contractInterface,
    address: contractAdress,
    method: "maxSupply",
    args: [],
  }) ?? [];
  return supply;

}
  
export function useGetSVG(tokenId:number) {

  const [svg]: any = useContractCall({
    abi: contractInterface,
    address: contractAdress,
    method: "getSVG",
    args: [tokenId],
  }) ?? [];
  return svg;
}

export function useGetAllSVGs(tokenIds:number[]) {

  return useContractCalls(
    tokenIds ?
        tokenIds.map( (index) => ( {
          abi: contractInterface,
          address: contractAdress,
          method: "getSVG",
          args: [index],
      }))
      : []
  );
}

export function useBalanceOf(address:string) {

  const [balance]: any = useContractCall({
    abi: contractInterface,
    address: contractAdress,
    method: "balanceOf",
    args: [address],
  }) ?? [];
  return balance;
}

export function useTokenOfOwnerByIndex(address:string, tokenId:number) {

  const [id]: any = useContractCall({
    abi: contractInterface,
    address: contractAdress,
    method: "tokenOfOwnerByIndex",
    args: [address, tokenId],
  }) ?? [];
  return id;
}


export function useTokenOfOwner(address:string, ownedTokens:number[]) {
 
  return useContractCalls(
    ownedTokens ?
    ownedTokens.map( (index) => ( {
          abi: contractInterface,
          address: contractAdress,
          method: "tokenOfOwnerByIndex",
          args: [address, index],
      }))
      : []
  );
}
