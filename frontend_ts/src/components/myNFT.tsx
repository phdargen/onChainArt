import React, { useState, useEffect } from "react"

import { useEthers, useEtherBalance, useContractFunction, useNotifications } from "@usedapp/core"
import { utils, constants } from "ethers"

import { Container, Grid, Card, CardMedia, Typography, makeStyles, Box  } from "@material-ui/core"

import { useGetAllSVGs, useBalanceOf, useTokenOfOwner} from "../hooks"

import img1 from "../assets/token1.svg"

const openSeaLink = "https://testnets.opensea.io/"

const useStyles = makeStyles((theme) => ({
  box:{
      width: '100%',
      marginTop: 100,
      marginBottom: 100,
      paddingTop: 50
  },
  Card: {
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
  },
  gridItem: {
    alignItems: 'center',
    align: 'center',
    verticalAlign: 'middle',  
    height:'100%',
    width: '100%',
  },
  notConnected: {
      minHeight: 400,
      marginTop: '20%',
      marginBottom: '20%',
      color: 'white'
  }

}))

export const MyNFT = () => {

  const classes = useStyles()
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

  // Get NFTs of user
  const accountAdress = account ? account : constants.AddressZero
  const nftBalance = useBalanceOf(accountAdress);
  const nftBalanceFormatted: number = nftBalance ? parseInt(nftBalance) : 0

  var ownedTokens: Array<number> = []
  for (let i = 0; i < nftBalanceFormatted; i++) ownedTokens.push(i)

  const tokenIds = useTokenOfOwner(accountAdress, ownedTokens);

  var tokenIdsFormatted: Array<number> = []
  for (let i = 0; i< nftBalanceFormatted; i++) tokenIdsFormatted[i] = Number(tokenIds[i])

  // Get SVG of NFTs
  var svgList = useGetAllSVGs(tokenIdsFormatted)

  // Loop over all NFts 
  const getCards = () => {
    return svgList.map( (svg: string | any, i) => {
        return (
            <Grid className={classes.gridItem} key={i} item xs={12} sm={4}>
            <Card className={classes.Card}>
                    <CardMedia className={classes.Media} component="img" src={svg ? `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` : img1} alt={img1} /> 
            </Card>
            </Grid>
        )
    })
  }

  // Render UI
  return (
        <>

        {isConnectedAndCorrectChain ?

            (
              <Box className={classes.box} textAlign="center" pt={{ xs: 5, sm: 10 }} pb={{ xs: 5, sm: 0 } } color="white">
              <Container maxWidth="lg">
              <Grid className={classes.grid} container spacing={2}>

                  {getCards()}

              </Grid>
              </Container>
              </Box>

            ): (
                <Box textAlign="center" color='white' className={classes.notConnected}>
                    <Container >
                        <Typography variant="h4" component="h2" > Please connect wallet </Typography>
                    </Container>
                 </Box>
            )
        }

        </>
  )
}