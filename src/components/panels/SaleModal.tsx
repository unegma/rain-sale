import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Modal as ModalMaterial } from '@mui/material';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Warning from "../various/Warning";
import Console from "../various/Console";
import {TransactionsChartBuy} from "../various/TransactionsChartBuy";
const FAUCET_BASE_URL = process.env.REACT_APP_FAUCET_BASE_URL;

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function SaleModal(
  {modalOpen, setModalOpen, initiateBuy, buttonLock, redeemableTokenAddress, staticReservePriceOfRedeemable, reserveSymbol, redeemableSymbol, redeemableName, consoleData, consoleColor, saleAddress, reserveTokenAddress, reserveTokenBalance, saleStatus}:
  {modalOpen: boolean, setModalOpen: any, initiateBuy: any, buttonLock: boolean, redeemableTokenAddress: string, staticReservePriceOfRedeemable: any, reserveSymbol: string, redeemableSymbol: string, redeemableName: string, consoleData: string, consoleColor: string, saleAddress: string, reserveTokenAddress: string, reserveTokenBalance: string, saleStatus: number}
) {

  function handleClose() {
    setModalOpen(false)
  }

  return (
    <ModalMaterial
      open={modalOpen}
      onClose={handleClose}
      className="the-modal"
    >
      <Box component="div" sx={style}>
        <HighlightOffIcon className="closeModalButton" onClick={() => { setModalOpen(false)}}/>
        <br/>

        {/*todo might be issues with this now, as price is passed from .env (after moving to subgraph call). Might need to re-call in a different function with signer*/}
        { !staticReservePriceOfRedeemable.includes('e') && (
          <TransactionsChartBuy reserveSymbol={reserveSymbol} staticReservePriceOfRedeemable={staticReservePriceOfRedeemable} />
        )}

        <br/>

        <Typography className="modalText">
          <a href="#" onClick={(event: any) =>
            {event.preventDefault();alert(`Copy: ${redeemableTokenAddress} to clipboard and import token in to your Wallet.`)}}
          >
            Add the address for <b>{redeemableSymbol}</b>
          </a> to see them in your wallet.
        </Typography><br/>

        {/*Each <b>{redeemableSymbol}</b> is exchangeable for an imaginary physical/digital item in the <b>{redeemableName} Collection</b>!*/}

        <Typography className="modalText">
          {/*<a href={`${FAUCET_BASE_URL}/${reserveTokenAddress}`} target="_blank">Click here to get <b>{reserveSymbol}</b> tokens</a> for buying <b>{redeemableSymbol}</b>.*/}
          <span className='yourBalance'>Your Balance: {reserveTokenBalance}{reserveSymbol}</span>; <a href={`${FAUCET_BASE_URL}/${reserveTokenAddress}`} target="_blank">Click to claim <b>{reserveSymbol}</b></a> for buying <b>{redeemableSymbol}</b>.
        </Typography><br/>

        <Warning /><br/>
        <Console consoleData={consoleData} consoleColor={consoleColor} />

        <br/>

        <div className="buttons-box">
          <Button disabled={buttonLock} className="fifty-percent-button" variant="outlined" onClick={() => {setModalOpen(false)}}>Close</Button>

          { saleStatus == 1 && (
            <>
              { !staticReservePriceOfRedeemable.includes('e') && (
                <Button disabled={buttonLock} className="fifty-percent-button" variant="contained" onClick={initiateBuy}>Buy {redeemableSymbol} ({staticReservePriceOfRedeemable}{reserveSymbol})</Button>
              )}
              { staticReservePriceOfRedeemable.includes('e')  && (
                <Button disabled={buttonLock} className="fifty-percent-button" variant="contained">Buy Limit Reached</Button>
              )}
            </>
          )}
        </div>

      </Box>
    </ModalMaterial>
  );
}
