import React from "react"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { Main } from "./components/Main"
import { Mainnet, DAppProvider, Config, Goerli, Sepolia } from '@usedapp/core'

import { BrowserRouter as Router } from "react-router-dom";

const config: Config = {
  readOnlyChainId: Sepolia.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: 'https://mainnet.infura.io/v3/847c45b102374b7f917b1e360bf4eccb',
    [Goerli.chainId]: 'https://goerli.infura.io/v3/847c45b102374b7f917b1e360bf4eccb',
    // [Sepolia.chainId]: 'https://sepolia.infura.io/v3/847c45b102374b7f917b1e360bf4eccb',
    [Sepolia.chainId]: 'https://eth-sepolia.g.alchemy.com/v2/20ILLtX95D8HGmgZBVcmRVz0iBm11PbO',
  },
  autoConnect: false,
  //multicallVersion: 2 as const,
  networks: [Sepolia]
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