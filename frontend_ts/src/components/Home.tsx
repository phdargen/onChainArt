import { Box, Container, Button, makeStyles, Typography} from "@material-ui/core"

import logo from "../assets/xonin.png"
import bkg from "../assets/xoninExamples.png"

const useStyles = makeStyles((theme) => ({
  
    title: {
      color: theme.palette.common.white,
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
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    background: {
        backgroundImage: `url(${bkg})`,
        backgroundColor: '#7fc7d9', // Average color of the background image.
        backgroundPosition: 'center',
        //height: "100vh",
        position: 'absolute',
        left: 0,
        right: 0,
        top: 50,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        opacity: 0.5,
        // zIndex: 0,
    },
    logo: {
        marginTop:    200,
        opacity: '1',
        zIndex: 1100
    },

}))

export const Home = () => {

    const classes = useStyles()

    return (

             <section className={classes.root}>
             <Container className={classes.container}>

                <div className={classes.background} />

                {/* <img className={classes.logo} src={logo} width="50%" height='auto' /> */}
                    
                <Typography variant="h3" className={classes.title}>
                        Xonin.NFT
                </Typography>

                <Typography variant="h6" className={classes.title}>
                        Based generative art fully onchain
                </Typography>



            </Container>

            </section>

      )
    
}