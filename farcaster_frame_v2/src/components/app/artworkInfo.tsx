import { sdk } from "@farcaster/miniapp-sdk";
import { base, sepolia } from 'wagmi/chains';

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { ApiUserMinimal } from "@/lib/api";

interface ArtworkInfoProps {
  name: string;
  creator: ApiUserMinimal;
  chainId: number;
  description?: string;
  isMinting: boolean;
}

const getChainInfo = (chainId: number) => {
  switch (chainId) {
    case base.id:
      return { name: 'Base', logo: 'https://mint.warpcast.com/base-logo.png' };
    case sepolia.id:
      return { name: 'Sepolia', logo: 'https://mint.warpcast.com/base-logo.png' };
    default:
      return { name: 'Unknown', logo: 'https://mint.warpcast.com/base-logo.png' };
  }
};

export function ArtworkInfo({ name, creator, chainId, description, isMinting }: ArtworkInfoProps) {
  const chain = getChainInfo(chainId);

  const handleUsernameClick = () => {
    sdk.actions.viewProfile({ fid: creator.fid });
  };

  return (
    <div className="flex flex-col flex-grow p-4">
      <div className="flex flex-row items-start justify-between mb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold">{name}</h1>
          <div className="flex flex-row items-center gap-1">
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted">by</span>
              {creator.pfp?.url && (
                <Avatar className="h-4 w-4 bg-secondary rounded-full">
                  <AvatarImage
                    src={creator.pfp?.url}
                    alt={creator.displayName}
                    width={16}
                  />
                </Avatar>
              )}
              <span
                className="text-sm text-action-foreground hover:underline cursor-pointer"
                onClick={handleUsernameClick}
              >
                {creator.username}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted">on</span>
              <Avatar className="h-4 w-4 bg-secondary rounded-full">
                <AvatarImage
                  src={chain.logo}
                  alt={chain.name}
                  width={16}
                />
              </Avatar>
              <span className="text-sm">{chain.name}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm mb-4">
        {description}
      </p>

      <p className="text-sm mb-2">
        The transaction hash is used as random seed for the algorithm creating unique patterns for each NFT mint with 100 distinct color patterns and 2 art styles. The artwork is stored fully onchain as SVG.
        {isMinting ? '' : (" This mint is closed.")}
      </p>

    </div>
  );
}
