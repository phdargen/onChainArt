import React, { useState, useEffect } from "react"

import { useEthers, useNotifications } from "@usedapp/core"
import { useCoingeckoPrice } from '@usedapp/coingecko'
import { formatUnits } from "@ethersproject/units"
import { utils, constants } from "ethers"

import { Container, Grid, Card, CardContent, CardMedia, CardActions, Typography, Button, makeStyles, Box, Link, CircularProgress, Snackbar, useTheme, useMediaQuery } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import { useGetSVG, useMintNFT, usePrice, useBalanceOf, useTokenOfOwnerByIndex, useTotalSupply, useMaxSupply} from "../hooks"

import img1 from '../assets/outShapes.gif';
import img2 from '../assets/outPaths.gif';

// Get contract
import network from "../contracts/network.json"
import { Contract } from '@ethersproject/contracts'
import contractAdresses from "../contracts/contracts.json"
import contractNftAbi from '../contracts/myNFT.json'

const networkId = network.ChainId 
const contractInterface = new utils.Interface(contractNftAbi.abi)
const contractAdress = (contractAdresses as any)[networkId.toString()]?.shapeNFT 
const contract = new Contract(contractAdress, contractInterface) as any
const contractAdress2 = (contractAdresses as any)[networkId.toString()]?.pathNFT 
const contract2 = new Contract(contractAdress2, contractInterface) as any

const openSeaLink = "https://testnets.opensea.io/"
const defaultMaxSupply = 10000
const defaultMintPrice = 0.0001

const useStyles = makeStyles((theme) => ({
  Card: {
    marginTop: '5%',
    marginBottom: '5%',
    margin: '5%',
    // margin:'auto',
    paddingTop: '0%',
    paddingBottom: '0%',
    width: '25%',
    maxWidth: 500,
    [theme.breakpoints.down("md")] : {
        width: '60%',
        marginTop: '10%',
    },
    align: "center",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "linear-gradient(#28282a, #28282a);" 
    backgroundColor: "#28282a" ,
    color: "white",
  },
  Media: {
    alignItems: "center",
    height:'100%',
    width: '100%',
    color: "white",
    display: 'flex'
  },
  grid: {
    align: 'center',
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingBottom: '2%',
  },
  gridItem: {
    alignItems: 'center',
    align: 'center',
    verticalAlign: 'middle',  
    height:'100%',
    width: '100%',
  },
}))

const useNftData = (contract: any, account: any) => {
  const [svg, setSvg] = useState<string>('');
  const [totalSupplyFormatted, setTotalSupplyFormatted] = useState<string>('?');
  const [maxSupplyFormatted, setMaxSupplyFormatted] = useState<string>(String(defaultMaxSupply));
  const [price, setPrice] = useState<number>(defaultMintPrice);

  //const accountAddress = account || constants.AddressZero;
  const nftBalance = useBalanceOf(contract, account);
  const tokenId = useTokenOfOwnerByIndex(contract, account, nftBalance ? nftBalance - 1 : 0);

  // Get price
  const priceMint = usePrice(contract);
  console.log('priceMint ', priceMint && parseFloat(formatUnits(priceMint, 18) ));

  // Get Supply
  const totalSupply = useTotalSupply(contract); 
  console.log('totalSupplyFormatted ', totalSupplyFormatted)

  const maxSupply = useMaxSupply(contract);
  console.log('maxSupplyFormatted ', maxSupplyFormatted)

  // Get SVG of latest user NFT
  const svgData = useGetSVG(contract,tokenId ? tokenId : 0); 

  useEffect(() => {
      setPrice(priceMint ? parseFloat(formatUnits(priceMint, 18)) : defaultMintPrice)
      setSvg(svgData);
      setTotalSupplyFormatted(totalSupply ? String(totalSupply) : "?");
      setMaxSupplyFormatted(maxSupply ? String(maxSupply) : String(defaultMaxSupply));
  }, [contract, account, maxSupply, priceMint, svgData, totalSupply]); 

  return { svg, totalSupplyFormatted, maxSupplyFormatted, nftBalance, tokenId, price };
};

export const MintNFT = () => {

  const classes = useStyles()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { notifications } = useNotifications()
  const { account, chainId } = useEthers()

  // Check if account is connected to correct chain
  const isConnected = account !== undefined
  const [isConnectedAndCorrectChain, setIsConnectedAndCorrectChain] = useState(false)
  useEffect( () => {
    if( chainId === networkId && isConnected)  {
        setIsConnectedAndCorrectChain(true)
    } else {
        setIsConnectedAndCorrectChain(false)
    }
  }, [chainId, isConnected] )
  console.log('chainId ', chainId)

  // Get NFT data
  const etherPrice =  useCoingeckoPrice('ethereum', 'usd') 
  const formattedEtherPrice: number = etherPrice ? parseFloat(etherPrice) : 0

  const { svg: svg, totalSupplyFormatted: totalSupplyFormatted, maxSupplyFormatted: maxSupplyFormatted, price: price } = useNftData(contract, account);
  const { svg: svg2, totalSupplyFormatted: totalSupplyFormatted2, maxSupplyFormatted: maxSupplyFormatted2, price: price2 } = useNftData(contract2, account);

  const priceUSD: number = price * formattedEtherPrice 
  const priceUSD2: number = price2 * formattedEtherPrice 

  const isSoldOut = (totalSupplyFormatted === maxSupplyFormatted) && (totalSupplyFormatted !== "?")
  const isSoldOut2 = (totalSupplyFormatted2 === maxSupplyFormatted2) && (totalSupplyFormatted2 !== "?")

  // Mint transaction
  const { send: mintSend, state: mintState } = useMintNFT(contract)
  const { send: mintSend2, state: mintState2 } = useMintNFT(contract2)

  const [userMinted, setUserMinted] = useState(0)
  const [userMinted2, setUserMinted2] = useState(0)
  const [userMintedStyle, setUserMintedStyle] = useState(0)

  const [showMintSuccess, setShowMintSuccess] = useState(false)
  const [showMintFail, setShowMintFail] = useState(false)
  const isMining = mintState.status === "Mining" || mintState2.status === "Mining"
  const txId = mintState.receipt ? mintState.receipt.transactionHash : (mintState2.receipt ? mintState2.receipt.transactionHash :"")

  const handleMint = () => {
    setUserMintedStyle(1)
    setShowMintSuccess(false)
    setShowMintFail(false)
    if(chainId !== networkId ) {
      console.error("handleMint::wrong chain Id")
      return undefined
    }
    return mintSend({ value: utils.parseEther(price.toString()) })
  }
  const handleMint2 = () => {
    setUserMintedStyle(2)
    setShowMintSuccess(false)
    setShowMintFail(false)
    if(chainId !== networkId ) {
      console.error("handleMint2::wrong chain Id")
      return undefined
    }
    return mintSend2({ value: utils.parseEther(price2.toString()) })
  }

  // Search in notifactions for succesful/failed transactions
  useEffect(() => {
        if (
            notifications.filter(
                (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Mint NFT"
            ).length > 0
        ) {
            !showMintSuccess && setShowMintSuccess(true)
            //console.log(mintState.receipt ? mintState.receipt : "")
            userMintedStyle ===1 && setUserMinted(1)
            userMintedStyle ===2 && setUserMinted2(1)
        }

        else if (
            notifications.filter(
                (notification) =>
                    notification.type === "transactionFailed" &&
                    notification.transactionName === "Mint NFT"
                ).length > 0
            ) {
            !showMintFail && setShowMintFail(true)
        }  

  }, [notifications, showMintSuccess, showMintFail, userMinted, userMinted2, userMintedStyle])

  const handleCloseSnack = () => {
    showMintSuccess && setShowMintSuccess(false)
    showMintFail && setShowMintFail(false)
  }

  // Render Mint UI
  return (
        <>
        <Box textAlign="center" pt={{ xs: 5, sm: 10 }} pb={{ xs: 5, sm: 0 }}>
        <Container maxWidth="lg">
        <Grid className={classes.grid} container spacing={2}>

        <Card className={classes.Card}>
                {userMinted === 1 ?  
                    (<CardMedia className={classes.Media} component="img" src={svg ? `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` : img1} alt={img1} /> )
                    : 
                    (<CardMedia className={classes.Media} component="img" src={img1} /> )
                }
                <CardContent>
                    
                  <Typography gutterBottom variant={isMobile? "h6" :"h5"} component="div">
                        Edition: Xonin Shapes 
                    </Typography> 

                    <Typography gutterBottom variant={isMobile? "h6" :"h5"} component="div">
                        Minted: {totalSupplyFormatted} / {maxSupplyFormatted} 
                    </Typography> 

                    <Typography gutterBottom variant={isMobile? "h6" :"h5"} component="div">
                        Price: {price.toFixed(3)}ETH (~{priceUSD.toFixed(2)}$)
                    </Typography>

                    {!isConnected ? ( <Typography variant="body2" > Please connect your wallet </Typography> ) : ( [] ) }
                    {userMinted === 1 && isConnected && (!isMining || userMintedStyle === 2) ? 
                        ( <Typography variant="body2" style={{ color: 'green' }} > Mint successful: <Link color="inherit" href={openSeaLink + account} underline="hover">{'View on Opensea'} </Link> </Typography>) : ( [] ) }
                
                </CardContent>
                <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button color="primary" variant="contained" size="large" onClick={handleMint} disabled={!isConnectedAndCorrectChain || isMining || isSoldOut} > {isMining ? (<CircularProgress size={26} />) : (isSoldOut ? 'Sold out!' : 'Mint') } </Button>
                </CardActions>
        </Card>

        <Card className={classes.Card}>
                {userMinted2 === 1  ?  
                    (<CardMedia className={classes.Media} component="img" src={svg2 ? `data:image/svg+xml;utf8,${encodeURIComponent(svg2)}` : img2} alt={img2} /> )
                    : 
                    (<CardMedia className={classes.Media} component="img" src={img2} /> )
                }
                <CardContent>
                    
                  <Typography gutterBottom variant={isMobile? "h6" :"h5"} component="div">
                        Edition: Xonin Paths 
                    </Typography> 

                    <Typography gutterBottom variant={isMobile? "h6" :"h5"} component="div">
                        Minted: {totalSupplyFormatted2} / {maxSupplyFormatted2} 
                    </Typography> 

                    <Typography gutterBottom variant={isMobile? "h6" :"h5"} component="div">
                        Price: {price2.toFixed(3)}ETH (~{priceUSD2.toFixed(2)}$)
                    </Typography>

                    {!isConnected ? ( <Typography variant="body2" > Please connect your wallet </Typography> ) : ( [] ) }
                    {userMinted2 === 1 && isConnected && (!isMining || userMintedStyle === 1) ? 
                        ( <Typography variant="body2" style={{ color: 'green' }} > Mint successful: <Link color="inherit" href={openSeaLink + account} underline="hover">{'View on Opensea'} </Link> </Typography>) : ( [] ) }
                
                </CardContent>
                <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button color="primary" variant="contained" size="large" onClick={handleMint2} disabled={!isConnectedAndCorrectChain || isMining || isSoldOut2} > {isMining ? (<CircularProgress size={26} />) : (isSoldOut2 ? 'Sold out!' : 'Mint') } </Button>
                </CardActions>
        </Card>

        </Grid>
        </Container>
        </Box>
        
        <Snackbar open={showMintSuccess} autoHideDuration={10000} onClose={handleCloseSnack} >
              <Alert onClose={handleCloseSnack} severity="success">
              <p>Transaction successful!</p>
              <p><a href={"https://sepolia.etherscan.io/tx/" + txId }> View on blockexplorer </a> </p>
              </Alert>
        </Snackbar>

        <Snackbar open={showMintFail} autoHideDuration={10000} onClose={handleCloseSnack} >
              <Alert onClose={handleCloseSnack} severity="error">
              <p>Transaction failed!</p>
              <p><a href={"https://sepolia.etherscan.io/tx/" + txId }> View on blockexplorer </a> </p>
              </Alert>
        </Snackbar>

        </>
  )
}