import React from "react"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { Main } from "./components/Main"
import { Mainnet, DAppProvider, useEtherBalance, useEthers, Config, Rinkeby } from '@usedapp/core'
import { Container } from "@material-ui/core"

const config: Config = {
  readOnlyChainId: Rinkeby.chainId,
  readOnlyUrls: {
    [Rinkeby.chainId]: 'https://rinkeby.infura.io/v3/847c45b102374b7f917b1e360bf4eccb',
    [Mainnet.chainId]: '',
  },
  autoConnect: false,
  networks: [Rinkeby]
}

export const App = () => {
  return (
    <DAppProvider config={config}>
      <Header />
      
      {/* <Container  > */}
        <Main />
      {/* </Container> */}

      <Footer />


    </DAppProvider>
  )
}
export default App