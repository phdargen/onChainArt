import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Button, makeStyles, AppBar, Toolbar, Box, Typography, useMediaQuery, useTheme, List, ListItem, ListItemText, Drawer, Divider, IconButton} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu";
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import { useEthers} from "@usedapp/core"

import MetaMaskIcon from '../assets/metamaskIcon.png';
import WalletConnectIcon from '../assets/walletConnectIcon.png';
import CoinbaseIcon from '../assets/coinbaseIcon.png';

import network from "../contracts/network.json"
const networkId = network.ChainId 
const networkName = network.Name 

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "flex-end",
  },
  title: {
    color: theme.palette.common.white,
    textAlign: "center",
  },
  appBar: {
    backgroundColor:  "#28282a",
  },
  navlinks: {
    marginLeft: theme.spacing(5),
    display: "flex",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "20px",
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    "&:hover": {
      //color: "red",
      //borderBottom: "2px solid red",
    },
  },
  button: {
      marginRight: theme.spacing(5),
  },

  linkDrawer:{
    textDecoration:"none",
    color: "white",
    fontSize: "25px",
  },
  listDrawer: {
      color: "white",
      backgroundColor:  "#28282a",
      padding: 0,
      textAlign: 'left'
  },
  iconDrawer:{
      color: "white"
  },
  drawer:{
      anchor: "right",
  },
  paperDrawer: {
      background: '#28282a',
      color: 'white'
  },
  buttonDrawer: {
      width: '100%'
  },
  
}))

export const Header = () => {

  const classes = useStyles()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { account, activateBrowserWallet, deactivate, chainId, switchNetwork } = useEthers()
  const isConnected = account !== undefined
  const isCorrectChain = chainId === networkId

  const [openDrawer, setOpenDrawer] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (
    index: number
  ) => {
    setSelectedIndex(index);
  };

  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") setSelectedIndex(0);
    if (location.pathname === "/mint") setSelectedIndex(1);
    if (location.pathname === "/gallery") setSelectedIndex(2);
    if (location.pathname === "/myNFT") setSelectedIndex(3);
  }, [location]);

  const [openConnectDialog, setOpenConnectDialog] = useState(false);

  const handleOpenConnectDialog = () => {
    setOpenConnectDialog(true);
  };
  
  const handleCloseConnectDialog = () => {
    setOpenConnectDialog(false);
  };
  

  return (
   
    <div className={classes.container}>
        <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
      
        <Box display='flex' flexGrow={1}>

          {isMobile ? (
            <Typography variant="h4" component="h1" classes={{ root: classes.title,}}>
              Xonin
            </Typography>
          ) : (
            <Typography variant="h1" component="h1" classes={{ root: classes.title,}}>
              Xonin
            </Typography>
          )}

        </Box>


        {isMobile ? (
            <>
            <Drawer className={classes.drawer} anchor="right" classes={{ paper: classes.paperDrawer }} PaperProps={{ elevation: 9 }}
              open={openDrawer}
              onClose={() => setOpenDrawer(false)}
            >
              <List className={classes.listDrawer}>

                  <Button className={classes.buttonDrawer} color="primary" variant={selectedIndex === 0 ? "contained" : "text"} onClick={ () => handleListItemClick(0)}>
                  <ListItem onClick={() => setOpenDrawer(false)}>
                      <ListItemText>
                      <Link to="/" className={classes.link}>Home</Link>
                      </ListItemText>
                  </ListItem>
                  </Button>

                  <Button className={classes.buttonDrawer} color="primary" variant={selectedIndex === 1 ? "contained" : "text"} onClick={ () => handleListItemClick(1)}>
                  <ListItem onClick={() => setOpenDrawer(false)}>
                      <ListItemText>
                      <Link to="/mint" className={classes.link}>Mint</Link>
                      </ListItemText>
                  </ListItem>
                  </Button>

                  <Divider/>

                  <Button className={classes.buttonDrawer} color="primary" variant={selectedIndex === 2 ? "contained" : "text"} onClick={ () => handleListItemClick(2)}>
                  <ListItem onClick={() => setOpenDrawer(false)}>
                      <ListItemText>
                      <Link to="/gallery" className={classes.link}>Gallery</Link>
                      </ListItemText>
                  </ListItem>
                  </Button>

                  <Divider/>


                  <Button className={classes.buttonDrawer} color="primary" variant={selectedIndex === 3 ? "contained" : "text"} onClick={ () => handleListItemClick(3)}>
                  <ListItem onClick={() => setOpenDrawer(false)}>
                      <ListItemText>
                      <Link to="/myNFT" className={classes.link}>My NFTs</Link>
                      </ListItemText>
                  </ListItem>
                  </Button>

              </List>

            </Drawer>

            <IconButton onClick={() => setOpenDrawer(!openDrawer)}className={classes.iconDrawer}>
              <MenuIcon />
            </IconButton>

            </>


        ) : (
          <div className={classes.navlinks}>

            <Button color="primary" variant={selectedIndex === 0 ? "contained" : "text"} onClick={ () => handleListItemClick(0)}>
              <Link to="/" className={classes.link}>
              Home
              </Link>
            </Button>


            <Button color="primary" variant={selectedIndex === 1 ? "contained" : "text"} onClick={ () => handleListItemClick(1)}>
              <Link to="/mint" className={classes.link}>
              Mint 
              </Link>
            </Button>

            <Button color="primary" variant={selectedIndex === 2 ? "contained" : "text"} onClick={ () => handleListItemClick(2)}>
              <Link to="/gallery" className={classes.link}>
                Gallery
              </Link>
            </Button>

            <Button color="primary" variant={selectedIndex === 3 ? "contained" : "text"} onClick={ () => handleListItemClick(3)} className={classes.button}>
              <Link to="/myNFT" className={classes.link}>
                My NFTs
              </Link>
            </Button>

          </div>
            
        )}

        {isConnected ? (
              isCorrectChain ? (
                <Button color="primary" variant="contained" size={isMobile ? "small" : "large"}>
                    {`${account?.slice(0, 4)}...${account?.slice(-3)}`}
                </Button>
              ) : (
                <Button color="primary" variant="contained" size={isMobile ? "small" : "large"} onClick={() => switchNetwork(networkId)} disabled={chainId === networkId}>
                    Switch to {networkName}
               </Button>
            )
          ) : (
                <Button color="primary" variant="contained" size={isMobile ? "small" : "large"} onClick={handleOpenConnectDialog}>
                  Connect
                </Button>
        )}

      

      </Toolbar>
      </AppBar>

      <Dialog open={openConnectDialog} onClose={handleCloseConnectDialog} >
      <DialogTitle>Select a Wallet</DialogTitle>
      <DialogContent style={{ width: 250, height: 150}}>

        <Button style={{ marginRight: 0 }} onClick={() => { activateBrowserWallet({ type: 'metamask' }); handleCloseConnectDialog(); }}> 
         <img src={MetaMaskIcon}  style={{ width: 30, height: 30, marginRight: 10}} />
          Browser Wallet
        </Button>

        <Button style={{ marginRight: 0 }}  onClick={() => { activateBrowserWallet({ type: 'coinbase' }); handleCloseConnectDialog(); }}>
          <img src={CoinbaseIcon} style={{ width: 30, height: 30, marginRight: 10 }} />
           Coinbase Wallet
        </Button>

       <Button style={{ marginRight: 0 }}  onClick={() => { activateBrowserWallet({ type: 'walletConnectV2' }); handleCloseConnectDialog(); }}>
           <img src={WalletConnectIcon}  style={{ width: 30, height: 30, marginRight: 10 }} />
            WalletConnect 
        </Button>

      </DialogContent>
      </Dialog>

    </div>

    
      
  )


}
