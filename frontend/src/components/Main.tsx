import React, { useEffect, useState } from "react"

import { useEthers } from "@usedapp/core"

import { Snackbar} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import { Home } from "./Home"
import { MintNFT } from "./MintNFT"
import { MyNFT } from "./myNFT"
import { Gallery } from "./Gallery"
import { Dev } from "./Dev"

import {Routes, Route} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"

import network from "../contracts/network.json"
const networkId = network.ChainId 
const networkName = network.Name 

export const Main = () => {

  // Check connnection
  const { chainId, active, error, account } = useEthers()
  const isConnected = account !== undefined

  // Hanlde network errors
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
    if ( (error && error.name === "UnsupportedChainIdError" ) || (chainId !== networkId && isConnected) ) {
      !showNetworkError && setShowNetworkError(true)
    } else {
      showNetworkError && setShowNetworkError(false)
    }
  }, [error, showNetworkError, chainId, isConnected])

  // Render UI
  return (
    <>
      <Analytics/>
      <Routes>
          <Route path="" element={<Home />} />
          <Route path="mint" element={<MintNFT />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="myNFT" element={<MyNFT />} />
          <Route path="Dev" element={<Dev />} />
      </Routes>

      <Snackbar
        open={showNetworkError}
        autoHideDuration={5000}
        onClose={handleCloseNetworkError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
      >
        <Alert onClose={handleCloseNetworkError} severity="warning">
          Please switch to {networkName} network!
        </Alert>
      </Snackbar>
    </>
  )
}