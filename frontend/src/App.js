import React, { useEffect, useState } from "react";
import img1 from './assets/token1.svg';
import { ethers } from 'ethers';
import contract from './contracts/myNFT.json';
import { Fragment } from 'react/cjs/react.production.min';

import Button from 'react-bootstrap/Button';

// Constants
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/rinkeby-squirrels';
const contractAddress = "0x140f60e69cC1032c6Dc4DE29778b251B3c4277E4";
const abi = contract.abi;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [metamaskError, setMetamaskError] = useState(null);
  const [mineStatus, setMineStatus] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const network = await ethereum.request({ method: 'eth_chainId' });

    if (accounts.length !== 0 && network.toString() === '0x4') {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setMetamaskError(false);
      setCurrentAccount(account);
      //setupEventListener();
    } else {
      setMetamaskError(true);
      console.log("No authorized account found");
    }
  }

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const network = await ethereum.request({ method: 'eth_chainId' });

      if (network.toString() === '0x4') {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Found an account! Address: ", accounts[0]);
        setMetamaskError(null);
        setCurrentAccount(accounts[0]);
      }

      else {
        setMetamaskError(true);
      }

    } catch (err) {
      console.log(err)
    }
  }

  const mintNFT = async () => {
    try {

      setMineStatus('mining');

      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        let price = await nftContract.price();

        console.log("Initialize payment");
        let nftTxn = await nftContract.mintNFT({ value: price });

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        setMineStatus('success');

      } else {
        setMineStatus('error');
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      setMineStatus('error');
      console.log(err);
    }
  }

  useEffect(() => {
    checkWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
    }
  }, [])

  // Render Methods
  const renderNotConnectedContainer = () => (
    <center>
      <Button onClick={connectWallet} class="btn btn-primary connect-wallet-button">
        Connect to Wallet
      </Button>
    </center>
  );

  const renderMintUI = () => {
    return (
      <center>
        <Button onClick={mintNFT} class="btn btn-primary connect-wallet-button" >
          Mint NFT
        </Button >
      </center>
    );
  }

  return (
    <Fragment>
      {metamaskError && <div className='metamask-error'>Please make sure you are connected to the Rinkeby Network on Metamask!</div>}
      <div className="App">

        <nav class="navbar navbar-expand-lg bg-secondary fixed-top" id="mainNav">
            <div class="container">
                <a class="navbar-brand js-scroll-trigger" href="#page-top"> DeepArt.NFT </a>
                <button class="navbar-toggler navbar-toggler-right text-uppercase font-weight-bold bg-primary text-white rounded" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    Menu
                    <i class="fas fa-bars"></i>
                </button>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" href="#portfolio">Workshop</a></li>
                        <li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" href="#myArt">My Collection</a></li>
                        <li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" href="#gallery">Gallery</a></li>
                        <li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" href="#about">About</a></li>
                        <li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" href="faq.html">FAQ</a></li>
                        <button class="btn btn-primary btn-connect" type="button" id="btn-connect">Connect wallet</button>
                    </ul>
                </div>
            </div>
        </nav>

        <section class="page-section bg-primary portfolio" id="portfolio">
          <div className="container d-flex align-items-center flex-column">
            {/* <Header opensea={OPENSEA_LINK} /> */}
            <div className="header-container">
              <div className='banner-img'>
                <img class="img-big rounded" src={img1}  alt="" />
              </div>
              {currentAccount && mineStatus !== 'mining' && renderMintUI()}
              {!currentAccount && !mineStatus && renderNotConnectedContainer()}
              <div className='mine-submission'>
                {mineStatus === 'success' && <div className={mineStatus}>
                  <p>NFT minting successful!</p>
                  <p className='success-link'>
                    <a href={`https://testnets.opensea.io/${currentAccount}/`} target='_blank' rel='noreferrer'>Click here</a>
                    <span> to view your NFT on OpenSea.</span>
                  </p>
                </div>}
                {mineStatus === 'mining' && <div className={mineStatus}>
                  <div className='loader' />
                  <span>Transaction is mining</span>
                </div>}
                {mineStatus === 'error' && <div className={mineStatus}>
                  <p>Transaction failed. Make sure you have at least 0.01 Rinkeby ETH in your Metamask wallet and try again.</p>
                </div>}
              </div>
            </div>
            {/* {mineStatus !== 'mining' && mineStatus !== 'success' && <div className='guide'>
              <p>Not sure what Rinkeby Squirrels are, what NFT minting is, or where to get Rinkeby ETH? &nbsp;
              </p>
            </div>} */}
            {/* <Footer address={contractAddress} /> */}
          </div>
        </section>

        <section class="page-section bg-secondary text-white mb-0" id="about">
            <div class="container">
                {/* <!-- About Section Heading--> */}
                <h2 class="page-section-heading text-center text-uppercase text-white">About</h2>
                {/* <!-- Icon Divider--> */}
                <div class="divider-custom divider-light">
                    <div class="divider-custom-line"></div>
                    <div class="divider-custom-icon"><i class="fas fa-robot"></i></div>
                    <div class="divider-custom-line"></div>
                </div>
                {/* <!-- About Section Content--> */}
                <div class="row">
                    <div class="col-lg-4 ml-auto"><p class="lead"> Get your unique artwork created by a deep learning algorithm that is seeded with your wallet address and transaction history.  </p></div>
                    <div class="col-lg-4 mr-auto"><p class="lead"> Admire your masterpiece and give it a title. Pick your favorite and upgrade it to an animated artwork. </p></div>
                </div>
            </div>
        </section>

      </div>

    </Fragment>
  );
};

export default App;
