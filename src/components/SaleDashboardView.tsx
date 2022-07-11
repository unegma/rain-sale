import React, {Suspense, useEffect} from "react";
import Typography from "@mui/material/Typography";
import NavBar from "./NavBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useParams} from "react-router-dom";

type saleSettingsProps = {
  saleAddress: string, reserveName: string, reserveSymbol: string, endSale: any, startSale: any, setSaleAddress: any
}

export default function SaleDashboardView({
  saleAddress, reserveName, reserveSymbol, endSale, startSale, setSaleAddress,
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
          Settings for {reserveName} ({reserveSymbol}) Sale
        </Typography>
        <Typography color="black" align="center">
          {saleAddress}
        </Typography>

        <Button variant='contained' onClick={() => {startSale()}}>Start Sale</Button>
        <Button variant='contained' onClick={() => {endSale()}}>End Sale</Button>
        {/*<Button variant='contained'>Timeout Sale</Button>*/}

      </Box>
    </>
  )
}
