import { NextRequest, NextResponse } from "next/server";
import { exact } from "x402/schemes";
import type { ExactEvmPayload } from "x402/types";
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
import { XONIN_SHAPES, abi } from "../../lib/xonin/constants";
import { withTransactionRetry, withUserOperationRetry } from "../../lib/retry";

/**
 *
 *
 * Protected API route that mints an Xonin Shapes NFT and transfers it to the buyer
 * This route is protected by the x402 payment middleware configured in middleware.ts
 */
export async function GET(request: NextRequest) {
  try {
    // Get the X-PAYMENT header
    // const paymentHeader = request.headers.get("x-payment");
    // console.log("paymentHeader", paymentHeader);

    // if (!paymentHeader) {
    //   return NextResponse.json(
    //     { error: "X-PAYMENT header is required" },
    //     { status: 402 }
    //   );
    // }

    // Decode the payment payload
    // const decodedPayment = exact.evm.decodePayment(paymentHeader);

    // Extract the buyer's address from the authorization.from field
    // const buyerAddress = (decodedPayment.payload as ExactEvmPayload).authorization.from as Address;

    const buyerAddress = process.env.RESOURCE_WALLET_ADDRESS as Address;
    console.log("Buyer address:", buyerAddress);

    // Initialize CDP client
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID as string,
      apiKeySecret: process.env.CDP_API_KEY_SECRET as string,
      walletSecret: process.env.CDP_WALLET_SECRET as string,
    });

    // Get or create the owner account for the smart account
    console.log("Getting or creating owner account...");
    const owner = await cdp.evm.getOrCreateAccount({
      name: "xonin-shapes-owner",
    });
    console.log("Owner account address:", owner.address);

    // Get or create the smart account with the owner
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
      console.log("Smart account balance insufficient. Checking XONIN_SHAPES contract balance...");

      const contractBalance = await publicClient.getBalance({
        address: XONIN_SHAPES as Address,
      });
      console.log("XONIN_SHAPES contract balance:", formatEther(contractBalance), "ETH");

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
              to: XONIN_SHAPES as Address,
              data: withdrawData,
            },
          });
        });

        console.log("Waiting for withdraw transaction to be confirmed...");
        const withdrawReceipt = await publicClient.waitForTransactionReceipt({
          hash: withdrawResult.transactionHash as Hex,
        });

        if (withdrawReceipt.status !== "success") {
          console.error("Withdraw transaction failed");
          return NextResponse.json(
            { success: false, error: "Failed to withdraw ETH from contract" },
            { status: 500 },
          );
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
        const transferEthReceipt = await publicClient.waitForTransactionReceipt({
          hash: transferEthResult.transactionHash as Hex,
        });

        if (transferEthReceipt.status !== "success") {
          console.error("ETH transfer to smart account failed");
          return NextResponse.json(
            { success: false, error: "Failed to transfer ETH to smart account" },
            { status: 500 },
          );
        }

        console.log("Smart account funded successfully");
      } else {
        console.error("Insufficient funds in both smart account and contract");
        return NextResponse.json(
          {
            success: false,
            error: "Insufficient funds to mint NFT",
            smartAccountBalance: smartAccountBalance.toString(),
            contractBalance: contractBalance.toString(),
            required: mintPrice.toString(),
          },
          { status: 500 },
        );
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
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await withUserOperationRetry(async () => {
      return await (smartAccount.sendUserOperation as any)({
        network: "base",
        calls: [
          {
            to: XONIN_SHAPES as Address,
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
      return NextResponse.json(
        { success: false, error: "Mint transaction failed" },
        { status: 500 },
      );
    }

    const transactionHash = userOperation.transactionHash as Hex;
    console.log("Mint transaction confirmed:", transactionHash);

    // Wait for transaction receipt to get logs
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
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
      return NextResponse.json(
        { success: false, error: "Failed to extract tokenId from mint transaction" },
        { status: 500 },
      );
    }

    console.log("Minted tokenId:", tokenId.toString());

    // Get tokenURI from the contract
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tokenURI = (await (publicClient.readContract as any)({
      address: XONIN_SHAPES as Address,
      abi,
      functionName: "tokenURI",
      args: [tokenId],
    })) as string;

    // Encode the transferFrom call to transfer NFT to buyer
    const transferData = encodeFunctionData({
      abi,
      functionName: "transferFrom",
      args: [smartAccount.address as Address, buyerAddress, tokenId],
    }) as Hex;

    console.log("Sending transfer transaction to buyer...");
    // Send user operation to transfer the NFT to the buyer
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transferResult = await withUserOperationRetry(async () => {
      return await (cdp.evm.sendUserOperation as any)({
        smartAccount,
        network: "base",
        calls: [
          {
            to: XONIN_SHAPES as Address,
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
      return NextResponse.json(
        {
          success: false,
          error: "Transfer to buyer failed",
          tokenId: tokenId.toString(),
          note: "NFT was minted but transfer failed - still owned by smart account",
        },
        { status: 500 },
      );
    }

    const transferTxHash = transferUserOp.transactionHash;
    console.log("Transfer transaction confirmed:", transferTxHash);

    // Return success response
    return NextResponse.json({
      success: true,
      tokenId: tokenId.toString(),
      tokenURI: tokenURI,
      buyerAddress,
      mintTransactionHash: transactionHash,
      transferTransactionHash: transferTxHash,
      openSeaUrl: `https://opensea.io/item/base/${XONIN_SHAPES}/${tokenId.toString()}`,
    });
  } catch (error) {
    console.error("Error in mint route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to mint NFT",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  // Support both GET and POST methods
  return GET(request);
}
