import React, {Suspense, useEffect} from "react";
import Typography from "@mui/material/Typography";
import NavBar from "./NavBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useParams} from "react-router-dom";

type saleSettingsProps = {
  saleAddress: string, redeemableName: string, redeemableSymbol: string, endSale: any, startSale: any, setSaleAddress: any,
  consoleColor: string, consoleData: string
}

export default function SaleDashboardView({
  saleAddress, redeemableName, redeemableSymbol, endSale, startSale, setSaleAddress, consoleColor, consoleData
  }: saleSettingsProps)
{

  let {id}: any = useParams();
  // set token address by url instead of t= (check line 80 onwards works in app.tsx for getting the tokenData)
  useEffect(() => {
    setSaleAddress(id);
  }, []);

  return (
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

        <Typography variant="h4" component="h2" color="black" align="center">
          Sale Settings
        </Typography>
        <Typography color="black" align="center">
          Settings for {redeemableName} Collection ({redeemableSymbol}) Sale
        </Typography>
        <Typography color="black" align="center">
          {saleAddress}
        </Typography>
        <Typography color="black" align="center">
          <sub>Be aware that, these functions can be called by ANYONE, so the deployer of a Sale, must understand how to configure when these can be called in order for a Sale to work as intended. (link to video about timeout() vs canEndStateConfig()</sub>
        </Typography>

        <div className='console'>
          { consoleColor === 'red' && (
            <Typography className="modalTextRed">{consoleData}</Typography>
          )}

          { consoleColor === 'green' && (
            <Typography className="modalTextGreen">{consoleData}</Typography>
          )}
        </div>

        <Button variant='contained' onClick={() => {startSale()}}>Start Sale</Button>
        <Button variant='contained' onClick={() => {endSale()}}>End Sale</Button>
        {/*<Button variant='contained'>Timeout Sale</Button>*/}

      </Box>
    </>
  )
}
