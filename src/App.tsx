import React, {Suspense, useEffect, useState} from 'react';
import {Canvas} from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import NavBar from './components/NavBar';
// import Modal from './components/Modal';
import Button from "@mui/material/Button";
import {ethers, Signer} from "ethers";
import * as rainSDK from "rain-sdk";
import Shoes from "./components/Shoes";
import { connect } from "./connect.js"; // a very basic web3 connection implementation
import { opcodeData } from "./opcodeData.js";
import Typography from "@mui/material/Typography"; // opcode data for RainVM
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

declare var process : {
  env: {
    REACT_APP_RESERVE_TOKEN_ADDRESS: string
    REACT_APP_RESERVE_ERC20_DECIMALS: string
    REACT_APP_REDEEMABLE_ERC20_DECIMALS: string
    REACT_APP_REDEEMABLE_WALLET_CAP: string
    REACT_APP_STATIC_RESERVE_PRICE_OF_REDEEMABLE: string
    REACT_APP_SALE_TIMEOUT_IN_BLOCKS: string
    REACT_APP_REDEEMABLE_INITIAL_SUPPLY: string
    REACT_APP_REDEEMABLE_NAME: string
    REACT_APP_REDEEMABLE_SYMBOL: string
  }
}

/**
 * App
 */
function App() {
  const [deploying, setDeploying] = useState(false);
  const [signer, setSigner] = useState<Signer|undefined>(undefined);
  const [address, setAddress] = useState("");
  const [reserveTokenAddress, setReserveTokenAddress] = useState(process.env.REACT_APP_RESERVE_TOKEN_ADDRESS);
  const [reserveDecimals, setReserveDecimals] = useState(process.env.REACT_APP_RESERVE_ERC20_DECIMALS);
  const [redeemableDecimals, setRedeemableDecimals ] = useState(process.env.REACT_APP_REDEEMABLE_ERC20_DECIMALS);
  const [redeemableInitialSupply, setRedeemableInitialSupply] = useState(process.env.REACT_APP_REDEEMABLE_INITIAL_SUPPLY);
  const [redeemableWalletCap, setRedeemableWalletCap] = useState(process.env.REACT_APP_REDEEMABLE_WALLET_CAP);
  const [staticReservePriceOfRedeemable, setStaticReservePriceOfRedeemable] = useState(process.env.REACT_APP_STATIC_RESERVE_PRICE_OF_REDEEMABLE);
  const [saleTimeoutInBlocks, setSaleTimeoutInBlocks] = useState(process.env.REACT_APP_SALE_TIMEOUT_IN_BLOCKS);
  const [redeemableName, setRedeemableName] = React.useState(process.env.REACT_APP_REDEEMABLE_NAME);
  const [redeemableSymbol, setRedeemableSymbol] = React.useState(process.env.REACT_APP_REDEEMABLE_SYMBOL);
  const [saleView, setSaleView] = React.useState(false); // show sale or admin view (if there is a sale address in the url)

  // run once on render and check url parameters
  useEffect(() => {
    let queryString = new URLSearchParams(window.location.search);
    let saleAddress = queryString.get('s');

    if (typeof saleAddress !== 'undefined' && saleAddress) {
      console.log(`saleAddress is ${saleAddress}`) // why logged twice: https://stackoverflow.com/questions/60971185/why-does-create-react-app-initialize-twice
      setSaleView(true);
    }
  },[]);

  // basic connection to web3 wallet
  useEffect(() => {
    makeWeb3Connection(); // todo test what happens if not signed in
  },[]);

  const amountOfShoes = 2;

  if (!saleView) {
  }

  const handleChangeReserveTokenAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReserveTokenAddress(event.target.value);
  };
  const handleChangeStaticReservePriceOfRedeemable = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStaticReservePriceOfRedeemable(event.target.value);
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


  async function deploySale() {
    setDeploying(true);

    const saleConfig = {
      canStartStateConfig: opcodeData.canStartStateConfig, // config for the start of the Sale (see opcodes section below)
      canEndStateConfig: opcodeData.canEndStateConfig, // config for the end of the Sale (see opcodes section below)
      calculatePriceStateConfig: opcodeData.calculatePriceStateConfig(
        ethers.utils.parseUnits(staticReservePriceOfRedeemable, parseInt(reserveDecimals)),
        ethers.utils.parseUnits(redeemableWalletCap, parseInt(redeemableDecimals)),
      ), // config for the `calculatePrice` function (see opcodes section below).
      recipient: address, // who will receive the RESERVE token (e.g. USDCC) after the Sale completes
      reserve: reserveTokenAddress, // the reserve token contract address (MUMBAI MATIC in this case)
      saleTimeout: saleTimeoutInBlocks,
      cooldownDuration: 100, // this will be 100 blocks (10 mins on MUMBAI) // this will stay as blocks in upcoming releases
      minimumRaise: ethers.utils.parseUnits(redeemableInitialSupply, reserveDecimals), // minimum to complete a Raise // TODO CHECK IF FINISHES AUTOMATICALLY WHEN HIT
      dustSize: ethers.utils.parseUnits("0", reserveDecimals), // todo check this: for bonding curve price curves (that generate a few left in the contract at the end)
    };
    const redeemableConfig = {
      // todo can erc721 be used instead?
      erc20Config: { // config for the redeemable token (rTKN) which participants will get in exchange for reserve tokens
        name: redeemableName, // the name of the rTKN
        symbol: redeemableSymbol, // the symbol for your rTKN
        distributor: "0x0000000000000000000000000000000000000000", // distributor address
        initialSupply: ethers.utils.parseUnits(redeemableInitialSupply, redeemableDecimals), // initial rTKN supply
      },
      // todo why can't I decompile? https://mumbai.polygonscan.com/address/0xC064055DFf6De32f44bB7cCB0ca59Cbd8434B2de#code
      tier: "0xC064055DFf6De32f44bB7cCB0ca59Cbd8434B2de", // tier contract address (used for gating)
      minimumTier: 0, // minimum tier a user needs to take part
      distributionEndForwardingAddress: "0x0000000000000000000000000000000000000000" // the rTKNs that are not sold get forwarded here (0x00.. will burn them)
    }

    // todo get ratios of costs
    // todo what happens if one fails (inform users)
    console.warn("Info: It is important to let your users know how many transactions to expect and what they are. " +
      "This example consists of 5 Transactions:\n\n" +
      "* Create Sale (For Admins) (fee+gas cost at circa 2022-05-30T15:32:44Z: 0.002108 MATIC)\n" + // todo check how much gas costs can fluctuate (gas cost at 2022-05-30T15:27:32Z: 0.001992 MATIC) (gas cost at 2022-05-30T15:32:44Z: 0.044359 MATIC)
      "* Start Sale (For Admins) (fee+gas cost at circa 2022-05-30T15:32:44Z: 0.000061 MATIC) \n" +
      // todo what is this contract address? and is it approved to spend this again in future or only up to this amount?
      "* Give Permission to 0x642d4e6d828436ee95658c3462b46dafc1d0a61a to access USDCC (For Users) (fee+gas at circa 2022-05-30T15:32:44Z: 0.00009 MATIC) \n" +
      "* Buying from Sale (For Users) (fee+gas cost at circa 2022-05-30T15:32:44Z: 0.000531 MATIC) \n" +
      "* End Sale (For Admins) (fee+gas at circa 2022-05-30T15:32:44Z: 0.000158 MATIC) \n"
    );
    console.log('------------------------------'); // separator

    console.log("Info: Creating Sale with the following state:", saleConfig, redeemableConfig);
    // @ts-ignore
    const saleContract = await rainSDK.Sale.deploy(signer, saleConfig, redeemableConfig);
    console.log('Result: Sale Contract:', saleContract); // the Sale contract and corresponding address
    const redeemableContract = await saleContract.getRedeemable();
    console.log('Result: Redeemable Contract:', redeemableContract); // the Sale contract and corresponding address
    console.log('------------------------------'); // separator

    // ### Interact with the newly deployed ecosystem

    console.log('Info: Starting The Sale.');
    const startStatusTransaction = await saleContract.start();
    const startStatusReceipt = await startStatusTransaction.wait();
    console.log('Info: Sale Started Receipt:', startStatusReceipt);
    console.log('------------------------------'); // separator

    // todo provide a link to the sale

    setDeploying(false);
  }


  /**
   * View
   */
  return (
    <div className="rootContainer">
      <NavBar />

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
            <Typography variant="h4" component="h3" color="black">
              (Admin Dashboard)
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

            <FormControl variant="standard">
              <InputLabel htmlFor="component-helper">The Price of a Shoe NFT</InputLabel>
              <Input
                id="component-helper"
                value={staticReservePriceOfRedeemable}
                onChange={handleChangeStaticReservePriceOfRedeemable}
                aria-describedby="component-helper-text"
              />
              <FormHelperText id="component-helper-text">
                Default: 1 of the above Tokens
              </FormHelperText>
            </FormControl>

            <Button disabled={deploying} variant="outlined" onClick={() => {deploySale()}}>Deploy Sale</Button>

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
