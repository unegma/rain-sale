import React, {Suspense, useEffect} from "react";
import Typography from "@mui/material/Typography";
import NavBar from "./NavBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

type saleSettingsProps = {
  saleAddress: string, reserveName: string, reserveSymbol: string
}

export default function SaleSettingsView({
  saleAddress, reserveName, reserveSymbol
  }: saleSettingsProps)
{

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

        <Button variant='contained'>Start Sale</Button>
        <Button variant='contained'>End Sale</Button>
        <Button variant='contained'>Timeout Sale</Button>

      </Box>
    </>
  )
}
