import Typography from "@mui/material/Typography";
import React from "react";
const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME; // Mumbai (Polygon Testnet) Chain ID

export default function Warning() {
  return (
    <Typography color="red">
      Must be connected to <a href={`https://www.youtube.com/watch?v=I4C5RkiNAYQ`} target="_blank"><b className=''>{CHAIN_NAME}</b>&nbsp;Network</a>&nbsp;
      (toggle 'Testnets' on <a href={`https://chainlist.org/?search=mumbai&testnets=true`} target="_blank">chainlist.org</a> for details).&nbsp;
      <span className="red"><b>Warning: Proceeding may result in the loss of transaction fees.</b></span>
    </Typography>
  )
}
