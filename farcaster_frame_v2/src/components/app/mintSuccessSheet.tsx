import { useComposeCast } from "@coinbase/onchainkit/minikit";
import { sdk } from "@farcaster/miniapp-sdk";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";

import { NFTDisplay } from '@/components/app/NFTDisplay';
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerTitle,
} from "@/components/ui/drawer";

interface MintSuccessSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tokenId?: number;
  collection: 'paths' | 'shapes';
  name: string;
  imageUrl: string;
}

export function MintSuccessSheet({
  isOpen,
  onClose,
  tokenId,
  collection,
  name,
  imageUrl,
}: MintSuccessSheetProps) {
  const handleAdd = useCallback(() => {
    onClose();
    sdk.actions.addFrame();
  }, [onClose]);

  const { composeCast } = useComposeCast();

  const handleShare = () => {
    const text = tokenId 
      ? `I just minted ${name} ${collection === 'paths' ? 'Paths' : 'Shapes'} #${tokenId}!` 
      : `I just collected ${name} ${collection === 'paths' ? 'Paths' : 'Shapes'}!`;
    
    composeCast({
      text,
      embeds: ['https://xonin-frame-v2.vercel.app/']
    });
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerOverlay className="!bg-black/30 backdrop-blur-[7.5px]" />
      <DrawerContent className="bg-card [&>svg]:hidden">
        <DrawerTitle className="sr-only">Mint Successful</DrawerTitle>

        <div className="flex flex-col items-center pt-4 pb-8">
          <div className="flex items-center gap-1">
            <CheckCircle2
              className="text-[#43B748]"
              strokeWidth={2}
              size={24}
            />
            <span className="text-2xl font-semibold">Minted Xonin {collection === 'paths' ? 'Paths' : 'Shapes'} #{tokenId}</span>
          </div>
        </div>

        <div className="max-w-[272px] mx-auto w-full mb-8">
          <div className="bg-mat rounded-xl p-2 shadow mb-4">
            {tokenId ? (
              <NFTDisplay tokenId={tokenId} collection={collection} />
            ) : (
              <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                <Image src={imageUrl} alt={name} fill className="object-cover" />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAdd}
              variant="secondary"
              className="flex-1 h-[48px]"
            >
              Add Frame
            </Button>
            <Button 
              variant="secondary"
              className="flex-1 h-[48px]"
              onClick={handleShare}
            >
              Share
            </Button>
          </div>
        </div>

        <div className="pb-[env(safe-area-inset-bottom)]" />
      </DrawerContent>
    </Drawer>
  );
}
