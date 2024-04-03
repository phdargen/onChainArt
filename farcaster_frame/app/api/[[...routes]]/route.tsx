/** @jsxImportSource frog/jsx */
import { Button, Frog, TextInput, parseEther } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { abi } from "./abi.js";
import { baseSepolia, sepolia } from "viem/chains";

const url = "http://onchainart.s3-website.us-east-2.amazonaws.com"

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  imageOptions: { height: 600, width: 600 }
});

app.frame("/", (c) => {
  return c.res({
    image: "https://on-chain-art-theta.vercel.app/outPaths.gif",
    imageAspectRatio: "1:1",
    intents: [
      <Button.Link href={url}>
        Visit website
      </Button.Link>,
      <Button.Transaction target="/mint">Mint NFT</Button.Transaction>
    ],
  });
});

app.transaction("/mint", (c) => {
  const { inputText } = c;

  return c.contract({
    abi,
    chainId: "eip155:84532",
    functionName: "mintNFT",
    to: "0x8612416a36f4A0295fC10FB23443730714dA51da",
    value: parseEther('0.001'),
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
