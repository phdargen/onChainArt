import React, { useState, useEffect } from "react"

import { useEthers, useEtherBalance, useContractFunction, useNotifications,  Mainnet, Rinkeby, Sepolia } from "@usedapp/core"
import { useCoingeckoPrice } from '@usedapp/coingecko'
import { formatUnits } from "@ethersproject/units"
import { utils, constants } from "ethers"

import { Container, Grid, Card, CardContent, CardMedia, CardActions, Tab, Typography, Button, makeStyles, Box, Link, CircularProgress, Snackbar, useTheme, useMediaQuery } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import { useGetSVG, useMintNFT, usePrice, useBalanceOf, useTokenOfOwnerByIndex, useTotalSupply, useMaxSupply} from "../hooks"

import contractAdresses from "../contracts/contracts.json"
import img1 from '../assets/examples.gif';
import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons"
const openSeaLink = "https://testnets.opensea.io/"

const useStyles = makeStyles((theme) => ({
  Card: {
    marginTop: '4%',
    marginBottom: '4%',
    margin:'auto',
    paddingTop: '0%',
    width: '30%',
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
}))

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
    if( chainId === 11155111 && isConnected)  {
        setIsConnectedAndCorrectChain(true)
    } else {
        setIsConnectedAndCorrectChain(false)
    }
  }, [chainId, isConnected] )

  console.log(chainId)

  // Get contract address
  const contractAdress = chainId ? contractAdresses["11155111"]["myNFT"] : constants.AddressZero

  // Get account balance
  const balance = useEtherBalance(account)
  const formattedTokenBalance: number = balance ? parseFloat(formatUnits(balance, 18)) : 0
  console.log(formattedTokenBalance)

  // Get mint price
  const etherPrice =  useCoingeckoPrice('ethereum', 'usd') 
  const formattedEtherPrice: number = etherPrice ? parseFloat(etherPrice) : 0

  const priceMint = usePrice();
  const price: number = priceMint ? parseFloat(formatUnits(priceMint, 18)) : 0
  const priceUSD: number = price * formattedEtherPrice 
  console.log(price)

  // Mint transaction
  const { send: mintSend, state: mintState } = useMintNFT()

  const [showMintSuccess, setShowMintSuccess] = useState(false)
  const [showMintFail, setShowMintFail] = useState(false)
  const [userMinted, setUserMinted] = useState(0)

  const isMining = mintState.status === "Mining"
  const txId = mintState.receipt ? mintState.receipt.transactionHash : ""

  const handleMint = () => {
    setShowMintSuccess(false)
    setShowMintFail(false)
    return mintSend({ value: utils.parseEther(price.toString()) })
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
            console.log(mintState.receipt ? mintState.receipt : "")
            setUserMinted(userMinted+1)
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

  }, [notifications, showMintSuccess, showMintFail, userMinted])

  const handleCloseSnack = () => {
    showMintSuccess && setShowMintSuccess(false)
    showMintFail && setShowMintFail(false)
  }

  // Get NFTs of user
  const accountAdress = account ? account : constants.AddressZero
  const nftBalance = useBalanceOf(accountAdress);
  const tokenId = useTokenOfOwnerByIndex(accountAdress, nftBalance ? nftBalance-1 : 0);

  // Get SVG of latest user NFT
  const svg = useGetSVG(tokenId ? tokenId : 0); 

  // Get NFT supply
  const totalSupply = useTotalSupply(); 
  const totalSupplyFormatted: string = totalSupply ? String(totalSupply) : "?"
  console.log(totalSupplyFormatted)

  const maxSupply = useMaxSupply();
  const maxSupplyFormatted: string = maxSupply ? String(maxSupply) : "?"

  // Render Mint UI
  return (
        <>
        <Box textAlign="center" pt={{ xs: 5, sm: 10 }} pb={{ xs: 5, sm: 0 }}>
        <Container maxWidth="lg">

        <Card className={classes.Card}>
                {userMinted === 0 ?  
                    (<CardMedia className={classes.Media} component="img" src={img1} /> )
                    : 
                    (<CardMedia className={classes.Media} component="img" src={svg ? `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` : img1} alt={img1} /> )
                }
                <CardContent>
                    
                    <Typography gutterBottom variant={isMobile? "h6" :"h5"} component="div">
                        Minted: {totalSupplyFormatted} / {maxSupplyFormatted} 
                    </Typography> 

                    <Typography gutterBottom variant={isMobile? "h6" :"h5"} component="div">
                        Price: {price.toFixed(3)}ETH (~{priceUSD.toFixed(2)}$)
                    </Typography>

                    {!isConnected ? ( <Typography variant="body2" > Please connect your wallet </Typography> ) : ( [] ) }
                    {userMinted > 0 && isConnected ? 
                        ( <Typography variant="body2" >  <Link color="inherit" href={openSeaLink + accountAdress} underline="hover">{'View on Opensea'} </Link> </Typography>) : ( [] ) }
                
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" size="large" onClick={handleMint} disabled={!isConnectedAndCorrectChain || isMining} > {isMining ? <CircularProgress size={26} /> : 'Mint' } </Button>
                </CardActions>
        </Card>

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