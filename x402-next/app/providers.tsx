'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';

export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          name: "Xonin",
          logo: "https://xonin-x402.vercel.app/token0.png",
          theme: 'default',
        },
        wallet: {
          display: "modal",
          preference: 'all',
          supportedWallets: {
            rabby: true,
          },
        },
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}

