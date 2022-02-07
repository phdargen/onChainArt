import React, { useState } from "react";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
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
        padding: 0
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
      }
}));

function DrawerComponent() {

  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  
  return (
    <>
      <Drawer className={classes.drawer} anchor="right" classes={{ paper: classes.paper }} PaperProps={{ elevation: 9 }}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List className={classes.list}>
        <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/" className={classes.link}>Mint</Link>
            </ListItemText>
          </ListItem>
          <Divider/>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/gallery" className={classes.link}>Gallery</Link>
            </ListItemText>
          </ListItem>
          <Divider/>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/myNFT" className={classes.link}>My NFTs</Link>
            </ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}className={classes.icon}>
        <MenuIcon />
      </IconButton>
    </>
  );
}
export default DrawerComponent;