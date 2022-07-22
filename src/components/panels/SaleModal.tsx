import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Modal as ModalMaterial } from '@mui/material';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {Bar} from "react-chartjs-2";
import Warning from "../various/Warning";
import Console from "../various/Console";
const ESCROW_BASE_URL = process.env.REACT_APP_ESCROW_BASE_URL;
const FAUCET_BASE_URL = process.env.REACT_APP_FAUCET_BASE_URL;

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '42vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function SaleModal({modalOpen, setModalOpen, initiateBuy, buttonLock, redeemableTokenAddress, staticReservePriceOfRedeemable, reserveSymbol, redeemableSymbol, redeemableName, consoleData, consoleColor, saleAddress, reserveTokenAddress}:
  {modalOpen: boolean, setModalOpen: any, initiateBuy: any, buttonLock: boolean, redeemableTokenAddress: string, staticReservePriceOfRedeemable: any, reserveSymbol: string, redeemableSymbol: string, redeemableName: string, consoleData: string, consoleColor: string, saleAddress: string, reserveTokenAddress: string})
{


  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Upcoming Transaction Cost Ratios (Estimated MATIC Ratios based on costs at: 2022-05-30T15:32:44Z)',
      },
    },
  };


  const data = {
    labels: [`Tx1: Approve ${staticReservePriceOfRedeemable}${reserveSymbol} spend`, 'Tx2: Buy'],
    datasets: [
      {
        label: '',
        data: [1],
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
      {
        label: '',
        data: [0.00927434, 0.00985916], // todo base it on dynamic matic costs
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '',
        data: [1],
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }
    ],
  };

  function handleClose() {
    setModalOpen(false)
  }

  return (
    <ModalMaterial
      open={modalOpen}
      onClose={handleClose}
    >
      <Box component="div" sx={style}>
        <HighlightOffIcon className="closeModalButton" onClick={() => { setModalOpen(false)}}/>
        <br/>

        {/*todo might be issues with this now, as price is passed from .env (after moving to subgraph call). Might need to re-call in a different function with signer*/}
        { !staticReservePriceOfRedeemable.includes('e') && (
          <Bar options={options} data={data} />
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
          <a href={`${FAUCET_BASE_URL}/${reserveTokenAddress}`} target="_blank">Click here to get <b>{reserveSymbol}</b> tokens</a> for buying <b>{redeemableSymbol}</b>.
        </Typography><br/>

        {/*todo pass the address in url when passing*/}
        <Typography className="modalText">
          <a href={`${ESCROW_BASE_URL}?s=${saleAddress}`} target="_blank">Click to Deploy an Escrow</a> to allow <b>{redeemableSymbol}</b> buyers to claim new Tokens.<br/>
        </Typography><br/>

        <Warning /><br/>
        <Console consoleData={consoleData} consoleColor={consoleColor} />

        <br/>

        <div className="buttons-box">
          <Button disabled={buttonLock} className="fifty-percent-button" variant="outlined" onClick={() => {setModalOpen(false)}}>Close</Button>

          { !staticReservePriceOfRedeemable.includes('e') && (
            <Button disabled={buttonLock} className="fifty-percent-button" variant="contained" onClick={initiateBuy}>Buy {redeemableSymbol} ({staticReservePriceOfRedeemable}{reserveSymbol})</Button>
          )}
          { staticReservePriceOfRedeemable.includes('e')  && (
            <Button disabled={buttonLock} className="fifty-percent-button" variant="contained">Buy Limit Reached</Button>
          )}

        </div>

      </Box>
    </ModalMaterial>
  );
}
