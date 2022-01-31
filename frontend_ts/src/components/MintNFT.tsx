import React, { useState, useEffect } from "react"

import { useEthers, useEtherBalance, useContractFunction, useNotifications } from "@usedapp/core"
import { useCoingeckoPrice } from '@usedapp/coingecko'
import { formatUnits } from "@ethersproject/units"
import { utils, constants } from "ethers"

import { Card, CardContent, CardMedia, CardActions, Tab, Typography, Button, makeStyles, Box, Link, CircularProgress, Snackbar } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import { useGetSVG, useMintNFT, usePrice, useBalanceOf, useTokenOfOwnerByIndex} from "../hooks"

import contractAdresses from "../contracts/contracts.json"
import img1 from '../assets/examples.gif';
const openSeaLink = "https://testnets.opensea.io/assets/"

const useStyles = makeStyles((theme) => ({
  Card: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    margin:'auto',
    flexDirection: 'column',
    width: 400,
    align: "center",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "linear-gradient(#28282a, #28282a);" 
    backgroundColor: "#28282a" ,
    color: "white"
  },
  Media: {
    alignItems: "center",
    height:'100%',
    width: '100%',
    color: "white" 
  }

}))

export const MintNFT = () => {

  const classes = useStyles()

  const { notifications } = useNotifications()
  const { account, chainId } = useEthers()

  // Check if account is connected to correct chain
  const isConnected = account !== undefined
  const [isConnectedAndCorrectChain, setIsConnectedAndCorrectChain] = useState(false)
  useEffect( () => {
    if( chainId == 4 && isConnected)  {
        setIsConnectedAndCorrectChain(true)
    } else {
        setIsConnectedAndCorrectChain(false)
    }
  }, [chainId, isConnected] )

  // Get contract address
  const contractAdress = chainId ? contractAdresses["4"]["myNFT"] : constants.AddressZero

  // Get NFTs of user
  const accountAdress = account ? account : constants.AddressZero
  const nftBalance = useBalanceOf(accountAdress);
  const tokenId = useTokenOfOwnerByIndex(accountAdress, nftBalance ? nftBalance-1 : 0);

  // Get SVG of latest user NFT
  const svg = useGetSVG(tokenId ? tokenId : 0); 

  // Get account balance
  const balance = useEtherBalance(account)
  const formattedTokenBalance: number = balance ? parseFloat(formatUnits(balance, 18)) : 0

  // Get mint price
  const etherPrice =  useCoingeckoPrice('ethereum', 'usd') 
  const formattedEtherPrice: number = etherPrice ? parseFloat(etherPrice) : 0

  const priceMint = usePrice();
  const price: number = priceMint ? parseFloat(formatUnits(priceMint, 18)) : 0
  const priceUSD: number = price * formattedEtherPrice 

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

  }, [notifications, showMintSuccess, showMintFail])

  const handleCloseSnack = () => {
    showMintSuccess && setShowMintSuccess(false)
    showMintFail && setShowMintFail(false)
  }

  // Render Mint UI
  return (
        <>
        <div>
            <Card className={classes.Card}>
                {userMinted == 0 ?  
                    (<CardMedia className={classes.Media} component="img" src={img1} /> )
                    : 
                    (<CardMedia className={classes.Media} component="img" src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} /> )
                }
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Price: ${price.toFixed(3)} ETH (~ ${priceUSD.toFixed(2)} $)
                    </Typography>
                    {!isConnected ? ( <Typography variant="body2" > Please connect your Metamask account </Typography> ) : ( [] ) }
                    {userMinted > 0 && isConnected ? 
                        ( <Typography variant="body2" >  <Link color="inherit" href={openSeaLink + contractAdress + "/" + tokenId } underline="hover">{'View on Opensea'} </Link> </Typography>) : ( [] ) }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" size="large" onClick={handleMint} disabled={!isConnectedAndCorrectChain || isMining} > {isMining ? <CircularProgress size={26} /> : 'Mint' } </Button>
                </CardActions>
            </Card>
        </div>

        <Snackbar open={showMintSuccess} autoHideDuration={10000} onClose={handleCloseSnack} >
              <Alert onClose={handleCloseSnack} severity="success">
              <p>Transaction successful!</p>
              <p><a href={"https://rinkeby.etherscan.io/tx/" + txId }> View on blockexplorer </a> </p>
              </Alert>
        </Snackbar>

        <Snackbar open={showMintFail} autoHideDuration={10000} onClose={handleCloseSnack} >
              <Alert onClose={handleCloseSnack} severity="error">
              <p>Transaction failed!</p>
              <p><a href={"https://rinkeby.etherscan.io/tx/" + txId }> View on blockexplorer </a> </p>
              </Alert>
        </Snackbar>

        </>
  )
}