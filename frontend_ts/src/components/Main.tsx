import React, { useEffect, useState } from "react"

import { ChainId, useEthers } from "@usedapp/core"

import { Snackbar} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import { MintNFT } from "./MintNFT"

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
    if ( (error && error.name === "UnsupportedChainIdError" ) || (chainId != 4 && isConnected) ) {
      !showNetworkError && setShowNetworkError(true)
    } else {
      showNetworkError && setShowNetworkError(false)
    }
  }, [error, showNetworkError, chainId, isConnected])

  // Render UI
  return (
    <>
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