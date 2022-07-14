import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Modal as ModalMaterial } from '@mui/material';
import {Bar} from "react-chartjs-2";
const displayedImage = 'https://assets.unegma.net/unegma.work/rain-voucher-sale.unegma.work/shoes.jpg'
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '35vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Modal({modalOpen, setModalOpen, initiateBuy, buttonLock, redeemableTokenAddress, staticReservePriceOfRedeemable, reserveSymbol, redeemableSymbol, redeemableName, consoleData, consoleColor, saleAddress, reserveTokenAddress}:
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
        text: 'Upcoming Transaction Costs (Estimated MATIC)',
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
        {/*<img className="modalImage" src={displayedImage} alt="#" /><br/>*/}
        {/*todo create graph of transaction costs*/}

        <br/>

        { !staticReservePriceOfRedeemable.includes('e') && (
          <Bar options={options} data={data} />
        )}

        <br/>

        <Typography className="modalText">
          To see <b>{redeemableSymbol}</b> in your Wallet, you may need to add its address: <b>{redeemableTokenAddress}</b>.
        </Typography><br/>

        <Typography className="modalText">
          Each <b>{redeemableSymbol}</b> is exchangeable for an imaginary physical/digital item in the <b>{redeemableName} Collection</b>! <a href={`https://rain-erc20-faucet.unegma.work/${reserveTokenAddress}`} target="_blank">Click to get <b>{reserveSymbol}</b> tokens</a> for buying <b>{redeemableSymbol}</b>.
        </Typography><br/>

        {/*todo pass the address in url when passing*/}
        <Typography className="modalText">
          <a href={`https://rain-escrow-example.unegma.work?s=${saleAddress}`} target="_blank">Click to Deploy an Escrow</a> to allow <b>{redeemableSymbol}</b> buyers to claim new Tokens<br/>
          (<b className='red'>Sale must have closed successfully</b>, <a href={`https://rain-voucher-sale.unegma.work/${saleAddress}/dashboard`} target="_blank">see Sale Dashboard</a>).
        </Typography><br/>

        { consoleColor === 'red' && (
          <Typography className="modalTextRed">{consoleData}</Typography>
        )}

        { consoleColor === 'green' && (
          <Typography className="modalTextGreen">{consoleData}</Typography>
        )}

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
