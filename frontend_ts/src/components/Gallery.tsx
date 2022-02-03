import React, { useState, useEffect } from "react"

import { useEthers, useEtherBalance, useContractFunction, useNotifications } from "@usedapp/core"
import { utils, constants } from "ethers"

import { Container, Grid, Card, CardContent, CardMedia, CardActions, Tab, Typography, Button, makeStyles, Box, Link, CircularProgress, Snackbar } from "@material-ui/core"

import { useGetAllSVGs, useBalanceOf, useTokenOfOwnerByIndex, useTotalSupply, useMaxSupply} from "../hooks"

import contractAdresses from "../contracts/contracts.json"

import img1 from "../assets/token1.svg"

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

export const Gallery = () => {

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

  // Get NFTs of user
  const accountAdress = account ? account : constants.AddressZero
  const nftBalance = useBalanceOf(accountAdress);
  const tokenId = useTokenOfOwnerByIndex(accountAdress, nftBalance ? nftBalance-1 : 0);

  // Get NFT supply
  const totalSupply = useTotalSupply();
  const totalSupplyFormatted: number = totalSupply ? parseInt(totalSupply) : 0
  var tokenIds: Array<number> = []
  for (let index = 0; index < totalSupplyFormatted; index++) tokenIds.push(index)
  console.log(tokenIds)

  // Get SVG of NFTs
  var svgList = useGetAllSVGs(tokenIds)

  // Loop over all NFts 
  const getCards = () => {
    return svgList.map( (svg: string | any) => {
        return (
            <Card className={classes.Card}>
                    <CardMedia className={classes.Media} component="img" src={svg ? `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` : img1} alt={img1} /> 
            </Card>
        )
    })
  }

  // Render UI
  return (
        <>

        <Box textAlign="center" pt={{ xs: 5, sm: 10 }} pb={{ xs: 5, sm: 0 }}>
        <Container maxWidth="lg">
            {getCards()}
        </Container>
        </Box>

        </>
  )
}