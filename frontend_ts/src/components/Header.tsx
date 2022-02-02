import { Button, makeStyles, AppBar, Toolbar, Box, Typography } from "@material-ui/core"
import { useEthers } from "@usedapp/core"

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
  }
}))

export const Header = () => {
  const classes = useStyles()

  const { account, activateBrowserWallet, deactivate } = useEthers()

  const isConnected = account !== undefined

  return (
   
    <div className={classes.container}>
        <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
        <Box display='flex' flexGrow={1}>
          <Typography variant="h2" component="h1" classes={{ root: classes.title,}}>
            Onchain Art
          </Typography>
        </Box>

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
