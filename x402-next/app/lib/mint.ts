import { CdpClient, EvmSmartAccount } from "@coinbase/cdp-sdk";
import {
  createPublicClient,
  http,
  encodeFunctionData,
  parseEther,
  formatEther,
  decodeEventLog,
  type Address,
  type Hex,
} from "viem";
import { base } from "viem/chains";
import { abi } from "./xonin/constants";
import { withTransactionRetry, withUserOperationRetry } from "./retry";

interface MintResult {
  success: boolean;
  tokenId?: string;
  tokenURI?: string;
  buyerAddress?: string;
  mintTransactionHash?: string;
  transferTransactionHash?: string;
  openSeaUrl?: string;
  error?: string;
  // Additional metadata for failed transactions
  withdrawTransactionHash?: string;
  ethTransferTransactionHash?: string;
  userOpHash?: string;
}

/**
 * Shared mint logic for Xonin NFT collections
 * Mints an NFT from the specified contract and transfers it to the buyer
 *
 * @param contractAddress - The NFT contract address to mint from
 * @param buyerAddress - The address to transfer the minted NFT to
 * @returns MintResult object with success status and transaction details
 */
export async function mintNFT(
  contractAddress: Address,
  buyerAddress: Address,
): Promise<MintResult> {
  try {
    // Initialize CDP client
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID as string,
      apiKeySecret: process.env.CDP_API_KEY_SECRET as string,
      walletSecret: process.env.CDP_WALLET_SECRET as string,
    });

    // Get or create the owner account for the smart account (generic name for both collections)
    console.log("Getting or creating owner account...");
    const owner = await cdp.evm.getOrCreateAccount({
      name: "xonin-shapes-owner",
    });
    console.log("Owner account address:", owner.address);

    // Get or create the smart account with the owner (generic name for both collections)
    console.log("Getting or creating smart account...");
    const smartAccount = (await cdp.evm.getOrCreateSmartAccount({
      name: "xonin-shapes-smart",
      owner,
    })) as EvmSmartAccount;
    console.log("Smart account address:", smartAccount.address);

    // Create viem public client for Base network
    const publicClient = createPublicClient({
      chain: base,
      transport: process.env.RPC_URL ? http(process.env.RPC_URL) : http(),
    });

    // Check smart account balance and fund if necessary
    const mintPrice = parseEther((process.env.MINT_PRICE as string) || "0.001");

    console.log("Checking smart account balance...");
    const smartAccountBalance = await publicClient.getBalance({
      address: smartAccount.address as Address,
    });
    console.log("Smart account balance:", formatEther(smartAccountBalance), "ETH");
    console.log("Required mint price:", formatEther(mintPrice), "ETH");

    if (smartAccountBalance < mintPrice) {
      console.log("Smart account balance insufficient. Checking contract balance...");

      const contractBalance = await withTransactionRetry(async () => {
        return await publicClient.getBalance({
          address: contractAddress,
        });
      });
      console.log(`Contract '${contractAddress}' balance:`, formatEther(contractBalance), "ETH");

      if (contractBalance >= mintPrice) {
        console.log("Contract has sufficient balance. Withdrawing ETH...");

        // Encode the withdraw call
        const withdrawData = encodeFunctionData({
          abi,
          functionName: "withdraw",
        }) as Hex;

        // Use owner wallet to withdraw from contract
        const withdrawResult = await withTransactionRetry(async () => {
          return await owner.sendTransaction({
            network: "base",
            transaction: {
              to: contractAddress,
              data: withdrawData,
            },
          });
        });

        console.log("Waiting for withdraw transaction to be confirmed...");
        const withdrawReceipt = await withTransactionRetry(async () => {
          return await publicClient.waitForTransactionReceipt({
            hash: withdrawResult.transactionHash as Hex,
          });
        });

        if (withdrawReceipt.status !== "success") {
          console.error("Withdraw transaction failed");
          return {
            success: false,
            error: "Failed to withdraw ETH from contract",
            withdrawTransactionHash: withdrawResult.transactionHash,
          };
        }

        console.log("Withdraw confirmed. Transferring ETH to smart account...");

        // Transfer ETH from owner to smart account
        const transferEthResult = await withTransactionRetry(async () => {
          return await owner.sendTransaction({
            network: "base",
            transaction: {
              to: smartAccount.address as Address,
              value: contractBalance,
            },
          });
        });

        console.log("Waiting for ETH transfer to be confirmed...");
        const transferEthReceipt = await withTransactionRetry(async () => {
          return await publicClient.waitForTransactionReceipt({
            hash: transferEthResult.transactionHash as Hex,
          });
        });

        if (transferEthReceipt.status !== "success") {
          console.error("ETH transfer to smart account failed");
          return {
            success: false,
            error: "Failed to transfer ETH to smart account",
            ethTransferTransactionHash: transferEthResult.transactionHash,
            withdrawTransactionHash: withdrawResult.transactionHash,
          };
        }

        console.log("Smart account funded successfully");
      } else {
        console.error("Insufficient funds in both smart account and contract");
        return {
          success: false,
          error: "Insufficient funds to mint NFT",
        };
      }
    } else {
      console.log("Smart account has sufficient balance");
    }

    // Encode the mintNFT() call
    const mintData = encodeFunctionData({
      abi: abi,
      functionName: "mintNFT",
    }) as Hex;

    console.log("Sending mint transaction...");
    // Send user operation to mint the NFT
    const result = await withUserOperationRetry(async () => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (smartAccount.sendUserOperation as any)({
        network: "base",
        calls: [
          {
            to: contractAddress,
            value: parseEther((process.env.MINT_PRICE as string) || "0.001") as bigint,
            data: mintData as Hex,
          },
        ],
        paymasterUrl: process.env.PAYMASTER_URL,
      });
    });

    console.log("User operation status:", result.status);
    console.log("Waiting for user operation to be confirmed...");

    // Wait for the user operation to be confirmed
    const userOperation = await cdp.evm.waitForUserOperation({
      smartAccountAddress: smartAccount.address,
      userOpHash: result.userOpHash,
    });
    console.log("User operation:", userOperation);

    if (userOperation.status !== "complete") {
      console.error("User operation failed");
      return {
        success: false,
        error: "Mint transaction failed",
        userOpHash: result.userOpHash,
        mintTransactionHash:
          "transactionHash" in userOperation
            ? (userOperation.transactionHash as string)
            : undefined,
        buyerAddress,
      };
    }

    const transactionHash = userOperation.transactionHash as Hex;
    console.log("Mint transaction confirmed:", transactionHash);

    // Wait for transaction receipt to get logs
    const receipt = await withTransactionRetry(async () => {
      return await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      });
    });

    // Parse Transfer event logs to find the minted tokenId
    // Transfer event: Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
    let tokenId: bigint | null = null;

    for (const log of receipt.logs) {
      try {
        const logWithTopics = log as typeof log & { topics: [Hex, ...Hex[]] };
        if (!logWithTopics.topics || logWithTopics.topics.length === 0) continue;

        const decoded = decodeEventLog({
          abi,
          data: log.data,
          topics: logWithTopics.topics,
        }) as unknown as {
          eventName: string;
          args: { from: Address; to: Address; tokenId: bigint };
        };

        // Look for Transfer from zero address (mint) to smart account
        if (decoded.eventName === "Transfer") {
          if (
            decoded.args.from === "0x0000000000000000000000000000000000000000" &&
            decoded.args.to?.toLowerCase() === smartAccount.address.toLowerCase()
          ) {
            tokenId = decoded.args.tokenId;
            break;
          }
        }
      } catch {
        // Skip logs that don't match the Transfer event
        continue;
      }
    }

    if (tokenId === null) {
      console.error("Could not find tokenId in transaction logs");
      return {
        success: false,
        error: "Failed to extract tokenId from mint transaction",
        mintTransactionHash: transactionHash,
        buyerAddress,
      };
    }

    console.log("Minted tokenId:", tokenId.toString());

    // Get tokenURI from the contract
    const tokenURI = (await withTransactionRetry(async () => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (publicClient.readContract as any)({
        address: contractAddress,
        abi,
        functionName: "tokenURI",
        args: [tokenId],
      });
    })) as string;

    // Encode the transferFrom call to transfer NFT to buyer
    const transferData = encodeFunctionData({
      abi,
      functionName: "transferFrom",
      args: [smartAccount.address as Address, buyerAddress, tokenId],
    }) as Hex;

    console.log("Sending transfer transaction to buyer...");
    // Send user operation to transfer the NFT to the buyer
    const transferResult = await withUserOperationRetry(async () => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (cdp.evm.sendUserOperation as any)({
        smartAccount,
        network: "base",
        calls: [
          {
            to: contractAddress,
            value: parseEther("0") as bigint,
            data: transferData,
          },
        ],
        paymasterUrl: process.env.PAYMASTER_URL,
      });
    });

    console.log("Transfer user operation status:", transferResult.status);
    console.log("Waiting for transfer to be confirmed...");

    // Wait for the transfer to be confirmed
    const transferUserOp = await cdp.evm.waitForUserOperation({
      smartAccountAddress: smartAccount.address,
      userOpHash: transferResult.userOpHash,
    });

    if (transferUserOp.status !== "complete") {
      console.error("Transfer user operation failed");
      return {
        success: false,
        error: "NFT was minted but transfer to buyer failed",
        tokenId: tokenId.toString(),
        tokenURI: tokenURI,
        mintTransactionHash: transactionHash,
        transferTransactionHash:
          "transactionHash" in transferUserOp
            ? (transferUserOp.transactionHash as string)
            : undefined,
        userOpHash: transferResult.userOpHash,
        buyerAddress,
        openSeaUrl: `https://opensea.io/item/base/${contractAddress}/${tokenId.toString()}`,
      };
    }

    const transferTxHash = transferUserOp.transactionHash;
    console.log("Transfer transaction confirmed:", transferTxHash);

    // Return success response
    return {
      success: true,
      tokenId: tokenId.toString(),
      tokenURI: tokenURI,
      buyerAddress,
      mintTransactionHash: transactionHash,
      transferTransactionHash: transferTxHash,
      openSeaUrl: `https://opensea.io/item/base/${contractAddress}/${tokenId.toString()}`,
    };
  } catch (error) {
    console.error("Error in mint function:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to mint NFT",
    };
  }
}
