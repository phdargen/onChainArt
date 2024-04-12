import React, { useState, useEffect } from "react"
import { utils, constants } from "ethers"
import {TextField, Container, Grid, Card, CardContent, CardMedia, CardActions, Tab, Typography, Button, makeStyles, Box, Link, CircularProgress, Snackbar } from "@material-ui/core"

import { useCoingeckoPrice } from '@usedapp/coingecko'
import { formatUnits } from "@ethersproject/units"

import { useGetSVG, useMintNFT, usePrice, useBalanceOf, useTokenOfOwnerByIndex, useTotalSupply, useMaxSupply} from "../hooks"
import { useSetPrice, useTransferOwnership, useOwner, useWithdraw, useSetRoyaltyAddress, useRoyalyAddress} from "../hooks"

// Get contract
import network from "../contracts/network.json"
import { Contract } from '@ethersproject/contracts'
import contractAdresses from "../contracts/contracts.json"
import contractNftAbi from '../contracts/myNFT.json'
import { useEtherBalance } from "@usedapp/core"

const networkId = network.ChainId 
const contractInterface = new utils.Interface(contractNftAbi.abi)
const contractAdress = (contractAdresses as any)[networkId.toString()]?.shapeNFT 
const contract = new Contract(contractAdress, contractInterface) as any
const contractAdress2 = (contractAdresses as any)[networkId.toString()]?.pathNFT 
const contract2 = new Contract(contractAdress2, contractInterface) as any


const useStyles = makeStyles((theme) => ({
    Card: {
        marginTop: '5%',
        marginBottom: '5%',
        //margin: '5%',
        margin:'auto',
        paddingTop: '0%',
        paddingBottom: '0%',
        width: '45%',
        // maxWidth: 500,
        // [theme.breakpoints.down("md")] : {
        //     width: '60%',
        //     marginTop: '10%',
        // },
        align: "center",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "linear-gradient(#28282a, #28282a);" 
        backgroundColor: "#28282a" ,
        color: "white",
      },
      grid: {
        align: 'center',
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingBottom: '2%',
      },
}))


export const Dev = () => {

    const classes = useStyles()
    const etherPrice =  useCoingeckoPrice('ethereum', 'usd');

    // Shape NFT
    const priceMint = usePrice(contract);
    const [price, setPrice] = useState(priceMint ? (formatUnits(priceMint, 18)) : "Price" ) ;
    const { state: stateSetPrice, send: sendSetPrice } = useSetPrice(contract)
    const setPriceTransaction = (price: string) => {
      void sendSetPrice(utils.parseEther(price))
    }
    useEffect(() => {
        if (priceMint !== undefined && price === "Price") {
          setPrice(formatUnits(priceMint, 18)); 
        }
      }, [priceMint]);

    const currentOwner = useOwner(contract);
    const [owner, setOwner] = useState(currentOwner ? currentOwner : "Owner") ;
    const { state: stateSetOwner, send: sendSetOwner } = useTransferOwnership(contract);
    const setOwnerTransaction = (owner: string) => {
      void sendSetOwner(owner);
    }
    useEffect(() => {
        if (currentOwner !== undefined && owner === "Owner") {
          setOwner(currentOwner); 
        }
      }, [currentOwner]);

    const currentBalance = useEtherBalance(contractAdress,{chainId: networkId});
    const [balance, setBalance] = useState(currentBalance ? currentBalance : "Balance") ;
    const { state: stateWithdraw, send: sendWithdraw } = useWithdraw(contract);
    const withdrawTransaction = () => {
        void sendWithdraw();
    }
    useEffect(() => {
        if (currentBalance !== undefined && etherPrice !== undefined ) {
            const bal = formatUnits(currentBalance, 18);
            const priceUSD: number = parseFloat(bal) * parseFloat(etherPrice);
            const formattedPriceUSD = priceUSD.toFixed(2);  
            setBalance(`${bal} (${formattedPriceUSD} $)`); 
        }
      }, [currentBalance,etherPrice]);


    // Path NFT
    const priceMint2 = usePrice(contract2);
    const [price2, setPrice2] = useState(priceMint2 ? (formatUnits(priceMint2, 18)) : "Price" ) ;
    const { state: stateSetPrice2, send: sendSetPrice2 } = useSetPrice(contract2)
    const setPriceTransaction2 = (price: string) => {
      void sendSetPrice2(utils.parseEther(price2))
    }
    useEffect(() => {
        if (priceMint2 !== undefined && price2 === "Price") {
          setPrice2(formatUnits(priceMint2, 18)); 
        }
      }, [priceMint2]);

    const currentOwner2 = useOwner(contract2);
    const [owner2, setOwner2] = useState(currentOwner2 ? currentOwner2 : "Owner") ;
    const { state: stateSetOwner2, send: sendSetOwner2 } = useTransferOwnership(contract2);
    const setOwnerTransaction2 = (owner: string) => {
      void sendSetOwner2(owner2);
    }
    useEffect(() => {
        if (currentOwner2 !== undefined && owner2 === "Owner") {
          setOwner2(currentOwner2); 
        }
      }, [currentOwner2]);

    const currentBalance2 = useEtherBalance(contractAdress2,{chainId: networkId});
    const [balance2, setBalance2] = useState(currentBalance2 ? currentBalance2 : "Balance") ;
    const { state: stateWithdraw2, send: sendWithdraw2 } = useWithdraw(contract2);
    const withdrawTransaction2 = () => {
        void sendWithdraw2();
    }
    useEffect(() => {
        if (currentBalance2 !== undefined && etherPrice !== undefined ) {
            const bal = formatUnits(currentBalance2, 18);
            const priceUSD: number = parseFloat(bal) * parseFloat(etherPrice);
            const formattedPriceUSD = priceUSD.toFixed(2);  
            setBalance2(`${bal} (${formattedPriceUSD} $)`); 
        }
      }, [currentBalance2,etherPrice]);


    return (
        <>

        <Box textAlign="center" pt={{ xs: 5, sm: 10 }} pb={{ xs: 5, sm: 0 }} width="100%">
        <Container maxWidth="lg" >
        <Grid className={classes.grid} container spacing={2}>

            <Card className={classes.Card}>
            <CardContent>        
                  <Typography gutterBottom variant="h4" component="div">
                        Xonin Shapes 
                    </Typography> 
                    <Typography gutterBottom variant="h6" component="div">
                        Contract: {contractAdress} 
                    </Typography> 
            </CardContent>

            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField fullWidth value={price} onChange={(e) => setPrice(e.target.value)} type="text" label="Price in ETH" variant="outlined" inputProps={{style:{color:'white'}}} InputLabelProps={{style:{color:'white'}}}/>
                    <Button color="primary" variant="contained" size="large" onClick={() => price && setPriceTransaction(price)}>Set Price</Button>
            </CardActions>

            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField fullWidth value={owner} onChange={(e) => setOwner(e.target.value)} type="text" label="Owner" variant="outlined" inputProps={{style:{color:'white'}}} InputLabelProps={{style:{color:'white'}}}/>
                    <Button color="primary" variant="contained" size="large" onClick={() => owner && setOwnerTransaction(String(owner))}>Set Owner</Button>
            </CardActions>

            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField fullWidth color="primary" value={balance} type="text" label="ETH balance" variant="outlined" inputProps={{style:{color:'white'}}} InputLabelProps={{style:{color:'white'}}} />
                    <Button color="primary" variant="contained" size="large" onClick={() => withdrawTransaction()}>Withdraw</Button>
            </CardActions>

            </Card>

            
            <Card className={classes.Card}>
            <CardContent>        
                  <Typography gutterBottom variant="h4" component="div">
                        Xonin Paths 
                    </Typography> 
                    <Typography gutterBottom variant="h6" component="div">
                        Contract: {contractAdress2} 
                    </Typography> 
            </CardContent>

            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField fullWidth value={price2} onChange={(e) => setPrice2(e.target.value)} type="text" label="Price in ETH" variant="outlined" inputProps={{style:{color:'white'}}} InputLabelProps={{style:{color:'white'}}}/>
                    <Button color="primary" variant="contained" size="large" onClick={() => price2 && setPriceTransaction2(price2)}>Set Price</Button>
            </CardActions>

            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField fullWidth value={owner2} onChange={(e) => setOwner2(e.target.value)} type="text" label="Owner" variant="outlined" inputProps={{style:{color:'white'}}} InputLabelProps={{style:{color:'white'}}}/>
                    <Button color="primary" variant="contained" size="large" onClick={() => owner2 && setOwnerTransaction2(String(owner2))}>Set Owner</Button>
            </CardActions>

            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField fullWidth color="primary" value={balance2} type="text" label="ETH balance" variant="outlined" inputProps={{style:{color:'white'}}} InputLabelProps={{style:{color:'white'}}} />
                    <Button color="primary" variant="contained" size="large" onClick={() => withdrawTransaction2()}>Withdraw</Button>
            </CardActions>

            </Card>

        </Grid>
        </Container>
        </Box>

        </>

      )
    
}