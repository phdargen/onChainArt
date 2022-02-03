import { ethers, utils, constants } from "ethers";
import { useContractCall, useContractCalls, useContractFunction, useEthers, ContractCall } from "@usedapp/core";
import { Contract } from '@ethersproject/contracts'

import contractNftAbi from '../contracts/myNFT.json'
import contractAdresses from "../contracts/contracts.json"

const contractInterface = new ethers.utils.Interface(contractNftAbi.abi)

export const useMintNFT = () => {

  const { account, chainId } = useEthers()
  const contractAdress = chainId ? contractAdresses["4"]["myNFT"] : constants.AddressZero
  
  const contract = new Contract(contractAdress, contractInterface)

  return useContractFunction(contract, "mintNFT", { transactionName: "Mint NFT", }) 
}

export function usePrice() {

    const { account, chainId } = useEthers()
    const contractAdress = chainId ? contractAdresses["4"]["myNFT"] : constants.AddressZero

    const [price]: any = useContractCall({
      abi: contractInterface,
      address: contractAdress,
      method: "price",
      args: [],
    }) ?? [];
    return price;
  
}

export function useTotalSupply() {

  const { account, chainId } = useEthers()
  const contractAdress = chainId ? contractAdresses["4"]["myNFT"] : constants.AddressZero

  const [supply]: any = useContractCall({
    abi: contractInterface,
    address: contractAdress,
    method: "totalSupply",
    args: [],
  }) ?? [];
  return supply;

}

export function useMaxSupply() {

  const { account, chainId } = useEthers()
  const contractAdress = chainId ? contractAdresses["4"]["myNFT"] : constants.AddressZero

  const [supply]: any = useContractCall({
    abi: contractInterface,
    address: contractAdress,
    method: "maxSupply",
    args: [],
  }) ?? [];
  return supply;

}
  
export function useGetSVG(tokenId:number) {

  const { account, chainId } = useEthers()
  const contractAdress = chainId ? contractAdresses["4"]["myNFT"] : constants.AddressZero

  const [svg]: any = useContractCall({
    abi: contractInterface,
    address: contractAdress,
    method: "getSVG",
    args: [tokenId],
  }) ?? [];
  return svg;
}

export function useGetAllSVGs(tokenIds:number[]) {

  const { account, chainId } = useEthers()
  const contractAdress = chainId ? contractAdresses["4"]["myNFT"] : constants.AddressZero

  //const calls: Array<ContractCall> = 
  
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

  // const call =   new  ContractCall(
  //   contractInterface,
  //   contractAdress,
  //   "getSVG",
  //   [1]
  //   )

  // const calls: Array<ContractCall> = [ 
  //   call
  // ]
  // const results = useContractCalls(calls) ?? []

  // return results;
}

export function useBalanceOf(address:string) {

  const { account, chainId } = useEthers()
  const contractAdress = chainId ? contractAdresses["4"]["myNFT"] : constants.AddressZero

  const [balance]: any = useContractCall({
    abi: contractInterface,
    address: contractAdress,
    method: "balanceOf",
    args: [address],
  }) ?? [];
  return balance;
}

export function useTokenOfOwnerByIndex(address:string, tokenId:number) {

  const { account, chainId } = useEthers()
  const contractAdress = chainId ? contractAdresses["4"]["myNFT"] : constants.AddressZero

  const [id]: any = useContractCall({
    abi: contractInterface,
    address: contractAdress,
    method: "tokenOfOwnerByIndex",
    args: [address, tokenId],
  }) ?? [];
  return id;
}
