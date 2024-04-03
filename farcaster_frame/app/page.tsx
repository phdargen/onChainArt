// Import React if you need to use JSX
import React from 'react';
import { getFrameMetadata } from 'frog/next';
import type { Metadata } from 'next';

const backgroundImageUrl = 'https://on-chain-art-theta.vercel.app/outPaths.gif';

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `https://on-chain-art-theta.vercel.app/api`,
  )
  return {
    other: frameTags,
  }
}

export default function Home() {
  // Inline style for the main tag
  const mainStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  // Inline style for the button
  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '32px',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <main style={mainStyle}>
      <a href="http://onchainart.s3-website.us-east-2.amazonaws.com/" style={{ textDecoration: 'none' }}>
        <button style={buttonStyle}>Mint</button>
      </a>
    </main>
  );
}
