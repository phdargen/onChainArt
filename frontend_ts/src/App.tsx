import React from "react"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { Main } from "./components/Main"
import { Mainnet, DAppProvider, Config, Rinkeby } from '@usedapp/core'
import { Container } from "@material-ui/core"

import { BrowserRouter as Router } from "react-router-dom";

const config: Config = {
  readOnlyChainId: Rinkeby.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: 'https://mainnet.infura.io/v3/847c45b102374b7f917b1e360bf4eccb',
    [Rinkeby.chainId]: 'https://rinkeby.infura.io/v3/847c45b102374b7f917b1e360bf4eccb'
  },
  autoConnect: false,
  //multicallVersion: 2 as const,
  //networks: [Rinkeby]
}

export const App = () => {
  return (
    <DAppProvider config={config}>

      <Router>

        <Header />

        <Main />

        <Footer />

      </Router> 

    </DAppProvider>
  )
}
export default App