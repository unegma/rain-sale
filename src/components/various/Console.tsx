import Typography from "@mui/material/Typography";
import React from "react";
const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME; // Mumbai (Polygon Testnet) Chain ID

export default function Console({consoleColor, consoleData}: any) {
  return (
    <div className='console'>
      { consoleColor === 'red' && (
        <Typography className="modalTextRed"><b>{consoleData}</b></Typography>
      )}

      { consoleColor === 'green' && (
        <Typography className="modalTextGreen"><b>{consoleData}</b></Typography>
      )}
    </div>
  )
}
