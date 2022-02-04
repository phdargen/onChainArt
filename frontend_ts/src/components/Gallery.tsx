import React, { useState, useEffect } from "react"

import { useEthers, useEtherBalance, useContractFunction, useNotifications } from "@usedapp/core"
import { utils, constants } from "ethers"

import { Container, Grid, Card, CardContent, CardMedia, CardActions, Tab, Typography, Button, makeStyles, Box, Link, CircularProgress, Snackbar } from "@material-ui/core"

import { useGetAllSVGs, useBalanceOf, useTokenOfOwnerByIndex, useTotalSupply, useMaxSupply} from "../hooks"

import contractAdresses from "../contracts/contracts.json"

import img1 from "../assets/token1.svg"

const openSeaLink = "https://testnets.opensea.io/"

const useStyles = makeStyles((theme) => ({
    box:{
        width: '100%',
        //backgroundColor: "#28282a" ,
        margin: 0,
        paddding: 0
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
  
}))

export const Gallery = () => {

  const classes = useStyles()
  const { account, chainId } = useEthers()

  // Get NFT supply
  const totalSupply = useTotalSupply();
  const totalSupplyFormatted: number = totalSupply ? parseInt(totalSupply) : 0
  var tokenIds: Array<number> = []
  for (let index = 0; index < totalSupplyFormatted; index++) tokenIds.push(index)

  // Get SVG of NFTs
  var svgList = useGetAllSVGs(tokenIds)

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

        <Box className={classes.box} textAlign="center" pt={{ xs: 5, sm: 10 }} pb={{ xs: 5, sm: 0 } }  bgcolor="text.secondary" color="white">
        <Container maxWidth="lg">
        <Grid className={classes.grid} container spacing={2}>

            {getCards()}

        </Grid>
        </Container>
        </Box>

        </>
  )
}