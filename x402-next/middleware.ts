import { facilitator } from "@coinbase/x402";
import { Address } from "viem";
import { paymentMiddleware, Resource } from "x402-next";

const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL as Resource;
const payTo = process.env.RESOURCE_WALLET_ADDRESS as Address;

// The CDP API key ID and secret are required to use the mainnet facilitator
if (!payTo || !process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET) {
  console.error("Missing required environment variables");
  process.exit(1);
}

export const middleware = paymentMiddleware(
  payTo,
  {
    "/api/mint-shapes": {
      price: "$0.001",
      network: "base",
      config: {
        discoverable: false,
        description: "Mint Xonin Shapes NFT",
      },
    },
    "/api/mint-paths": {
      price: "$0.001",
      network: "base",
      config: {
        discoverable: false,
        description: "Mint Xonin Paths NFT",
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
