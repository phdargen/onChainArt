import React, { useState, useEffect } from "react"
import { useEthers} from "@usedapp/core"
import { utils, constants } from "ethers"
import { Container, Grid, Card, CardMedia, CardContent, Typography, makeStyles, Box, Button  } from "@material-ui/core"
import { useGetAllSVGs, useBalanceOf, useTokenOfOwner} from "../hooks"
import { Link } from 'react-router-dom';

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

const useStyles = makeStyles((theme) => ({
  box:{
      width: '100%',
      marginTop: 100,
      marginBottom: 100,
      paddingTop: 50,
      paddingBottom: 50,
  },
  Card: {
    backgroundColor: "#28282a" ,
    color: "white",
    paddingBottom: 50,
    marginBottom: '20%',
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

const useOwnedTokenIds = (contract: any, account: any, maxDisplayed: number = Infinity): number[] => {
    const [tokenIdsFormatted, setTokenIdsFormatted] = useState<number[]>([]);

    const accountAddress = account || constants.AddressZero;
  
    // Fetch the balance of NFTs owned by the account
    const nftBalance = useBalanceOf(contract, accountAddress);
    const nftBalanceFormatted: number = nftBalance ? parseInt(nftBalance) : 0;

    // Token ids of the owend tokens
    var ownedTokens: Array<number> = []
    for (let i = 0; i < nftBalanceFormatted; i++) ownedTokens.push(i)
    const tokenIds = useTokenOfOwner(contract, accountAddress, ownedTokens);

    useEffect(() => {
      const newTokenIds: number[] = [];
      for (let index = Math.min(nftBalanceFormatted, maxDisplayed) - 1 ; index >= 0; index--) {
        newTokenIds.push(tokenIds[index]);
      }
      setTokenIdsFormatted(newTokenIds);
    }, [contract, account, maxDisplayed, nftBalanceFormatted]);
    
    return tokenIdsFormatted;
  };

export const MyNFT = () => {

  const classes = useStyles()
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

  // Get recent mints
  var tokenIds = useOwnedTokenIds(contract,account,maxDisplayed);
  var tokenIds2 = useOwnedTokenIds(contract2,account,maxDisplayed);

  // Get SVG of NFTs
  var svgList = useGetAllSVGs(contract,tokenIds)
  var svgList2 = useGetAllSVGs(contract2,tokenIds2)

  // Loop over all NFts 
  const getCards = () => {
    // Alternate lists
    const combinedSvgList = [];
    const maxLength = Math.max(svgList.length, svgList2.length);    
    for (let i = 0; i < maxLength; i++) {
      if (i < svgList.length) combinedSvgList.push(svgList[i]);
      if (i < svgList2.length) combinedSvgList.push(svgList2[i]);
    }

    if(maxLength==0)
        return (
            <Card className={classes.Card}>
            <CardContent>      
            <Typography gutterBottom variant={"h5"} component="div">
                No Xonin NFTs found
            </Typography> 
            <Button component={Link} to="/mint" variant="contained" color="primary">
              Mint NFT
            </Button>
            </CardContent>
            </Card>
        )

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