import React from "react"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { Main } from "./components/Main"
import { DAppProvider, Config, Base, Sepolia, MetamaskConnector, CoinbaseWalletConnector } from '@usedapp/core'
import { WalletConnectV2Connector } from '@usedapp/wallet-connect-v2-connector'

import { BrowserRouter as Router } from "react-router-dom";

const config: Config = {
  readOnlyChainId: Base.chainId,
  readOnlyUrls: {
    [Base.chainId]: 'https://base-mainnet.g.alchemy.com/v2/ds6oYH2QmD8U7PwnkgCxSCnVf_iL9xSA',
   // [Sepolia.chainId]: 'https://sepolia.infura.io/v3/847c45b102374b7f917b1e360bf4eccb',
   // [Sepolia.chainId]: 'https://eth-sepolia.g.alchemy.com/v2/20ILLtX95D8HGmgZBVcmRVz0iBm11PbO',
  },
  autoConnect: false,
  //multicallVersion: 2 as const,
  networks: [Base],
  refresh: 5,
  fastMulticallEncoding: true,
  noMetamaskDeactivate: true,
  connectors: {
    metamask: new MetamaskConnector(),
    coinbase: new CoinbaseWalletConnector(),    
    walletConnectV2: new WalletConnectV2Connector({
      projectId: 'b95cd4eb67ed49b040bbcb1abf12ead6',
      chains: [Base],
      rpcMap: {
        [Base.chainId]: 'https://base-mainnet.g.alchemy.com/v2/ds6oYH2QmD8U7PwnkgCxSCnVf_iL9xSA',
      },
    }),
  }
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