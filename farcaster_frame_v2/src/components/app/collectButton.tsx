import { sdk } from '@farcaster/frame-sdk';
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import React from "react";
import {
  useAccount,
  useConnect,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from "wagmi";

import { AnimatedBorder } from "@/components/ui/animatedBorder";
import { Button } from "@/components/ui/button";
import { isUserRejectionError } from "@/lib/errors";
import { useEthPrice } from '@/lib/hooks/useEthPrice';
import { chainId as targetChainId } from '@/lib/mockFeaturedMint';
import { useFeaturedMintTransaction } from "@/lib/queries";
import { useViewer } from "@/providers/FrameContextProvider";

interface CollectButtonProps {
  timestamp?: number;
  price: number;
  onCollect: (tokenId?: number, collection?: 'paths' | 'shapes') => void;
  onError: (error: string | undefined) => void;
  isMinting: boolean;
}

const formatEthPrice = (priceInWei: number) => {
  const eth = (priceInWei / 1e18).toFixed(3);
  return `${eth} ETH`;
};

const formatUsdPrice = (ethPrice: number, priceInWei: number) => {
  const eth = priceInWei / 1e18;
  const usd = eth * ethPrice;
  return `$${usd.toPrecision(2)}`;
};

export function CollectButton({
  price,
  onCollect,
  onError,
  isMinting,
}: CollectButtonProps) {
  const { isConnected, address, chain: currentChain } = useAccount();
  const { connect } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync, isPending: isSending } = useSendTransaction();
  const [hash, setHash] = React.useState<`0x${string}`>();
  const [isLoadingTxData, setIsLoadingTxData] = React.useState(false);
  const { frameAdded } = useViewer();
  const { data: ethPrice } = useEthPrice();
  const [currentCollection, setCurrentCollection] = React.useState<'paths' | 'shapes'>('paths');

  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  const isPending = isLoadingTxData || isSending || isConfirming;

  const successHandled = React.useRef(false);

  const { fetchTransaction } = useFeaturedMintTransaction();

  React.useEffect(() => {
    if (isSuccess && !successHandled.current && receipt) {
      successHandled.current = true;
      const tokenId = Number(receipt.logs[0].topics[3]);
      onCollect(tokenId, currentCollection);
      setHash(undefined);
      successHandled.current = false;
    }
  }, [isSuccess, onCollect, receipt, currentCollection]);

  const handleClick = async (collection: 'paths' | 'shapes') => {
    setCurrentCollection(collection);
    try {
      if (!isMinting) {
        sdk.actions.addFrame();
        return;
      }

      setHash(undefined);
      successHandled.current = false;

      if (!isConnected || !address) {
        connect({ connector: farcasterFrame() });
        return;
      }

      if (currentChain?.id !== targetChainId) {
        await switchChainAsync({ chainId: targetChainId });
      }

      setIsLoadingTxData(true);
      const {
        result: { tx },
      } = await fetchTransaction(address, collection);

      const hash = await sendTransactionAsync({
        to: tx.to,
        value: BigInt(tx.value),
        data: tx.data,
        chainId: targetChainId
      });

      setHash(hash);
    } catch (error) {
      if (!isUserRejectionError(error)) {
        onError(
          error instanceof Error ? error.message : "Something went wrong."
        );
      }
      setHash(undefined);
      successHandled.current = false;
    } finally {
      setIsLoadingTxData(false);
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)] bg-card border-t border-border">
      <div className="pb-4 px-4 pt-2">
        {isMinting && (
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="text-muted text-sm">Price</span>
            <div className="flex gap-2">
              <span className="text-foreground font-medium">
                {formatEthPrice(price)}
              </span>
              {ethPrice && (
                <span className="text-muted">
                  ({formatUsdPrice(ethPrice, price)})
                </span>
              )}
            </div>
          </div>
        )}
        <div className="flex gap-2">
          {isPending ? (
            <AnimatedBorder>
              <Button
                className="w-full relative bg-active text-active-foreground"
                disabled
              >
                {isMinting ? "Minting..." : "Adding..."}
              </Button>
            </AnimatedBorder>
          ) : (
            <>
              <Button
                className="flex-1"
                onClick={() => handleClick('paths')}
                disabled={!isMinting && frameAdded}
              >
                {!isConnected && isMinting ? "Connect" :
                  isMinting ? "Mint (Style: Paths)" :
                  frameAdded ? "Added" : "Add Frame"}
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleClick('shapes')}
                disabled={!isMinting && frameAdded}
              >
                {!isConnected && isMinting ? "Connect" :
                  isMinting ? "Mint (Style: Shapes)" :
                  frameAdded ? "Added" : "Add Frame"}
              </Button>
            </>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <Button 
            variant="secondary"
            className="flex-1"
            onClick={() => sdk.actions.openUrl("https://xonin.vercel.app/")}
          >
            Website 
          </Button>
          <Button 
            variant="secondary"
            className="flex-1"
            onClick={() => sdk.actions.openUrl("https://opensea.io/XoninNFT")}
          >
            OpenSea {targetChainId ? `(${targetChainId})` : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}
