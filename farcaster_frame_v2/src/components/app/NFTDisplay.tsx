import React from 'react';
import { useNFTSvg } from '@/lib/hooks/useNFTContract';

interface NFTDisplayProps {
  tokenId: number;
  collection: 'paths' | 'shapes';
}

export function NFTDisplay({ tokenId, collection }: NFTDisplayProps) {
  const { data: svg, isLoading } = useNFTSvg(tokenId, collection);

  if (isLoading) {
    return <div>Loading NFT...</div>;
  }

  if (!svg) {
    return null;
  }

  // Parse the SVG string to modify its attributes
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const svgElement = doc.documentElement;
  
  // Add preserveAspectRatio attribute to ensure proper scaling
  svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svgElement.setAttribute('width', '100%');
  svgElement.setAttribute('height', '100%');

  const modifiedSvg = svgElement.outerHTML;

  return (
    <div 
      className="w-full aspect-square relative rounded-lg overflow-hidden"
      dangerouslySetInnerHTML={{ __html: modifiedSvg as string }} 
    />
  );
} 