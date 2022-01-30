import { ethers, utils, constants } from "ethers";
import { useContractCall, useContractFunction, useEthers } from "@usedapp/core";
import { Contract } from '@ethersproject/contracts'

import contractNftAbi from '../contracts/myNFT.json'
import contractAdresses from "../contracts/contracts.json"

//const simpleContractInterface = new ethers.utils.Interface(simpleContractAbi);
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
