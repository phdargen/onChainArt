import { NextRequest, NextResponse } from "next/server";
import type { Address } from "viem";
import { XONIN_SHAPES } from "../../lib/xonin/constants";
import { mintNFT } from "../../lib/mint";
import { exact } from "x402/schemes";
import type { ExactEvmPayload } from "x402/types";

/**
 * Protected API route that mints a Xonin Shapes NFT and transfers it to the buyer
 * This route is protected by the x402 payment middleware configured in middleware.ts
 *
 * @param request - The incoming request object containing x-payment header
 * @returns Promise that resolves to a NextResponse with mint result
 */
export async function GET(request: NextRequest) {
  // Get the X-PAYMENT header
  const paymentHeader = request.headers.get("x-payment");
  console.log("paymentHeader", paymentHeader);

  if (!paymentHeader) {
    return NextResponse.json({ error: "X-PAYMENT header is required" }, { status: 402 });
  }

  // Decode the payment payload
  const decodedPayment = exact.evm.decodePayment(paymentHeader);

  // Extract the buyer's address from the authorization.from field
  const buyerAddress = (decodedPayment.payload as ExactEvmPayload).authorization.from as Address;
  console.log("Minting Xonin Shapes NFT for buyer:", buyerAddress);

  // Call shared mint function with Shapes contract address
  const result = await mintNFT(XONIN_SHAPES as Address, buyerAddress);

  // Return appropriate response
  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * POST handler for minting Xonin Shapes NFT
 *
 * @param request - The incoming request object
 * @returns Promise that resolves to a NextResponse with mint result
 */
export async function POST(request: NextRequest) {
  // Support both GET and POST methods
  return GET(request);
}
