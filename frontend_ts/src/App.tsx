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
    [Rinkeby.chainId]: 'https://rinkeby.infura.io/v3/14a0951f47e646c1b241aa533e150219'
  },
  autoConnect: false,
  //multicallVersion: 2 as const,
  networks: [Rinkeby]
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