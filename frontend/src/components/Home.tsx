import { Box, Container, Button, makeStyles, Typography, useMediaQuery, useTheme} from "@material-ui/core"
import bkg from "../assets/xonin.001.png"
import { Link } from 'react-router-dom';

import network from "../contracts/network.json"
const networkName = network.Name 

const useStyles = makeStyles((theme) => ({
  
    title: {
      color: theme.palette.common.white,
      marginBottom: '1%',
      textAlign: "center",
      opacity: 1,
      zIndex: 1000,
    },
    root: {
        color: theme.palette.common.white,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
          height: '80vh',
          minHeight: 500,
          maxHeight: 1300,
        },
    },
    container: {
        marginTop: '20%',
        marginBottom: '10%',
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    containerMobile: {
        marginTop: '20%',
        marginBottom: '10%',
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    background: {
        backgroundImage: `url(${bkg})`,
        backgroundColor: '#7fc7d9', // Average color of the background image.
        backgroundPosition: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 50,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat',
        opacity: 0.5,
    },
    logo: {
        marginTop:    200,
        opacity: '1',
        zIndex: 1100
    },
    button: {
        marginTop: '5%',
        marginBottom: '10%',
    },

}))

export const Home = () => {

    const classes = useStyles()
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (

             <section className={classes.root}>
             <Container className={isMobile ? classes.containerMobile : classes.container}>

                <div className={classes.background} />

                {/* <img className={classes.logo} src={logo} width="50%" height='auto' /> */}
                    
                <Typography variant="h1" className={classes.title}>
                    Xonin 
                </Typography>

                <Typography variant="h4" className={classes.title}>
                   Onchain Generative Art
                </Typography>

                <Typography variant="h1" className={classes.title}>
                </Typography>

                <Typography variant="h6" className={classes.title}>
                {/* Create generative art on the {networkName} blockchain! 
                Transaction hashes are used as seeds for the algorithm, creating unique patterns for every NFT minted. 
                The artwork exists fully onchain, independent of external data providers. */}
                A generative art collection featuring unique abstract designs of layered vivid curves and geometric shapes, 
                crafted with 100 distinct color palettes. 
                The artworks are created, rendered, and stored fully onchain to ensure immutability and permanence.
                </Typography>
                

                <Button component={Link} to="/mint" variant="contained" color="primary" className={classes.button}>
                Mint NFT
                </Button>

            </Container>

            </section>

      )
    
}