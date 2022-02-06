import { Button, makeStyles, AppBar, Toolbar, Box, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { useEthers } from "@usedapp/core"

import { Link } from "react-router-dom";
import DrawerComponent from "./Drawer";

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
    marginLeft: theme.spacing(20),
    "&:hover": {
      color: "yellow",
      borderBottom: "1px solid white",
    },
  }
}))

export const Header = () => {

  const classes = useStyles()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { account, activateBrowserWallet, deactivate } = useEthers()
  const isConnected = account !== undefined

  return (
   
    <div className={classes.container}>
        <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
      
        <Box display='flex' flexGrow={1}>

          {isMobile ? (
            <Typography variant="h4" component="h1" classes={{ root: classes.title,}}>
              Onchain Art
            </Typography>
          ) : (
            <Typography variant="h2" component="h1" classes={{ root: classes.title,}}>
              Onchain Art
            </Typography>
          )}

        </Box>

        {isMobile ? (
          <DrawerComponent />
        ) : (
          <div className={classes.navlinks}>
            <Link to="/" className={classes.link}>
              Mint
            </Link>
            <Link to="/gallery" className={classes.link}>
              Gallery
            </Link>
            <Link to="/myNFT" className={classes.link}>
              My NFTs
            </Link>
          </div>
        )}

        {isConnected ? (
            <>
              <Button color="primary" variant="contained" size="large">
                {`${account?.slice(0, 4)}...${account?.slice(-3)}`}
              </Button>
              {/* <Button color="primary" variant="contained" size="large" onClick={() => deactivate()}>
                Disconnect
              </Button> */}
            </>
          ) : (
            <Button color="primary" variant="contained" size="large" onClick={() => activateBrowserWallet()}>
              Connect
            </Button>
        )}

            
      </Toolbar>
      </AppBar>
    </div>
      
  )


}
