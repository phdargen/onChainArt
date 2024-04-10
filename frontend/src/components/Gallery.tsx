import React, { useState, useEffect } from "react"
import { utils, constants } from "ethers"
import { Container, Grid, Card, CardContent, CardMedia, CardActions, Tab, Typography, Button, makeStyles, Box, Link, CircularProgress, Snackbar } from "@material-ui/core"
import { useGetAllSVGs, useTotalSupply} from "../hooks"

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

const maxDisplayed = 12
const refresh = 10

const openSeaLink = "https://testnets.opensea.io/"

const useStyles = makeStyles((theme) => ({
    box:{
        width: '100%',
        marginTop: 100,
        marginBottom: '10%',
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
      align: 'center',
      justifyContent: 'center', 
      alignItems: 'center', 
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

const useTokenIdsToDisplay = (contract: any, maxDisplayed = Infinity): number[] => {
  const [tokenIds, setTokenIds] = useState<number[]>([]);
  const totalSupply = useTotalSupply(contract,refresh);
  const totalSupplyFormatted: number = totalSupply ? parseInt(totalSupply) : 0;

  useEffect(() => {
    const newTokenIds: number[] = [];
    for (let index = Math.min(totalSupplyFormatted, maxDisplayed) - 1; index >= 0; index--) {
      newTokenIds.push(index);
    }
    setTokenIds(newTokenIds);
  }, [contract, totalSupplyFormatted, maxDisplayed]);

  return tokenIds;
};

export const Gallery = () => {

  const classes = useStyles()

  // Get recent mints
  var tokenIds = useTokenIdsToDisplay(contract,maxDisplayed);
  var tokenIds2 = useTokenIdsToDisplay(contract2,maxDisplayed);

  // Get SVG of NFTs
  var svgList = useGetAllSVGs(contract,tokenIds,refresh)
  var svgList2 = useGetAllSVGs(contract2,tokenIds2,refresh)

  // Loop over all NFTs 
  const getCards = () => {
    // Alternate lists
    const combinedSvgList = [];
    const maxLength = Math.max(svgList.length, svgList2.length);    
    for (let i = 0; i < maxLength; i++) {
      if (i < svgList.length) combinedSvgList.push(svgList[i]);
      if (i < svgList2.length) combinedSvgList.push(svgList2[i]);
    }

    return combinedSvgList.map( (svg: string | any, i) => {
        return (
            <Grid className={classes.gridItem} key={i} item xs={12} sm={4}>
            <Card className={classes.Card}>
                    <CardMedia className={classes.Media} component="img" src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}` }  /> 
            </Card>
            </Grid>
        )
    })
  }

  // Render UI
  return (
        <>

        {svgList[0] ? 
            (
                <Box className={classes.box} textAlign="center" pt={{ xs: 5, sm: 10 }} pb={{ xs: 5, sm: 0 } } color="white">
                <Container maxWidth="lg">
                <Grid className={classes.grid} container spacing={2}>

                    {getCards()}

                </Grid>
                </Container>
                </Box>
            ) :
            (
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