/** @jsxImportSource frog/jsx */
import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { abi } from "./abi.js";
import { baseSepolia, sepolia } from "viem/chains";
import { createWalletClient, http, createPublicClient, parseEther, formatEther } from "viem";
import { createCanvas } from 'canvas'

const frame_url = 'https://xonin-farcasterframe.vercel.app';
const website_url = 'https://xonin.vercel.app';

const contract = "0x15077415012b6f5a6F2842928886B51e0E2CB2D6";

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

async function getPrice() {
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

async function getTotalSupply() {
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

async function getMaxSupply() {
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

// async function downloadPNG(svgdata: any, tokenId: any, dir: any)
// {
//   let resizewidth = 500;
//   let resizedest = dir+"PNG/token" + tokenId + ".png";

//   let IMAGE = new xmldom.DOMParser().parseFromString(svgdata, 'text/xml');
//   let svgList = IMAGE.getElementsByTagName('svg');
//   if (!svgList) {
//       throw new Error(`No SVG in ${svgdata}`);
//   }
  
//   let svg = svgList.item(0);
//   svg.setAttribute('width', '100em');
//   svg.setAttribute('height', '100em');
//   //svg.setAttribute('fill', 'black');
  
//   let img = await sharp(Buffer.from(
//       new xmldom.XMLSerializer().serializeToString(IMAGE)
//   ));
  
//   let resized = await img.resize(resizewidth);
//   await resized.toFile(resizedest);
// }

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  imageOptions: { height: 600, width: 600 }
});

app.frame("/", async (c) => {

  const price = await getPrice();
  console.log('price ', price);
  const title = typeof price === "number" ? "Mint NFT for " + formatEther(BigInt(price)) + " ETH" : "Mint NFT";

  const totalSupply = await getTotalSupply();
  const maxSupply = await getMaxSupply();
  console.log('totalSupply ', totalSupply);
  console.log('maxSupply ', maxSupply);
  const titleSupply = (typeof totalSupply === "number" && typeof maxSupply === "number") ? String(totalSupply) + "/" + String(maxSupply) + " Minted" : "";

  if (typeof totalSupply === "number" && typeof maxSupply === "number" && totalSupply === maxSupply) {
    return c.res({
      title: 'Xonin Frame: Sold out',
      image: frame_url + "/outPaths.gif",
      imageAspectRatio: "1:1",
      intents: [
        <Button.Link href={website_url}>
          Visit website
        </Button.Link>,
      ],
    });
  }

  else{
    return c.res({
      title: 'Xonin Frame: Learn',
      image: frame_url + "/outPaths.gif",
      imageAspectRatio: "1:1",
      action: "/show",
      intents: [
        <Button.Link href={website_url}> Visit website {titleSupply} </Button.Link>,
        <Button.Transaction target="/mint"> {title} </Button.Transaction>,
        <Button action="/canvas"> Learn more </Button>,
        <Button action="/show"> Show my NFT </Button>,
        <TextInput placeholder="Enter your fruit..." />,
      ],
    });
  }

});

app.frame("/learn", (c) => {
  return c.res({
    image: (
      <div
        style={{
          color: "white",
          fontSize: 60,
          fontStyle: "normal",
          letterSpacing: "-0.025em",
          lineHeight: 1.4,
          marginTop: 30,
          padding: "0 120px",
          whiteSpace: "pre-wrap",
        }}
      >
        This is our second frame
      </div>
    ),
    intents: [
      <Button.Reset>Go back</Button.Reset>,
    ],
  });
});

app.frame("/show", (c) => {

  const address = c.inputText;
  console.log('address ', address)

  const { buttonValue } = c
  console.log('buttonValue ', buttonValue)

  const svg = "";

  return c.res({
    headers:  {
      'cache-Control': 'public, max-age=0, s-maxage=2',
              // <meta http-equiv="refresh" content="1" />
    },
    image: (
      <svg height="100" width="100">
      <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
    </svg>
    ),
    intents: [
      <Button.Reset>Go back</Button.Reset>,
      <Button action="/show" value={address}>Refresh</Button>,
    ],  
  });

});

app.transaction("/mint", async (c) => {
  const { inputText } = c;
  const price = await getPrice();
  console.log('price ', price);

  const mintPrice = typeof price === "number" ? BigInt(price): parseEther("0") 

  return c.contract({
    abi,
    chainId: "eip155:84532",
    functionName: "mintNFT",
    to: contract,
    value: mintPrice,
  });
});

app.frame('/canvas', (c) => {
  const { status } = c
  const canvas = createCanvas(200, 200)
  const ctx = canvas.getContext('2d')
  console.log('1')

  // Write "Awesome!"
  ctx.font = '30px Impact'
  ctx.rotate(0.1)
  ctx.fillText('Awesome!', 0, 100)
  console.log(canvas.toDataURL('image/png'));

  return c.res({
    //action: '/action',
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=',
    intents: [
      <TextInput placeholder="Enter custom fruit" />,
      <Button value="apples">Apples</Button>,
      <Button value="oranges">Oranges</Button>,
      <Button value="bananas">Bananas</Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  })
})

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
