import { ethers, utils, constants } from "ethers";
import { useContractCall, useContractCalls, useContractFunction, useEthers, useEtherBalance, useCall, Rinkeby } from "@usedapp/core";
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'

//import { QueryParams } from '@usedapp/core/constants/type/QueryParams'

import contractNftAbi from '../contracts/myNFT.json'
import contractAdresses from "../contracts/contracts.json"

const contractInterface = new utils.Interface(contractNftAbi.abi)
//const contractInterface = new ethers.utils.Interface(contractNftAbi.abi)
//const contractAdress = contractAdresses["4"]["myNFT"] 

export const useMintNFT = () => {
  const { account, chainId } = useEthers()
  const contractAdress = chainId ? contractAdresses["4"]["myNFT"] : constants.AddressZero

  const contract = new Contract(contractAdress, contractInterface)

  return useContractFunction(contract, "mintNFT", { transactionName: "Mint NFT", }) 
}

export function usePrice() {

    const contractAdress =  contractAdresses["4"]["myNFT"] 

    const [price]: any = useContractCall({
      abi: contractInterface,
      address: contractAdress,
      method: "price",
      args: [],
    }) ?? [];
    return price;
  
}

export function useTotalSupply( ) {

  //const { account, chainId } = useEthers()
  const contractAdress =  contractAdresses["4"]["myNFT"] 
  //console.log(chainId)

  const { value, error } = useCall( contractAdress && {
    contract: new Contract(contractAdress, contractInterface),
    //abi: contractInterface,
    //address: contractAdress,
    method: "totalSupply",
    args: [],
    },
    { chainId: Rinkeby.chainId }) ?? {};

  if(error) {
      console.error(error.message)
      return undefined
  }
  return value?.[0]

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


export function useTokenOfOwner(address:string, ownedTokens:number[]) {

  const { account, chainId } = useEthers()
  const contractAdress = chainId ? contractAdresses["4"]["myNFT"] : constants.AddressZero
 
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
