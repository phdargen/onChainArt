import { facilitator } from "@coinbase/x402";
import { Address } from "viem";
import { paymentMiddleware, Resource } from "x402-next";

const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL as Resource;
const payTo = process.env.RESOURCE_WALLET_ADDRESS as Address;
const price = process.env.MINT_PRICE_USDC as string;

// The CDP API key ID and secret are required to use the mainnet facilitator
if (!payTo || !process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET) {
  console.error("Missing required environment variables");
  process.exit(1);
}

export const middleware = paymentMiddleware(
  payTo,
  {
    "/api/mint-shapes": {
      price: "$" + price,
      network: "base",
      config: {
        discoverable: true,
        description:
          "Xonin - A generative art NFT collection featuring unique abstract designs of layered vivid curves and geometric shapes, crafted with 100 distinct color palettes. The artworks are created, rendered and stored fully onchain to ensure immutability and permanence. Employed art style: Shapes. Website: https://xonin.vercel.app; X: https://x.com/XoninNFT.",
        inputSchema: {
          bodyType: "json",
          bodyFields: {},
        },
        outputSchema: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Whether the NFT was successfully minted and transferred",
            },
            tokenId: {
              type: "string",
              description: "The ID of the minted NFT",
            },
            tokenURI: {
              type: "string",
              description: "The URI pointing to the NFT metadata",
            },
            buyerAddress: {
              type: "string",
              description: "Wallet address that received NFT",
            },
            mintTransactionHash: {
              type: "string",
              description: "Transaction hash of mint operation",
            },
            transferTransactionHash: {
              type: "string",
              description: "Transaction hash of transfer to buyer",
            },
            openSeaUrl: {
              type: "string",
              description: "OpenSea URL to view NFT",
            },
            error: {
              type: "string",
              description: "Error message",
            },
          },
          required: ["success"],
        },
      },
    },
    "/api/mint-paths": {
      price: "$" + price,
      network: "base",
      config: {
        discoverable: true,
        description:
          "Xonin - A generative art NFT collection featuring unique abstract designs of layered vivid curves and geometric shapes, crafted with 100 distinct color palettes. The artworks are created, rendered and stored fully onchain to ensure immutability and permanence. Employed art style: Paths. Website: https://xonin.vercel.app; X: https://x.com/XoninNFT.",
        inputSchema: {
          bodyType: "json",
          bodyFields: {},
        },
        outputSchema: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Whether the NFT was successfully minted and transferred",
            },
            tokenId: {
              type: "string",
              description: "The ID of the minted NFT",
            },
            tokenURI: {
              type: "string",
              description: "The URI pointing to the NFT metadata",
            },
            buyerAddress: {
              type: "string",
              description: "Wallet address that received NFT",
            },
            mintTransactionHash: {
              type: "string",
              description: "Transaction hash of mint operation",
            },
            transferTransactionHash: {
              type: "string",
              description: "Transaction hash of transfer to buyer",
            },
            openSeaUrl: {
              type: "string",
              description: "OpenSea URL to view NFT",
            },
            error: {
              type: "string",
              description: "Error message",
            },
          },
          required: ["success"],
        },
      },
    },
  },
  process.env.NEXT_PUBLIC_FACILITATOR_URL !== "" ? { url: facilitatorUrl } : facilitator,
);

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/api/mint-shapes/:path*", "/api/mint-paths/:path*"],
  runtime: "nodejs",
};
