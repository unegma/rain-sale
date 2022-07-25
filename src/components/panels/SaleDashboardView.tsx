import React, {useEffect} from "react";
import Typography from "@mui/material/Typography";
import NavBar from "../layout/NavBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useParams} from "react-router-dom";
import Console from "../various/Console";
const ESCROW_BASE_URL = process.env.REACT_APP_ESCROW_BASE_URL;

type saleSettingsProps = {
  saleAddress: string, redeemableName: string, redeemableSymbol: string, endSale: any, startSale: any, setSaleAddress: any,
  consoleColor: string, consoleData: string, saleStatus: number
}

export default function SaleDashboardView({
  saleAddress, redeemableName, redeemableSymbol, endSale, startSale, setSaleAddress, consoleColor, consoleData, saleStatus
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
          Sale Dashboard
        </Typography>
        <Typography color="black" align="center">
          Dashboard for <b>{redeemableName}</b> Collection (<b>{redeemableSymbol}</b>) Sale:<br/>
          <b>{saleAddress}</b>
        </Typography>

        { saleStatus === 1 && (
          <Typography color="black" align="center">
            <sub>Be aware that, these functions can be called by ANYONE, so the deployer of a Sale, must understand how to configure when these can be called in order for a Sale to work as intended.</sub>
          </Typography>
        )}

        {/* todo (link to video about timeout() vs canEndStateConfig()*/}

        <Typography color="black" align="center">
          { saleStatus === 0 && (
            <span className={``}>{redeemableSymbol} Sale pending!</span>
          )}
          { saleStatus === 1 && (
            <span className={`green`}>{redeemableSymbol} Sale Active! (To create an <a href={`${ESCROW_BASE_URL}`} target="_blank">Escrow</a>, Sale must end successfully).</span>
          )}
          { saleStatus === 2 && (
            <span className={`green`}><a href={`${ESCROW_BASE_URL}?s=${saleAddress}`} target="_blank">Sale Ended Successfully: Click to Deploy an Escrow</a> to allow <b>{redeemableSymbol}</b> buyers to claim new Tokens.</span>
          )}
          { saleStatus === 3 && (
            <span className={``}>Sale Failed! (You cannot create an <a href={`${ESCROW_BASE_URL}`} target="_blank">Escrow</a> for a failed Sale).</span>
          )}
        </Typography>

        {/*<Typography color="black" align="center">*/}
        {/*  <b>Sale End Countdown: ?:?:?</b>*/}
        {/*</Typography>*/}

        <Console consoleData={consoleData} consoleColor={consoleColor} />

        { saleStatus === 1 && (
          <>
            <Button variant='contained' onClick={() => {startSale()}}>Start Sale</Button>
            <Button variant='contained' onClick={() => {endSale()}}>End Sale</Button>
            {/*<Button variant='contained'>Timeout Sale</Button>*/}
          </>
        )}

      </Box>
    </>
  )
}
