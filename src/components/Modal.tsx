import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Modal as ModalMaterial } from '@mui/material';
const displayedImage = 'https://assets.unegma.net/unegma.work/rain-shoe-sale.unegma.work/shoes.jpg'
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Modal({modalOpen, setModalOpen, initiateBuy, buttonLock, redeemableTokenAddress, staticReservePriceOfRedeemable, reserveSymbol, redeemableSymbol}:
  {modalOpen: boolean, setModalOpen: any, initiateBuy: any, buttonLock: boolean, redeemableTokenAddress: string, staticReservePriceOfRedeemable: any, reserveSymbol: string, redeemableSymbol: string})
{

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

          <Typography className="modalText">An {redeemableSymbol} will be exchangeable for a real life Shoe!</Typography><br/>
          <Typography className="modalText">To see the {redeemableSymbol} in your wallet, add: {redeemableTokenAddress}</Typography><br/>
          <Typography className="modalText">See console for more data.</Typography>
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
