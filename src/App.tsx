import React, {Suspense, useEffect, useState} from 'react';
import {Canvas} from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import NavBar from './components/NavBar';
import Modal from './components/Modal';
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
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

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

  /** State Config **/

  // high level
  const [signer, setSigner] = useState<Signer|undefined>(undefined);
  const [address, setAddress] = useState("");
  const [saleAddress, setSaleAddress] = React.useState("");

  // page controls
  const [deploying, setDeploying] = useState(false);
  const [adminConfigPage, setAdminConfigPage] = useState(0);
  const [saleView, setSaleView] = React.useState(false); // show sale or admin view (if there is a sale address in the url)
  const [modalOpen, setModalOpen] = React.useState(false);
  const [showShoes, setShowShoes] = React.useState(false);

  // all these from .env will be replaced by calls to blockchain within the getSaleData function when saleView is set to true
  const [reserveTokenAddress, setReserveTokenAddress] = useState(process.env.REACT_APP_RESERVE_TOKEN_ADDRESS);
  const [reserveDecimals, setReserveDecimals] = useState(process.env.REACT_APP_RESERVE_ERC20_DECIMALS);
  const [redeemableDecimals, setRedeemableDecimals] = useState(process.env.REACT_APP_REDEEMABLE_ERC20_DECIMALS);
  const [redeemableInitialSupply, setRedeemableInitialSupply] = useState(process.env.REACT_APP_REDEEMABLE_INITIAL_SUPPLY);
  const [redeemableWalletCap, setRedeemableWalletCap] = useState(process.env.REACT_APP_REDEEMABLE_WALLET_CAP);
  const [staticReservePriceOfRedeemable, setStaticReservePriceOfRedeemable] = useState(process.env.REACT_APP_STATIC_RESERVE_PRICE_OF_REDEEMABLE);
  const [saleTimeoutInBlocks, setSaleTimeoutInBlocks] = useState(process.env.REACT_APP_SALE_TIMEOUT_IN_BLOCKS);
  const [redeemableName, setRedeemableName] = React.useState(process.env.REACT_APP_REDEEMABLE_NAME);
  const [redeemableSymbol, setRedeemableSymbol] = React.useState(process.env.REACT_APP_REDEEMABLE_SYMBOL);

  // these must be the same as the above in .env
  function resetToDefault() {
    setReserveTokenAddress(process.env.REACT_APP_RESERVE_TOKEN_ADDRESS);
    setReserveDecimals(process.env.REACT_APP_RESERVE_ERC20_DECIMALS);
    setRedeemableDecimals(process.env.REACT_APP_REDEEMABLE_ERC20_DECIMALS);
    setRedeemableInitialSupply(process.env.REACT_APP_REDEEMABLE_INITIAL_SUPPLY);
    setRedeemableWalletCap(process.env.REACT_APP_REDEEMABLE_WALLET_CAP);
    setStaticReservePriceOfRedeemable(process.env.REACT_APP_STATIC_RESERVE_PRICE_OF_REDEEMABLE);
    setSaleTimeoutInBlocks(process.env.REACT_APP_SALE_TIMEOUT_IN_BLOCKS);
    setRedeemableName(process.env.REACT_APP_REDEEMABLE_NAME);
    setRedeemableSymbol(process.env.REACT_APP_REDEEMABLE_SYMBOL);
  }

  /** UseEffects **/

  // run once on render and check url parameters
  useEffect(() => {
    let queryString = new URLSearchParams(window.location.search);
    let sParam = queryString.get('s');

    if (typeof sParam !== 'undefined' && sParam) {
      console.log(`saleAddress is ${sParam}`) // why logged twice: https://stackoverflow.com/questions/60971185/why-does-create-react-app-initialize-twice
      setSaleView(true);
      setSaleAddress(sParam);
    }
  },[]);

  // basic connection to web3 wallet
  useEffect(() => {
    makeWeb3Connection(); // todo test what happens if not signed in
  },[]);

  // this relies on useEffect above to get saleAddress from url // todo may be able to merge this one with the above one, as long as shoes are hidden until saleContract is got
  useEffect(() => {
    if (saleAddress && signer) {
      // todo get saleContract and then get amount of shoes, and then load shoes
      console.log('HERE');
      getSaleData();
    }
  }, [saleAddress, signer]); // only get sale data when signer and saleAddress have been loaded

  /** Handle Form Inputs **/

  const handleChangeReserveTokenAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReserveTokenAddress(event.target.value);
  };
  const handleChangeStaticReservePriceOfRedeemable = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStaticReservePriceOfRedeemable(event.target.value);
  };
  const handleChangeSaleTimeout = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaleTimeoutInBlocks(event.target.value);
  };
  const handleChangeRedeemableName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRedeemableName(event.target.value);
  };
  const handleChangeRedeemableSymbol = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRedeemableSymbol(event.target.value);
  };
  const handleChangeRedeemableInitialSupply = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRedeemableInitialSupply(event.target.value);
  };

  /** Functions **/

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
   * Get Sale Data from blockchain instead of .env
   * THIS WILL ALL BE AS IF THERE IS NO .ENV ON SALE LOAD
   * todo might want to abstract this function and the whole Sale into a different component
   */
  async function getSaleData() {
    try {
      // @ts-ignore
      const saleContract = new rainSDK.Sale(saleAddress, signer);
      console.log(saleContract);
      const redeemable = await saleContract.getRedeemable(signer);
      console.log(redeemable);
      const reserve = await saleContract.getReserve(signer);
      console.log(reserve);

      setReserveTokenAddress(reserve.address);
      console.log(reserve.address);

      // setRedeemableDecimals(process.env.REACT_APP_REDEEMABLE_ERC20_DECIMALS);
      // setRedeemableInitialSupply(process.env.REACT_APP_REDEEMABLE_INITIAL_SUPPLY);
      // setRedeemableWalletCap(process.env.REACT_APP_REDEEMABLE_WALLET_CAP);
      // setStaticReservePriceOfRedeemable(process.env.REACT_APP_STATIC_RESERVE_PRICE_OF_REDEEMABLE);
      // setSaleTimeoutInBlocks(process.env.REACT_APP_SALE_TIMEOUT_IN_BLOCKS);
      // setRedeemableName(process.env.REACT_APP_REDEEMABLE_NAME);
      // setRedeemableSymbol(process.env.REACT_APP_REDEEMABLE_SYMBOL);


      const amountOfShoesBN = await redeemable.totalSupply();
      const amountOfShoesDecimals = await redeemable.decimals();
      const amountOfShoes = parseInt(amountOfShoesBN.toString()) / 10 ** amountOfShoesDecimals;
      console.log(`Shoes in Sale: ${amountOfShoes}`); // todo check if this changes when they are bought

      setRedeemableInitialSupply(amountOfShoes.toString()); // TODO THIS SHOULD BE REMAINING SHOES NOT TOTAL SUPPLY
      setRedeemableName(await redeemable.name());
      setRedeemableSymbol(await redeemable.symbol())

      // @ts-ignore
      setShowShoes(true);
    } catch(err) {
      console.log('Error getting sale data', err);
    }
  }

  /**
   * Called within the modal for making a buy
   */
  async function initiateBuy() {
    // todo might want to tell user to look at console
    try {
      const DESIRED_UNITS_OF_REDEEMABLE = ethers.utils.parseUnits("1", redeemableDecimals); // TODO DOES DECIMALS NEED CONVERTING TO INT? // could do this dynamically, but letting users buy one at a time here, with a limit of 1

      // connect to the reserve token and approve the spend limit for the buy, to be able to perform the "buy" transaction.
      console.log(`Info: Connecting to Reserve token for approval of spend:`, reserveTokenAddress); // this will have been gotten dynamically in getSaleData()
      // @ts-ignore
      const reserveContract = new rainSDK.ERC20(reserveTokenAddress, signer);
      // @ts-ignore
      const saleContract = new rainSDK.Sale(saleAddress, signer);
      const approveTransaction = await reserveContract.approve(saleContract.address, DESIRED_UNITS_OF_REDEEMABLE);
      const approveReceipt = await approveTransaction.wait();
      console.log(`Info: Approve Receipt:`, approveReceipt);
      console.log('------------------------------'); // separator

      let priceOfRedeemableInUnitsOfReserve = await saleContract.calculatePrice(DESIRED_UNITS_OF_REDEEMABLE); // THIS WILL CALCULATE THE PRICE FOR **YOU** AND WILL TAKE INTO CONSIDERATION THE WALLETCAP, if the user's wallet cap is passed, the price will be so high that the user can't buy the token (you will see a really long number as the price)
      console.log(`Info: Price of tokens in the Sale: ${priceOfRedeemableInUnitsOfReserve.toNumber()/(10**parseInt(redeemableDecimals))} ${await reserveContract.symbol()} (${reserveContract.address})`); // 10 to the power of REDEEMABLE_ERC20_DECIMALS

      const buyConfig = {
        feeRecipient: address,
        fee: ethers.utils.parseUnits("0", reserveDecimals), // TODO DOES DECIMALS NEED CONVERTING TO INT? // fee to be taken by the frontend
        minimumUnits: DESIRED_UNITS_OF_REDEEMABLE, // this will cause the sale to fail if there are (DESIRED_UNITS - remainingUnits) left in the sale
        desiredUnits: DESIRED_UNITS_OF_REDEEMABLE,
        maximumPrice: ethers.constants.MaxUint256, // this is for preventing slippage (for static price curves, this isn't really needed and can be set to the same as staticPrice) // todo is this better as STATIC_RESERVE_PRICE_OF_REDEEMABLE?
      }

      console.log(`Info: Buying ${DESIRED_UNITS_OF_REDEEMABLE} ${redeemableSymbol} from Sale with parameters:`, buyConfig); // todo check this
      const buyStatusTransaction = await saleContract.buy(buyConfig);
      const buyStatusReceipt = await buyStatusTransaction.wait();
      console.log(`Info: Buy Receipt:`, buyStatusReceipt);
      console.log('------------------------------'); // separator

    } catch(err) {
      console.log(`Info: Something went wrong:`, err);
    }
  }

  /**
   * Deploy a Sale and Start it (2txs)
   */
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

    // // todo get ratios of costs
    // // todo what happens if one fails (inform users)
    // console.warn("Info: It is important to let your users know how many transactions to expect and what they are. " +
    //   "This example consists of 5 Transactions:\n\n" +
    //   "* Create Sale (For Admins) (fee+gas cost at circa 2022-05-30T15:32:44Z: 0.002108 MATIC)\n" + // todo check how much gas costs can fluctuate (gas cost at 2022-05-30T15:27:32Z: 0.001992 MATIC) (gas cost at 2022-05-30T15:32:44Z: 0.044359 MATIC)
    //   "* Start Sale (For Admins) (fee+gas cost at circa 2022-05-30T15:32:44Z: 0.000061 MATIC) \n" +
    //   // todo what is this contract address? and is it approved to spend this again in future or only up to this amount?
    //   "* Give Permission to 0x642d4e6d828436ee95658c3462b46dafc1d0a61a to access USDCC (For Users) (fee+gas at circa 2022-05-30T15:32:44Z: 0.00009 MATIC) \n" +
    //   "* Buying from Sale (For Users) (fee+gas cost at circa 2022-05-30T15:32:44Z: 0.000531 MATIC) \n" +
    //   "* End Sale (For Admins) (fee+gas at circa 2022-05-30T15:32:44Z: 0.000158 MATIC) \n"
    // );
    // console.log('------------------------------'); // separator

    try {
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

      console.log(`Redirecting to Sale: ${saleContract.address}`);
      window.location.replace(`${window.location.origin}?s=${saleContract.address}`);
    } catch (err) {
      console.log(err);
      alert('Failed Deployment, please start again or manually activate start() if the Sale deployed.');
    }
  }

  /** Various **/

  const data = {
    labels: ['Deploy Sale (~0.040 MATIC)', 'Start Sale (~0.00125 MATIC)'],
    datasets: [
      {
        label: 'Ratio of Gas+Fee',
        data: [0.040, 0.00125],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  /** View **/

  return (
    <div className="rootContainer">

      {/*if nothing is set, show admin panel*/}
      { !saleView && (
        <>
          <NavBar />

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

            { adminConfigPage === 0 && (
              <>

                <Typography variant="h4" component="h3" color="black">
                  (Page 1/3) Sale Parameters
                </Typography>

                <FormControl variant="standard">
                  <InputLabel className="input-box-label" htmlFor="component-helper">The Token that Users will use to buy Shoe NFTs</InputLabel>
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
                  <InputLabel className="input-box-label" htmlFor="component-helper">The Price of a Shoe NFT</InputLabel>
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

                {/*todo add some validation for max*/}
                <FormControl variant="standard">
                  <InputLabel className="input-box-label" htmlFor="component-helper">Sale Timeout (blocks)</InputLabel>
                  <Input
                    id="component-helper"
                    value={saleTimeoutInBlocks}
                    onChange={handleChangeSaleTimeout}
                    aria-describedby="component-helper-text"
                  />
                  <FormHelperText id="component-helper-text">
                    On Matic Mumbai, 100 blocks is about 10 mins
                  </FormHelperText>
                </FormControl>

                <div className="buttons-box">
                  <Button className="fifty-percent-button" variant="outlined" onClick={() => {resetToDefault()}}>Reset</Button>
                  <Button className="fifty-percent-button" variant="contained" onClick={() => {setAdminConfigPage(adminConfigPage+1)}}>Next</Button>
                </div>
              </>
            )}

            { adminConfigPage === 1 && (
              <>
                <Typography variant="h4" component="h3" color="black">
                  (Page 2/3) NFT Parameters
                </Typography>

                <FormControl variant="standard">
                  <InputLabel className="input-box-label" htmlFor="component-helper">Shoe Collection Name</InputLabel>
                  <Input
                    id="component-helper"
                    value={redeemableName}
                    onChange={handleChangeRedeemableName}
                    aria-describedby="component-helper-text"
                  />
                  <FormHelperText id="component-helper-text">
                    Name for your Shoe Collection
                  </FormHelperText>
                </FormControl>


                <FormControl disabled variant="standard">
                  <InputLabel className="input-box-label" htmlFor="component-helper">Shoe NFT Symbol</InputLabel>
                  <Input
                    id="component-helper"
                    value={redeemableSymbol}
                    onChange={handleChangeRedeemableSymbol}
                    aria-describedby="component-helper-text"
                  />
                  <FormHelperText id="component-helper-text">
                    Symbol for Shoe NFT Token
                  </FormHelperText>
                </FormControl>

                <FormControl variant="standard">
                  <InputLabel className="input-box-label" htmlFor="component-helper">Amount of Shoes for Sale</InputLabel>
                  <Input
                    id="component-helper"
                    value={redeemableInitialSupply}
                    onChange={handleChangeRedeemableInitialSupply}
                    aria-describedby="component-helper-text"
                  />
                  <FormHelperText id="component-helper-text">
                    Users can currently only buy 1, but this can be altered in config
                  </FormHelperText>
                </FormControl>

                <div className="buttons-box">
                  <Button className="fifty-percent-button" disabled={deploying} variant="outlined" onClick={() => {setAdminConfigPage(adminConfigPage-1)}}>Previous</Button>
                  <Button className="fifty-percent-button" variant="contained" onClick={() => {setAdminConfigPage(adminConfigPage+1)}}>Next</Button>
                </div>
              </>
            )}

            { adminConfigPage === 2 && (
              <>
                <Typography variant="h4" component="h3" color="black">
                  (Page 3/3) Deployment Cost Ratios
                </Typography>
                <Typography color="black">
                  Ratios and costs based on tests taken around the following time: 2022-05-30T15:32:44Z
                </Typography>

                <Pie className="costs-pie" data={data} />

                <Typography color="black">
                  Please be aware, this example does not have strict checking, and so you will not recover the cost of network fees (gas) if a deployment fails. If Step 2 (start Sale) fails, you can call this manually on the contract instead of re-deploying the Sale.
                </Typography>

                <Typography color="red">
                  Please make sure you are connected to Mumbai Matic testnet.
                </Typography>

                <div className="buttons-box">
                  <Button className="fifty-percent-button" disabled={deploying} variant="outlined" onClick={() => {setAdminConfigPage(adminConfigPage-1)}}>Previous</Button>
                  <Button className="fifty-percent-button" disabled={deploying} variant="contained" onClick={() => {deploySale()}}>Deploy</Button>
                </div>
              </>
            )}

            {/*<FormControl disabled variant="standard">*/}
            {/*  <InputLabel className="input-box-label" htmlFor="component-disabled">Name</InputLabel>*/}
            {/*  <Input id="component-disabled" value={name} onChange={handleChange} />*/}
            {/*  <FormHelperText>Disabled</FormHelperText>*/}
            {/*</FormControl>*/}

            {/*<FormControl error variant="standard">*/}
            {/*  <InputLabel className="input-box-label" htmlFor="component-error">Name</InputLabel>*/}
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

      {/* redeemableInitialSupply will be fetched from Sale->Redeemable in the instance that s=address is set */}
      { saleView && showShoes && (
        <>
          <NavBar string={`${redeemableName} (${redeemableSymbol}) Sale!`} />
          <div className="canvasContainer">
            <Modal
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              initiateBuy={initiateBuy}
            />

            <Canvas camera={{ position: [0, 0, 20], fov: 50 }} performance={{ min: 0.1 }}>
              <ambientLight intensity={0.5} />
              <directionalLight intensity={0.3} position={[5, 25, 20]} />
              <Suspense fallback={null}>
                <Shoes modalOpen={modalOpen} setModalOpen={setModalOpen} amount={redeemableInitialSupply} />
                <Environment preset="city" />
              </Suspense>
              <OrbitControls autoRotate autoRotateSpeed={1} />

              {/*<color attach="background" args={['#191920']}/>*/}
              {/*<fog attach="fog" args={['#191920', 0, 15]}/>*/}
              {/*<Environment preset="city"/>*/}

            </Canvas>
          </div>
        </>
      )}

    </div>
  );
}

export default App;
