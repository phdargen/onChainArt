import React, { useEffect, useState } from "react"

import { useConfig, useEthers, DEFAULT_SUPPORTED_CHAINS } from "@usedapp/core"

import { Snackbar} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import { Home } from "./Home"
import { MintNFT } from "./MintNFT"
import { MyNFT } from "./myNFT"
import { Gallery } from "./Gallery"

import {Routes, Route} from "react-router-dom";

export const Main = () => {

  // Get network id
  const { readOnlyChainId } = useConfig()
  const readOnlyChainName = DEFAULT_SUPPORTED_CHAINS.find((network) => network.chainId === readOnlyChainId)?.chainName

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
    if ( (error && error.name === "UnsupportedChainIdError" ) || (chainId !== readOnlyChainId && isConnected) ) {
      !showNetworkError && setShowNetworkError(true)
    } else {
      showNetworkError && setShowNetworkError(false)
    }
  }, [error, showNetworkError, chainId, isConnected])

  // Render UI
  return (
    <>

      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="mint" element={<MintNFT />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="myNFT" element={<MyNFT />} />
      </Routes>

      <Snackbar
        open={showNetworkError}
        autoHideDuration={5000}
        onClose={handleCloseNetworkError}
      >
        <Alert onClose={handleCloseNetworkError} severity="warning">
          Please connect to the {readOnlyChainName} network!
        </Alert>
      </Snackbar>
    </>
  )
}