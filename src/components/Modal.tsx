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

export default function Modal({modalOpen, setModalOpen, initiateBuy, buttonLock, reserveTokenAddress}:
  {modalOpen: boolean, setModalOpen: any, initiateBuy: any, buttonLock: boolean, reserveTokenAddress: string})
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
          <Typography className="modalText">Demo, see console for more data.</Typography>
          <br/>
          <Typography className="modalText">To see the shoe in your wallet, add {reserveTokenAddress}</Typography>
          <br/>
          <Typography color="red" className="modalText">Please note, this will fail if you already have more than the WALLET_CAP</Typography>

          <br/>

          <div className="buttons-box">
            <Button disabled={buttonLock} className="fifty-percent-button" variant="outlined" onClick={() => {setModalOpen(false)}}>Close</Button>
            <Button disabled={buttonLock} className="fifty-percent-button" variant="contained" onClick={initiateBuy}>Buy a Shoe!</Button><br/>
          </div>

        </Box>
      </ModalMaterial>
    </div>
  );
}
