/* eslint-disable spaced-comment */
/// <reference types="react-scripts" />

import React, { useEffect, useState } from "react"

import { ChainId, useEthers } from "@usedapp/core"
import { constants } from "ethers"

import { Snackbar, Typography, makeStyles } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import { MintNFT } from "./MintNFT"
import contractAdresses from "../contracts/contracts.json"

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.common.white,
    textAlign: "center",
    padding: theme.spacing(4),
  },
}))

export const Main = () => {
  const { chainId, active, error, account } = useEthers()
  const isConnected = account !== undefined

  const classes = useStyles()
  console.log(chainId)
  //const dappTokenAddress = chainId ? networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero

  const [showNetworkError, setShowNetworkError] = useState(false)

  const handleCloseNetworkError = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return
    }

    showNetworkError && setShowNetworkError(false)
  }

  useEffect(() => {
    if ( (error && error.name === "UnsupportedChainIdError" ) || (chainId != 4 && isConnected) ) {
      !showNetworkError && setShowNetworkError(true)
    } else {
      showNetworkError && setShowNetworkError(false)
    }
  }, [error, showNetworkError, chainId, isConnected])

  return (
    <>
      <Typography
        variant="h2"
        component="h1"
        classes={{
          root: classes.title,
        }}
      >
        Onchain Art
      </Typography>
      <MintNFT />
      <Snackbar
        open={showNetworkError}
        autoHideDuration={5000}
        onClose={handleCloseNetworkError}
      >
        <Alert onClose={handleCloseNetworkError} severity="warning">
          Please connect to the Rinkeby network!
        </Alert>
      </Snackbar>
    </>
  )
}