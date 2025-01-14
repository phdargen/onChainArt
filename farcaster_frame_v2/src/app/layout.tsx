import "./globals.css";

import type { Metadata } from "next";

import { Providers } from "@/providers/Providers";

const frame = {
  version: "next",
  imageUrl: "https://xonin-frame-v2.vercel.app/api/og",
  button: {
    title: "Mint",
    action: {
      type: "launch_frame",
      name: "Xonin",
      url: "https://xonin-frame-v2.vercel.app/",
      iconImageUrl: "https://xonin.vercel.app/token0.png",
      splashImageUrl: "https://xonin.vercel.app/token34.png",
      splashBackgroundColor: "#002d62",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://xonin-frame-v2.vercel.app/"),
    title: "Xonin Mints",
    openGraph: {
      title: "Xonin",
      description: "Mints",
      images: "https://xonin-frame-v2.vercel.app/api/og",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

// eslint-disable-next-line import/no-default-export
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* eslint-disable-next-line @next/next/google-font-display */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=block"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
      </head>
      <body className="antialiased scrollbar-vert Text/Faint">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
