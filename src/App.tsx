import React, {Suspense, useEffect, useState} from 'react';
import {Canvas} from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import NavBar from './components/NavBar';
// import Modal from './components/Modal';
import Button from "@mui/material/Button";
import {ethers} from "ethers";
import * as rainSDK from "rain-sdk";
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import {Divider, Icon} from "@mui/material";
import Shoes from "./components/Shoes";
import { connect } from "./connect.js"; // a very basic web3 connection implementation
import { opcodeData } from "./opcodeData.js";
import Typography from "@mui/material/Typography"; // opcode data for RainVM


import Box from '@mui/material/Box';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

declare var process : {
  env: {
    REACT_APP_RESERVE_TOKEN_ADDRESS: string
    REACT_APP_RESERVE_ERC20_DECIMALS: string
    REACT_APP_REDEEMABLE_ERC20_DECIMALS: string
    REACT_APP_STATIC_RESERVE_PRICE_OF_REDEEMABLE: string
    REACT_APP_SALE_TIMEOUT_IN_BLOCKS: string
  }
}


/**
 * App
 *
 * @constructor
 */
function App() {
  // const [modalOpen, setModalOpen] = useState(false)
  // const [selectedImage, setSelectedImage] = useState("")
  // const [entryAllowed, setEntryAllowed] = useState(false);
  // const [userBalance, setUserBalance] = useState(0);

  const [signer, setSigner] = useState();
  const [address, setAddress] = useState("");
  const [reserveTokenAddress, setReserveTokenAddress] = useState(process.env.REACT_APP_RESERVE_TOKEN_ADDRESS);
  const [reserveDecimals, setReserveDecimals] = useState(process.env.REACT_APP_RESERVE_ERC20_DECIMALS);
  const [redeemableDecimals, setRedeemableDecimals ] = useState(process.env.REACT_APP_REDEEMABLE_ERC20_DECIMALS);
  const [redeemableWalletCap, setRedeemableWalletCap] = useState(ethers.constants.MaxUint256);
  const [staticReservePriceOfRedeemable, setStaticReservePriceOfRedeemable] =
    useState(ethers.utils.parseUnits(process.env.REACT_APP_STATIC_RESERVE_PRICE_OF_REDEEMABLE, parseInt(reserveDecimals)));
  const [saleTimeoutInBlocks, setSaleTimeoutInBlocks] = useState(process.env.REACT_APP_SALE_TIMEOUT_IN_BLOCKS);

  const handleChangeReserveTokenAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReserveTokenAddress(event.target.value);
  };


  async function makeWeb3Connection() {
    try {
      const {signer, address} = await connect(); // get the signer and account address using a very basic connection implementation
      setSigner(signer);
      setAddress(address);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Get UserBalance
   */
  // async function getUserBalance() {
  //   try {
  //     // const signer = await getSigner();
  //     // const address = await signer.getAddress();
  //
  //     // const gatedNFTContract = new rainSDK.GatedNFT(YOUR_GATEDNFT_ADDRESS, signer);
  //     // const userBalance = await gatedNFTContract.balanceOf(address);
  //     // const balance = userBalance.toNumber();
  //     console.log(`Your Balance: `, balance);
  //     setUserBalance(balance);
  //   } catch(err) {
  //     console.log('------------------------------');
  //     console.log(`Info: Something went wrong:`, err);
  //   }
  // }

  /**
   * Try to Enter the Gallery
   *
   * @param userBalance
   * @param setEntryAllowed
   */
  // async function tryEntry(userBalance: number, setEntryAllowed: any) {
  //   if (userBalance < 1) {
  //     console.log('here')
  //     alert('You need to buy a ticket to enter');
  //   } else {
  //     setEntryAllowed(true);
  //   }
  // }

  /**
   * Purchase Ticket
   */
  // async function purchaseTicket(userBalance: number) {
  //   try {
  //     if (userBalance >= 1) {
  //       alert('You already have a ticket!');
  //     } else {
  //       const signer = await getSigner();
  //       const address = await signer.getAddress();
  //
  //       alert('Minting, please wait a moment and don\`t refresh the page!');
  //       const gatedNFTContract = new rainSDK.GatedNFT(YOUR_GATEDNFT_ADDRESS, signer);
  //       await gatedNFTContract.mint(address); // get one of the NFTs needed to take part in the sale
  //
  //       // todo add a way to check when the mint has finished
  //
  //       await getUserBalance(); // this will trigger useEffect and update the text in the frontend
  //       alert('Done, you will (currently) need to refresh the page when the mint is complete!');
  //     }
  //   } catch(err) {
  //     console.log('------------------------------');
  //     console.log(`Info: Something went wrong:`, err);
  //   }
  // }

  /**
   * Get Balance on Startup
   */
  // useEffect(() => {
  //   getUserBalance()
  // }, [userBalance])

  const [saleView, setSaleView] = React.useState(false);

  // run once on render
  useEffect(() => {
    let queryString = new URLSearchParams(window.location.search);
    let saleAddress = queryString.get('s');

    if (typeof saleAddress !== 'undefined' && saleAddress) {
      console.log(`saleAddress is ${saleAddress}`) // why logged twice: https://stackoverflow.com/questions/60971185/why-does-create-react-app-initialize-twice
      setSaleView(true);
    }
  },[]);

  useEffect(() => {
    makeWeb3Connection();
  },[]);

  const amountOfShoes = 2;



  if (!saleView) {

  }


  /**
   * View
   */
  return (
    <div className="rootContainer">
      <NavBar />



      {/*<div hidden={entryAllowed} className="gatedSection">*/}
      {/*  <div className="gatedSection__left"></div>*/}
      {/*  <div className="gatedSection__right">*/}
      {/*    <div className="gatedSection__info">*/}
      {/*      <h1>Welcome to MetaGallery</h1><p><span>Please either show or purchase an entry ticket to enter. <br/><br/>*/}
      {/*      You will need to connect to Polygon Mumbai Testnet, and have some Testnet Matic. <br/><br/>*/}
      {/*      You might also want to check the console in your browser (works best in Chrome).</span></p>*/}

      {/*      <br/>*/}
      {/*      <Divider color="white" variant="fullWidth"/>*/}
      {/*      <br/>*/}

      {/*      <p>You currently have {userBalance < 1 ? "no ticket!" : "a ticket!"}</p><div className="ticket" hidden={userBalance == 0}><LocalActivityIcon/></div>*/}
      {/*      <br/>*/}
      {/*      <Button onClick={() => {tryEntry(userBalance, setEntryAllowed)}} variant="outlined" color="primary">Enter</Button>&nbsp;*/}
      {/*      <Button onClick={() => {purchaseTicket(userBalance)}} variant="outlined" color="secondary">Purchase</Button>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      { !saleView && (
        <>

          <Box
            className="admin-form"
            component="form"
            sx={{
              '& > :not(style)': { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <Typography variant="h3" component="h2" color="black">
              Configure a Shoe NFT Sale
            </Typography>

            <FormControl variant="standard">
              <InputLabel htmlFor="component-helper">The Token that Users will use to buy Shoe NFTs</InputLabel>
              <Input
                id="component-helper"
                value={reserveTokenAddress}
                onChange={handleChangeReserveTokenAddress}
                aria-describedby="component-helper-text"
              />
              <FormHelperText id="component-helper-text">
                Default: a version of USDC (18 Decimals)
              </FormHelperText>
            </FormControl>

            <Button variant="outlined">Deploy Sale</Button>

            {/*<FormControl disabled variant="standard">*/}
            {/*  <InputLabel htmlFor="component-disabled">Name</InputLabel>*/}
            {/*  <Input id="component-disabled" value={name} onChange={handleChange} />*/}
            {/*  <FormHelperText>Disabled</FormHelperText>*/}
            {/*</FormControl>*/}

            {/*<FormControl error variant="standard">*/}
            {/*  <InputLabel htmlFor="component-error">Name</InputLabel>*/}
            {/*  <Input*/}
            {/*    id="component-error"*/}
            {/*    value={name}*/}
            {/*    onChange={handleChange}*/}
            {/*    aria-describedby="component-error-text"*/}
            {/*  />*/}
            {/*  <FormHelperText id="component-error-text">Error</FormHelperText>*/}
            {/*</FormControl>*/}
          </Box>
        </>
      )}


      { saleView && (

        <div className="canvasContainer">
          {/*<Modal open={modalOpen} setModalOpen={setModalOpen} selectedImage={selectedImage} />*/}

          <Canvas camera={{ position: [0, 0, 20], fov: 50 }} performance={{ min: 0.1 }}>
            <ambientLight intensity={0.5} />
            <directionalLight intensity={0.3} position={[5, 25, 20]} />
            <Suspense fallback={null}>
              <Shoes amount={amountOfShoes} />
              <Environment preset="city" />
            </Suspense>
            <OrbitControls autoRotate autoRotateSpeed={1} />

            {/*<color attach="background" args={['#191920']}/>*/}
            {/*<fog attach="fog" args={['#191920', 0, 15]}/>*/}
            {/*<Environment preset="city"/>*/}

          </Canvas>
        </div>
      )}

    </div>
  );
}

export default App;
