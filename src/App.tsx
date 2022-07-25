import React, {useEffect, useState} from 'react';
import {
  Route, Routes
} from "react-router-dom";
import {Signer} from "ethers";
import {CircularProgress} from "@mui/material";
import DeployPanelView from "./components/panels/DeployPanelView";
import SaleView from "./components/panels/SaleView";
import SaleDashboardView from "./components/panels/SaleDashboardView";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {getReserveName, getSubgraphSaleData} from './helpers/subgraphCalls';
import {deploySale, startSale, endSale, initiateBuy, getPriceForUser, getReserveBalance} from './helpers/web3Functions';

/**
 * App
 */
function App() {

  /** State Config **/

  const context = useWeb3React<Web3Provider>(); // todo check because this web3provider is from ethers
  const { connector, library, chainId, account, activate, deactivate, active, error }: any = context;

  // high level
  const [signer, setSigner] = useState<Signer|undefined>(undefined);
  const [saleAddress, setSaleAddress] = React.useState(""); // this is now retrieved from the url
  const [saleComplete, setSaleComplete] = React.useState(false);
  const [consoleData, setConsoleData] = React.useState("");
  const [consoleColor, setConsoleColor] = React.useState('red');

  // page controls
  const [buttonLock, setButtonLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminConfigPage, setAdminConfigPage] = useState(0);
  const [saleView, setSaleView] = React.useState(false); // show sale or admin view (if there is a sale address in the url)
  const [modalOpen, setModalOpen] = React.useState(false);

  // all these from .env will be replaced by calls to blockchain within the getSaleData function when saleView is set to true
  const [reserveTokenAddress, setReserveTokenAddress] = useState(process.env.REACT_APP_RESERVE_TOKEN_ADDRESS as string);
  const [reserveDecimals, setReserveDecimals] = useState(process.env.REACT_APP_RESERVE_ERC20_DECIMALS as string);
  const [redeemableDecimals, setRedeemableDecimals] = useState(process.env.REACT_APP_REDEEMABLE_ERC20_DECIMALS as string);
  const [redeemableInitialSupply, setRedeemableInitialSupply] = useState(process.env.REACT_APP_REDEEMABLE_INITIAL_SUPPLY as string);
  const [redeemableWalletCap, setRedeemableWalletCap] = useState(process.env.REACT_APP_REDEEMABLE_WALLET_CAP as string);
  const [staticReservePriceOfRedeemable, setStaticReservePriceOfRedeemable] = useState(process.env.REACT_APP_STATIC_RESERVE_PRICE_OF_REDEEMABLE as string); // this will be either a. the price from .env or the price for the user after getSaleData() is called, and if the user has more than the wallet cap, the price will be so big they can't afford it
  const [redeemableName, setRedeemableName] = React.useState(process.env.REACT_APP_REDEEMABLE_NAME as string);
  const [redeemableSymbol, setRedeemableSymbol] = React.useState(process.env.REACT_APP_REDEEMABLE_SYMBOL as string);
  const [tierGatingAddress, setTierGatingAddress] = React.useState(process.env.REACT_APP_TIER_GATING_ADDRESS as string);
  const [minimumTier, setMinimumTier] = React.useState(process.env.REACT_APP_MINIMUM_TIER as string);

  // date stuff
  let dateToUse = new Date().getTime() + 86400000; // this adds 24 hours, but beware, it doesn't take daylight saving into consideration https://stackoverflow.com/questions/563406/how-to-add-days-to-date
  const [saleTimeout, setSaleTimeout] = useState(dateToUse);

  // a bit isolated because not taken from .env and only used in the Sale (and got from getSaleData())
  const [reserveTokenBalance, setReserveTokenBalance] = React.useState("");
  const [redeemableTokenAddress, setRedeemableTokenAddress] = React.useState("");
  const [reserveSymbol, setReserveSymbol] = React.useState("");
  const [rTKNAvailable, setRTKNAvailable] = React.useState(0);

  // these must be the same as the above in .env
  function resetToDefault() {
    setReserveTokenAddress(process.env.REACT_APP_RESERVE_TOKEN_ADDRESS as string);
    setReserveDecimals(process.env.REACT_APP_RESERVE_ERC20_DECIMALS as string);
    setRedeemableDecimals(process.env.REACT_APP_REDEEMABLE_ERC20_DECIMALS as string);
    setRedeemableInitialSupply(process.env.REACT_APP_REDEEMABLE_INITIAL_SUPPLY as string);
    setRedeemableWalletCap(process.env.REACT_APP_REDEEMABLE_WALLET_CAP as string);
    setStaticReservePriceOfRedeemable(process.env.REACT_APP_STATIC_RESERVE_PRICE_OF_REDEEMABLE as string);
    setSaleTimeout(dateToUse);
    setRedeemableName(process.env.REACT_APP_REDEEMABLE_NAME as string);
    setRedeemableSymbol(process.env.REACT_APP_REDEEMABLE_SYMBOL as string);
    setTierGatingAddress(process.env.REACT_APP_TIER_GATING_ADDRESS as string);
    setMinimumTier(process.env.REACT_APP_MINIMUM_TIER as string);
  }

  /** UseEffects **/

  // run once on render and check url parameters
  useEffect(() => {
    let queryString = new URLSearchParams(window.location.search);
    // let sParam = queryString.get('s');
    let tParam = queryString.get('t');

    if (typeof tParam !== 'undefined' && tParam) {
      console.log(`tokenAddress is ${tParam}`) // why logged twice: https://stackoverflow.com/questions/60971185/why-does-create-react-app-initialize-twice
      setReserveTokenAddress(tParam); // todo check for xss // this is used for creating links with the Reserve token pre-filled
    }
  },[]);

  useEffect(() => {
    setSigner(library?.getSigner());
  }, [library, account]);

  // this relies on useEffect above to get saleAddress from url // todo may be able to merge this one with the above one, as long as shoes are hidden until saleContract is got
  // todo check this section because it is different in all frontends
  useEffect(() => {
    if (saleAddress) {
      getSubgraphSaleData(
        setReserveTokenAddress,setReserveSymbol,setRedeemableTokenAddress,
        setRedeemableName,setRedeemableSymbol,setRedeemableDecimals,setRedeemableInitialSupply,redeemableDecimals,
        setStaticReservePriceOfRedeemable,setSaleView,saleAddress,setRTKNAvailable
      );
      // NEED TO UPDATE PRICE FOR USER HERE
    }
  }, [saleAddress, saleComplete]); // only get sale data when signer and saleAddress have been loaded // monitor saleComplete so that the amount displayed on the button is updated when the sale is finished

  useEffect(() => {
    if (signer && saleView) {
      // todo find a different way to disable button if exceeds balance
      getPriceForUser(signer, saleAddress, setStaticReservePriceOfRedeemable, redeemableDecimals); // get price when signer is set
    }
  }, [signer, library, account, saleAddress, saleView, saleComplete]); // re-fetch when sale is complete (so changes to prevent user buying more) // todo some of these may not now be needed

  // used by frontend input
  useEffect(() => {
    getReserveName(reserveTokenAddress, setReserveSymbol);
  },[reserveTokenAddress]);

  // user balance of reserveToken
  useEffect(() => {
    if (signer && saleView) {
      getReserveBalance(signer,account,reserveTokenAddress,setReserveTokenBalance);
    }
  }, [signer, account, reserveTokenAddress, saleComplete])

  /** Handle Form Inputs **/

  const handleChangeReserveTokenAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReserveTokenAddress(event.target.value);
  };
  const handleChangeStaticReservePriceOfRedeemable = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStaticReservePriceOfRedeemable(event.target.value);
  };
  const handleChangeSaleTimeout = (value: number) => {
    setSaleTimeout(value);
  };
  const handleChangeRedeemableName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRedeemableName(event.target.value);
  };
  const handleChangeRedeemableSymbol = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newRedeemableSymbol = event.target.value;
    // if (newRedeemableSymbol.length <= 0) { alert("Must be > 0."); return;}
    if (newRedeemableSymbol.length > 11) { alert("Symbol must be 11 characters or less."); return;}
    setRedeemableSymbol(newRedeemableSymbol);
  };
  const handleChangeRedeemableInitialSupply = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newInitialSupply = event.target.value;
    if (parseInt(newInitialSupply) <= 0) { alert("Must be > 0."); return;}
    if (parseInt(newInitialSupply) > 100) { alert("Can't have more than 100 in this example."); return;}
    // if (newInitialSupply == "") { alert("Must be > 0."); return;}
    setRedeemableInitialSupply(newInitialSupply);
  };
  const handleChangeTierGatingAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTierGatingAddress(event.target.value);
  };
  const handleChangeMinimumTier = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinimumTier(event.target.value);
  };

  /** View **/

  return (
    <div className="rootContainer">

      { loading && (
        <div className="deploying"><CircularProgress /></div>
      )}

      <Routes>
        <Route
          key={'home'}
          path="/"
          element={
            <DeployPanelView
              adminConfigPage={adminConfigPage} reserveTokenAddress={reserveTokenAddress} reserveSymbol={reserveSymbol}
              handleChangeReserveTokenAddress={handleChangeReserveTokenAddress}
              staticReservePriceOfRedeemable={staticReservePriceOfRedeemable}
              handleChangeStaticReservePriceOfRedeemable={handleChangeStaticReservePriceOfRedeemable}
              saleTimeout={saleTimeout} handleChangeSaleTimeout={handleChangeSaleTimeout}
              resetToDefault={resetToDefault} setAdminConfigPage={setAdminConfigPage} redeemableName={redeemableName}
              handleChangeRedeemableName={handleChangeRedeemableName} redeemableSymbol={redeemableSymbol}
              handleChangeRedeemableSymbol={handleChangeRedeemableSymbol} redeemableInitialSupply={redeemableInitialSupply}
              handleChangeRedeemableInitialSupply={handleChangeRedeemableInitialSupply} buttonLock={buttonLock}
               minimumTier={minimumTier} handleChangeMinimumTier={handleChangeMinimumTier}
              tierGatingAddress={tierGatingAddress} handleChangeTierGatingAddress={handleChangeTierGatingAddress}
              deploySale={() => deploySale(
                signer, account, setButtonLock,setLoading,saleTimeout,
                staticReservePriceOfRedeemable,redeemableWalletCap,redeemableDecimals,reserveTokenAddress,
                redeemableName,redeemableSymbol,redeemableInitialSupply, tierGatingAddress, minimumTier, reserveDecimals
              )}
            />
          }
        />

        <Route
          key={'sale'}
          path="/:id"
          element={
            <SaleView
              redeemableName={redeemableName} redeemableSymbol={redeemableSymbol} modalOpen={modalOpen}
              setModalOpen={setModalOpen} buttonLock={buttonLock}
              redeemableTokenAddress={redeemableTokenAddress} staticReservePriceOfRedeemable={staticReservePriceOfRedeemable}
              reserveSymbol={reserveSymbol} consoleData={consoleData} consoleColor={consoleColor}
              saleAddress={saleAddress} rTKNAvailable={rTKNAvailable} saleView={saleView}
              setSaleAddress={setSaleAddress} reserveTokenAddress={reserveTokenAddress}
              reserveTokenBalance={reserveTokenBalance}
              initiateBuy={() => initiateBuy(
                signer, account, setButtonLock, setLoading, saleAddress, setConsoleData,
                setConsoleColor, setSaleComplete,staticReservePriceOfRedeemable,reserveSymbol,reserveTokenAddress,
                reserveDecimals,redeemableDecimals,redeemableSymbol
              )}
            />
          }
        />

        <Route
          key={'sale-dashboard'}
          path="/:id/dashboard"
          element={
            <SaleDashboardView
              saleAddress={saleAddress}
              redeemableName={redeemableName}
              redeemableSymbol={redeemableSymbol}
              setSaleAddress={setSaleAddress}
              consoleData={consoleData}
              consoleColor={consoleColor}
              endSale={() => endSale(
                signer,account,setButtonLock,setLoading,saleAddress,setConsoleData,setConsoleColor,setSaleComplete
              )}
              startSale={() => startSale(
                signer,account,setButtonLock,setLoading,saleAddress,setConsoleData,setConsoleColor,setSaleComplete
              )}
            />
          }
        />

        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p className='black'>There's nothing here!</p>
            </main>
          }
        />
      </Routes>

    </div>
  );
}

export default App;
