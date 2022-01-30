import React, { useState, useEffect } from "react"
import { useEthers, useEtherBalance, useContractFunction, useNotifications } from "@usedapp/core"
import { useCoingeckoPrice } from '@usedapp/coingecko'

import { formatUnits } from "@ethersproject/units"
import { Contract } from '@ethersproject/contracts'
import { utils, constants } from "ethers"

import { Card, CardContent, CardMedia, CardActions, Tab, Typography, Button, makeStyles, Box, CircularProgress, Snackbar } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import img1 from '../assets/token1.svg';

// import contractNftAbi from '../contracts/myNFT.json'
import contractAdresses from "../contracts/contracts.json"
import { useGetSVG, useMintNFT, usePrice, useBalanceOf, useTokenOfOwnerByIndex} from "../hooks"

const useStyles = makeStyles((theme) => ({
  Card: {
    // marginTop: theme.spacing(20),
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

  // Get account balance
  const balance = useEtherBalance(account)
  const formattedTokenBalance: number = balance ? parseFloat(formatUnits(balance, 18)) : 0

  // Get mint price
  const etherPrice =  useCoingeckoPrice('ethereum', 'usd') 
  const formattedEtherPrice: number = etherPrice ? parseFloat(etherPrice) : 0

  const priceMint = usePrice();
  const price: number = priceMint ? parseFloat(formatUnits(priceMint, 18)) : 0
  const priceUSD: number = price * formattedEtherPrice 

  // Get NFTs of user
  const accountAdress = account ? account : "0x"
  const nftBalance = useBalanceOf(accountAdress);
  const tokenId = useTokenOfOwnerByIndex(accountAdress, nftBalance ? nftBalance-1 : 0);

  // Get SVG of latest user NFT
  const svg = useGetSVG(tokenId);  

  // Mint transaction
  const { send: mintSend, state: mintState } = useMintNFT()

  const handleMint = () => {
    return mintSend({ value: utils.parseEther(price.toString()) })
  }

  const [showMintSuccess, setShowMintSuccess] = useState(false)

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
    }
  }, [notifications, showMintSuccess])

  const isMining = mintState.status === "Mining"
  const isSuccess = mintState.status === "Success"
  const txId = mintState.receipt ? mintState.receipt.transactionHash : ""

  const handleCloseSnack = () => {
    showMintSuccess && setShowMintSuccess(false)
  }

  return (
        <>
        <div>
            <Card className={classes.Card}>
                {!isSuccess ?  
                    (<CardMedia className={classes.Media} component="img" src={img1} /> )
                    : 
                    (<CardMedia className={classes.Media} component="img" src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} /> )
                }
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Price: ${price.toFixed(3)} ETH (~ ${priceUSD.toFixed(2)} $)
                    </Typography>
                    {!isConnected ? ( <Typography variant="body2" > Please connect your Metamask account </Typography> ) : ( [] ) }
                    </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" size="large" onClick={handleMint} disabled={!isConnectedAndCorrectChain || isMining} > {isMining ? <CircularProgress size={26} /> : 'Mint' } </Button>
                </CardActions>
            </Card>
        </div>
              <Snackbar
              open={showMintSuccess}
              autoHideDuration={10000}
              onClose={handleCloseSnack}
            >
              <Alert onClose={handleCloseSnack} severity="success">
              <p>Transaction successful!</p>
              {/* <p> TokenId = {tokenId.toNumber()} </p> */}
              <p><a href={"https://rinkeby.etherscan.io/tx/" + txId }> View on blockexplorer </a> </p>
              </Alert>
            </Snackbar>
        </>
  )
}