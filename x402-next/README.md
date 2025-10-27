# Xonin NFT Mint with x402

This is a Next.js application that demonstrates NFT minting with x402 payment protocol integration. Users can connect their wallet and mint Xonin Shapes NFTs by paying $0.001 USDC through the x402 protocol.

## Prerequisites

- Node.js v22+ (install via [nvm](https://github.com/nvm-sh/nvm))
- npm (comes with Node.js)
- A valid Ethereum address for receiving payments
- Coinbase CDP API credentials
- Coinbase OnchainKit API key

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Wallet Configuration
RESOURCE_WALLET_ADDRESS=0x...           # Your Ethereum address for receiving payments
NETWORK=base                             # or 'base-sepolia' for testnet
NETWORK_ID=base                          # CDP network ID

# Coinbase CDP Configuration
CDP_API_KEY_ID=...
CDP_API_KEY_SECRET=...
CDP_WALLET_SECRET=...                    # Optional: for persistent wallet
ADDRESS=0x...                            # Optional: specific wallet address
RPC_URL=...                              # Optional: custom RPC endpoint

# x402 Facilitator
NEXT_PUBLIC_FACILITATOR_URL=https://x402-facilitator.base.org

# OnchainKit Configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=...      # Get from Coinbase Cloud
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

3. Start the development server:
```bash
npm run dev
```

## Features

### NFT Minting with x402 Payment
The landing page includes a mint button that allows users to:

1. Connect their wallet using Coinbase OnchainKit
2. Pay $0.001 USDC via x402 protocol
3. Receive a minted Xonin Shapes NFT transferred to their address

The `/api/mint` endpoint is protected by x402 middleware:

```typescript
// middleware.ts
export const middleware = paymentMiddleware(
  payTo,
  {
    "/api/mint": {
      price: "$0.001",
      network: "base",
      config: {
        discoverable: false,
        description: "Mint NFT - returns buyer address",
      },
    },
  },
  facilitator
);

export const config = {
  matcher: ["/api/mint/:path*"],
  runtime: "nodejs",
};
```

### How It Works

1. **User connects wallet** - Using Coinbase OnchainKit with wagmi
2. **User clicks "Mint NFT"** - Button triggers payment flow
3. **x402 payment processed** - `x402-fetch` wrapper handles payment automatically
4. **Smart account mints NFT** - CDP smart account mints the NFT on Base
5. **NFT transferred to user** - NFT is transferred from smart account to user's address
6. **Response displayed** - Transaction details and token info shown to user

## Technology Stack

- **Next.js 15** - React framework
- **x402-next** - Payment middleware for Next.js routes
- **x402-fetch** - Client-side payment wrapper
- **Coinbase OnchainKit** - Wallet connection UI components
- **wagmi** - React hooks for Ethereum
- **viem** - TypeScript interface for Ethereum
- **Coinbase CDP SDK** - Smart account and wallet management

## Accessing Mainnet

To access the mainnet facilitator in NextJs, a temporary workaround is currently needed. The `@coinbase/x402` package currently only supports Node.js runtimes and is incompatible with the Edge runtime. Coinbase is actively working on Edge runtime compatibility.

As a **temporary solution** until official support is available, you can enable the Node.js runtime for middleware:

1. Enable Node middleware as an experimental feature:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  // rest of your next config setup
  experimental: {
    nodeMiddleware: true,
  }
};
```

2. Specify the Node.js runtime in your middleware:

```ts
// middleware.ts
export const config = {
  // rest of your config setup
  runtime: 'nodejs',
};
```

3. Use the `canary` version of Next.js to access experimental features:

```json
// package.json
{
  "dependencies": {
    "next": "canary",
  }
}
```

**Note:** This approach is only needed temporarily while awaiting official Edge runtime support in the x402 package.