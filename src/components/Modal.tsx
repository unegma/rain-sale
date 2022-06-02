import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Modal as ModalMaterial } from '@mui/material';
import {Bar} from "react-chartjs-2";
const displayedImage = 'https://assets.unegma.net/unegma.work/rain-shoe-sale.unegma.work/shoes.jpg'
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Modal({modalOpen, setModalOpen, initiateBuy, buttonLock, redeemableTokenAddress, staticReservePriceOfRedeemable, reserveSymbol, redeemableSymbol, consoleData, consoleColor}:
  {modalOpen: boolean, setModalOpen: any, initiateBuy: any, buttonLock: boolean, redeemableTokenAddress: string, staticReservePriceOfRedeemable: any, reserveSymbol: string, redeemableSymbol: string, consoleData: string, consoleColor: string})
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
    labels: [`Tx1: Approve ${staticReservePriceOfRedeemable}${reserveSymbol}`, 'Tx2: Buy'],
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

  return (
    <div>
      <ModalMaterial
        open={modalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="div" sx={style}>
          <img className="modalImage" src={displayedImage} alt="#" /><br/>

          {/*todo create graph of transaction costs*/}

          <br/>

          { !staticReservePriceOfRedeemable.includes('e') && (
            <Bar options={options} data={data} />
          )}

          <br/>

          <Typography className="modalText">An {redeemableSymbol} will be exchangeable for a real life Shoe!</Typography><br/>

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
              <Button disabled={buttonLock} className="fifty-percent-button" variant="contained" onClick={initiateBuy}>Buy A Shoe ({staticReservePriceOfRedeemable}{reserveSymbol})</Button>
            )}
            { staticReservePriceOfRedeemable.includes('e')  && (
              <Button disabled={buttonLock} className="fifty-percent-button" variant="contained">Buy Limit Reached</Button>
            )}

          </div>

        </Box>
      </ModalMaterial>
    </div>
  );
}
