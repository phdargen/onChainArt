/** @jsxImportSource frog/jsx */
import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { abi } from "./abi.js";
import { baseSepolia, base } from "viem/chains";
import { createWalletClient, http, createPublicClient, parseEther, formatEther } from "viem";

const frame_url = 'https://xonin-farcasterframe.vercel.app';
const website_url = 'https://xonin.vercel.app';
const opensea_url = 'https://testnets.opensea.io/assets/sepolia/';

// Testnet
// const contractShapes = "0xd58b1248D893f6Dc0f93d7C1A12deed75Bee3785";
// const contractPaths = "0x15077415012b6f5a6F2842928886B51e0E2CB2D6";

// Mainnet
const contractShapes = "0xc6a050398BB92CB077b119BEAd045f3b52eA9a17";
const contractPaths = "0x1F21BB5e880828D1016FE2965A172407414c373c";

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

async function getPrice(contract: any) {
  try {
    const price = await publicClient.readContract({
      address: contract,
      abi: abi,
      functionName: "price",
    });
    const readablePrice = Number(price);
    return readablePrice;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getTotalSupply(contract: any) {
  try {
    const totalSupply = await publicClient.readContract({
      address: contract,
      abi: abi,
      functionName: "totalSupply",
    });
    const readableTotalSupply = Number(totalSupply);
    return readableTotalSupply;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getMaxSupply(contract: any) {
  try {
    const maxSupply = await publicClient.readContract({
      address: contract,
      abi: abi,
      functionName: "maxSupply",
    });
    const readableMaxSupply = Number(maxSupply);
    return readableMaxSupply;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  imageOptions: { height: 500, width: 500 }
});

app.frame("/", async (c) => {
  // const totalSupply = await getTotalSupply(contractShapes);
  // const maxSupply = await getMaxSupply(contractShapes);
  // console.log('totalSupply ', totalSupply);
  // console.log('maxSupply ', maxSupply);
  // const titleSupply = (typeof totalSupply === "number" && typeof maxSupply === "number") ? String(totalSupply) + "/" + String(maxSupply) + " Minted" : "";
  // if (typeof totalSupply === "number" && typeof maxSupply === "number" && totalSupply === maxSupply)  
  return c.res({
      title: 'Xonin Frame: Mint',
      image: frame_url + "/xonin.gif",
      imageAspectRatio: "1:1",
      intents: [
        <Button.Transaction target="/mint/1" > Mint (Style: 🟥) </Button.Transaction>,
        <Button.Transaction target="/mint/2" > Mint (Style: 🌈) </Button.Transaction>,
        <Button.Link href={website_url}> Xonin </Button.Link>,
        // <Button.Link href={opensea_url+contractShapes}> OpenSea </Button.Link>,
      ],
    });
});

app.transaction("/mint/:style", async (c) => {

  const style = c.req.param('style')
  const contract = style === "1" ? contractShapes : contractPaths;

  const price = await getPrice(contract);
  console.log('price ', price);

  const mintPrice = typeof price === "number" ? BigInt(price): parseEther("0") 

  return c.contract({
    abi,
    chainId: "eip155:8453",
    functionName: "mintNFT",
    to: contract,
    value: mintPrice,
  });

});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
