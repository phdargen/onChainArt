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
import xoninGif from "./assets/xonin.gif";

type CollectionType = "shapes" | "paths";

export default function Home() {
  const { address, isConnected, connector, chainId } = useAccount();
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mintingCollection, setMintingCollection] = useState<CollectionType | null>(null);

  const config = createConfig({
    chains: [base],
    client({ chain }) {
      return createClient({ chain, transport: http() });
    },
  });

  const handleMint = useCallback(
    async (collection: CollectionType) => {
      if (!isConnected) {
        setError("Please connect your wallet first");
        return;
      }

      setMintingCollection(collection);
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
          setMintingCollection(null);
          return;
        }

        // Set maxValue to support payments in USDC base units (USDC has 6 decimals)
        const mintPriceInUsdc = parseFloat(process.env.MINT_PRICE_USDC || "0.001");
        const maxValueInBaseUnits = BigInt(Math.ceil(mintPriceInUsdc * 10 ** 6)*2); // Convert USDC to base units
        const fetchWithPayment = wrapFetchWithPayment(
          fetch,
          walletClient as unknown as Parameters<typeof wrapFetchWithPayment>[1],
          maxValueInBaseUnits
        );

        console.log("Calling mint API with payment...");

        const endpoint = collection === "shapes" ? "/api/mint-shapes" : "/api/mint-paths";
        const apiResponse = await fetchWithPayment(endpoint, {
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
        setMintingCollection(null);
      }
    },
    [isConnected, address, chainId, connector, config]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold mb-2 text-gray-900 font-mono">Xonin</h1>
          <p className="text-lg text-gray-600 font-mono">Fully onchain generative art NFT minted through x402</p>
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
            Choose an art style to mint. Payment of ${process.env.MINT_PRICE_USDC || "0.001"} USDC will be processed via x402 protocol.
          </p>
          
          {/* Xonin GIF Display */}
          <div className="flex justify-center mb-6">
            <img 
              src={xoninGif.src} 
              alt="Xonin NFT Animation" 
              className="rounded-lg shadow-md max-w-xs w-full"
            />
          </div>
          
          {/* Two Mint Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => handleMint("shapes")}
              disabled={!isConnected || isLoading}
              className={`py-3 px-4 rounded-lg font-mono font-medium transition-colors ${
                !isConnected || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isLoading && mintingCollection === "shapes" ? "Minting..." : "Mint Shapes"}
            </button>
            
            <button
              onClick={() => handleMint("paths")}
              disabled={!isConnected || isLoading}
              className={`py-3 px-4 rounded-lg font-mono font-medium transition-colors ${
                !isConnected || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isLoading && mintingCollection === "paths" ? "Minting..." : "Mint Paths"}
            </button>
          </div>
          
          {!isConnected && (
            <p className="mt-2 text-sm text-yellow-600 font-mono text-center">
              Please connect your wallet
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
                {/* Display NFT Image */}
                {response.tokenURI && (() => {
                  try {
                    // Parse the data URI to extract the JSON metadata
                    const dataPrefix = "data:application/json;utf8,";
                    if (response.tokenURI.startsWith(dataPrefix)) {
                      const jsonString = response.tokenURI.substring(dataPrefix.length);
                      const metadata = JSON.parse(jsonString);
                      
                      if (metadata.image) {
                        // Extract SVG markup from data URI
                        const svgPrefix = "data:image/svg+xml;utf8,";
                        let svgMarkup = metadata.image;
                        
                        if (metadata.image.startsWith(svgPrefix)) {
                          svgMarkup = metadata.image.substring(svgPrefix.length);
                        }
                        
                        return (
                          <div className="flex justify-center mb-6">
                            <div className="bg-white border-4 border-gray-200 rounded-lg p-4 shadow-lg max-w-md w-full">
                              <div 
                                className="w-full overflow-hidden rounded-lg [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-w-full"
                                dangerouslySetInnerHTML={{ __html: svgMarkup }}
                              />
                              {metadata.name && (
                                <p className="text-center mt-3 font-mono text-sm text-gray-700">
                                  {metadata.name}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      }
                    }
                  } catch (e) {
                    console.error("Error parsing tokenURI:", e);
                  }
                  return null;
                })()}

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
                  {response.openSeaUrl && (
                    <p className="text-sm text-gray-700 font-mono mb-2">
                      <strong>OpenSea URL:</strong>
                      <a 
                        href={response.openSeaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs mt-1 text-blue-600 hover:text-blue-800 break-all"
                      >
                        {response.openSeaUrl}
                      </a>
                    </p>
                  )}
                </div>


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

      </div>
    </div>
  );
}
