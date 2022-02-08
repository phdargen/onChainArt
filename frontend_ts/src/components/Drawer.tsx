import React, { useState } from "react";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles, Button
} from "@material-ui/core";
import { Link } from "react-router-dom";

import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles(()=>({
    link:{
        textDecoration:"none",
        color: "white",
        fontSize: "25px",
        //backgroundColor:  "#28282a",
    },
    list: {
        color: "white",
        backgroundColor:  "#28282a",
        padding: 0,
        textAlign: 'left'
    },
    icon:{
        color: "white"
    },
    drawer:{
        anchor: "right",
    },
    paper: {
        background: '#28282a',
        color: 'white'
    },
    button: {
        width: '100%'
    },
}));

function DrawerComponent() {

  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (
    index: number
  ) => {
    setSelectedIndex(index);
  };
  
  return (
    <>
      <Drawer className={classes.drawer} anchor="right" classes={{ paper: classes.paper }} PaperProps={{ elevation: 9 }}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List className={classes.list}>

            <Button className={classes.button} color="primary" variant={selectedIndex === 1 ? "contained" : "text"} onClick={ () => handleListItemClick(1)}>
            <ListItem onClick={() => setOpenDrawer(false)}>
                <ListItemText>
                <Link to="/" className={classes.link}>Mint</Link>
                </ListItemText>
            </ListItem>
            </Button>

            <Divider/>

            <Button className={classes.button} color="primary" variant={selectedIndex === 2 ? "contained" : "text"} onClick={ () => handleListItemClick(2)}>
            <ListItem onClick={() => setOpenDrawer(false)}>
                <ListItemText>
                <Link to="/gallery" className={classes.link}>Gallery</Link>
                </ListItemText>
            </ListItem>
            </Button>

            <Divider/>


            <Button className={classes.button} color="primary" variant={selectedIndex === 3 ? "contained" : "text"} onClick={ () => handleListItemClick(3)}>
            <ListItem onClick={() => setOpenDrawer(false)}>
                <ListItemText>
                <Link to="/myNFT" className={classes.link}>My NFTs</Link>
                </ListItemText>
            </ListItem>
            </Button>

        </List>

      </Drawer>

      <IconButton onClick={() => setOpenDrawer(!openDrawer)}className={classes.icon}>
        <MenuIcon />
      </IconButton>

    </>
  );
}
export default DrawerComponent;