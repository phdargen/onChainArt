"use client";

import React, { useEffect } from "react";

import { ArtworkImage } from "@/components/app/artworkImage";
import { ArtworkInfo } from "@/components/app/artworkInfo";
import { CollectButton } from "@/components/app/collectButton";
import { MintErrorSheet } from "@/components/app/mintErrorSheet";
import { MintSuccessSheet } from "@/components/app/mintSuccessSheet";
import { Card } from "@/components/ui/card";
import { useFeaturedMint } from "@/lib/queries";
import { useFrameSplash } from "@/providers/FrameSplashProvider";

// eslint-disable-next-line import/no-default-export
export default function Home() {
  const { dismiss } = useFrameSplash();
  const { data } = useFeaturedMint();
  const { mint } = data.result;

  const [showSuccess, setShowSuccess] = React.useState(false);
  const [mintedTokenId, setMintedTokenId] = React.useState<number>();
  const [error, setError] = React.useState<string>();
  const [mintedCollection, setMintedCollection] = React.useState<'paths' | 'shapes'>('paths');

  useEffect(() => {
    dismiss();
  }, [dismiss]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <ArtworkImage imageUrl={mint.imageUrl} name={mint.name} />
      <Card className="flex flex-col -mt-6 relative z-1 flex-grow pb-4">
        <ArtworkInfo
          name={mint.name}
          creator={mint.creator}
          chainId={mint.chainId}
          description={mint.description ?? ''}
          isMinting={mint.isMinting}
        />
        <CollectButton
          timestamp={mint.endsAt}
          price={Number(mint.priceEth)}
          isMinting={mint.isMinting}
          onCollect={(tokenId, collection) => {
            setMintedTokenId(tokenId);
            if (collection) setMintedCollection(collection);
            setShowSuccess(true);
          }}
          onError={setError}
        />
      </Card>
      <MintSuccessSheet
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setMintedTokenId(undefined);
        }}
        tokenId={mintedTokenId}
        collection={mintedCollection}
        name={mint.name}
        imageUrl={mint.imageUrl}
      />
      <MintErrorSheet
        isOpen={!!error}
        onClose={() => setError(undefined)}
        error={error || ""}
      />
    </div>
  );
}
