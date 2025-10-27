"use client";

import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { getWalletClient } from "wagmi/actions";
import { createConfig, http } from "@wagmi/core";
import { base } from "@wagmi/core/chains";
import { createClient } from "viem";
import { wrapFetchWithPayment } from "x402-fetch";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import WordmarkCondensed from './assets/x402_wordmark_light.svg';

export default function Home() {
  const { address, isConnected, connector, chainId } = useAccount();
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const config = createConfig({
    chains: [base],
    client({ chain }) {
      return createClient({ chain, transport: http() });
    },
  });

  const handleMint = useCallback(
    async () => {
      if (!isConnected) {
        setError("Please connect your wallet first");
        return;
      }

      setIsLoading(true);
      setError("");
      setResponse(null);

      try {
        const walletClient = await getWalletClient(config, {
          account: address,
          chainId: chainId,
          connector: connector,
        });

        if (!walletClient) {
          setError("Wallet client not available");
          setIsLoading(false);
          return;
        }

        // Set maxValue to support payments up to $0.001 USDC (0.001 * 10^6 base units)
        const maxValueInBaseUnits = BigInt(1 * 10 ** 3); // 0.001 USDC
        const fetchWithPayment = wrapFetchWithPayment(
          fetch,
          walletClient as unknown as Parameters<typeof wrapFetchWithPayment>[1],
          maxValueInBaseUnits
        );

        console.log("Calling mint API with payment...");

        const apiResponse = await fetchWithPayment("/api/mint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("API response status:", apiResponse.status);

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          console.error("API error response:", errorText);

          if (apiResponse.status === 402) {
            throw new Error(`Payment Required (402): ${errorText}`);
          } else {
            throw new Error(`HTTP error! status: ${apiResponse.status}, message: ${errorText}`);
          }
        }

        const data = await apiResponse.json();
        console.log("API response data:", data);
        setResponse(data);
      } catch (err) {
        console.error("Error calling mint API:", err);
        setError(
          err instanceof Error ? err.message : "Unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, address, chainId, connector, config]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-64 mb-6 mx-auto">
            <WordmarkCondensed className="mx-auto" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900 font-mono">Xonin NFT Mint</h1>
          <p className="text-lg text-gray-600 font-mono">Mint an NFT using x402 payment protocol</p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-6">
          <Wallet className="w-full">
            <ConnectWallet className="w-full py-3">
              <Avatar className="h-5 w-5 opacity-80" />
              <Name className="opacity-80 text-sm" />
            </ConnectWallet>
            <WalletDropdown>
              <WalletDropdownDisconnect className="opacity-80" />
            </WalletDropdown>
          </Wallet>
        </div>

        {/* Mint Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 font-mono">Mint NFT</h2>
          <p className="text-sm text-gray-600 mb-6 font-mono">
            Click below to mint a Xonin Shapes NFT. Payment of $0.001 USDC will be processed via x402 protocol.
          </p>
          
          <button
            onClick={handleMint}
            disabled={!isConnected || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-mono font-medium transition-colors ${
              !isConnected || isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isLoading ? "Minting..." : "Mint NFT ($0.001)"}
          </button>
          
          {!isConnected && (
            <p className="mt-4 text-sm text-yellow-600 font-mono text-center">
              Please connect your wallet first
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2 font-mono">Error</h3>
            <p className="text-red-600 text-sm font-mono">{error}</p>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 font-mono">
              {response.success ? "✅ Mint Successful!" : "❌ Mint Failed"}
            </h2>
            
            {response.success ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 font-mono mb-2">
                    <strong>Token ID:</strong> {response.tokenId}
                  </p>
                  <p className="text-sm text-gray-700 font-mono mb-2">
                    <strong>Buyer Address:</strong> 
                    <span className="block text-xs mt-1 break-all">{response.buyerAddress}</span>
                  </p>
                  {response.mintTransactionHash && (
                    <p className="text-sm text-gray-700 font-mono mb-2">
                      <strong>Mint Transaction:</strong>
                      <a 
                        href={`https://basescan.org/tx/${response.mintTransactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs mt-1 text-blue-600 hover:text-blue-800 break-all"
                      >
                        {response.mintTransactionHash}
                      </a>
                    </p>
                  )}
                  {response.transferTransactionHash && (
                    <p className="text-sm text-gray-700 font-mono">
                      <strong>Transfer Transaction:</strong>
                      <a 
                        href={`https://basescan.org/tx/${response.transferTransactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs mt-1 text-blue-600 hover:text-blue-800 break-all"
                      >
                        {response.transferTransactionHash}
                      </a>
                    </p>
                  )}
                </div>

                {response.tokenURI && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 font-mono">Token Metadata</h3>
                    <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-xs font-mono text-gray-800">
                        {response.tokenURI}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700 font-mono">
                  {response.error || "An unknown error occurred"}
                </p>
                {response.note && (
                  <p className="text-xs text-red-600 font-mono mt-2">
                    {response.note}
                  </p>
                )}
              </div>
            )}

            {/* Full Response JSON */}
            <details className="mt-6">
              <summary className="cursor-pointer text-gray-700 font-mono text-sm hover:text-gray-900">
                View Full Response
              </summary>
              <pre className="mt-3 bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs font-mono text-gray-800">
                {JSON.stringify(response, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 py-8 text-center text-sm text-gray-500 font-mono">
          By using this site, you agree to be bound by the{' '}
          <a
            href="https://www.coinbase.com/legal/developer-platform/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            CDP Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="https://www.coinbase.com/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            Global Privacy Policy
          </a>
          .
        </footer>
      </div>
    </div>
  );
}
