import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import NavBar from "../layout/NavBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useParams} from "react-router-dom";
import Console from "../various/Console";
import {formatDateTime} from '../../helpers/various';
const ESCROW_BASE_URL = process.env.REACT_APP_ESCROW_BASE_URL;
const BASE_URL = process.env.REACT_APP_BASE_URL;

type saleSettingsProps = {
  saleAddress: string, redeemableName: string, redeemableSymbol: string, endSale: any, startSale: any, setSaleAddress: any,
  consoleColor: string, consoleData: string, saleStatus: number, endTimeStamp: number
}

export default function SaleDashboardView({
  saleAddress, redeemableName, redeemableSymbol, endSale, startSale, setSaleAddress, consoleColor, consoleData, saleStatus, endTimeStamp
  }: saleSettingsProps)
{

  let [formattedTime, setFormattedTime] = useState("");
  let [endIsInThePast, setEndIsInThePast] = useState(false);
  let {id}: any = useParams();
  // set token address by url instead of t= (check line 80 onwards works in app.tsx for getting the tokenData)
  useEffect(() => {
    setSaleAddress(id);
  }, []);

  useEffect(() => {
    if (endTimeStamp !== 0) {
      console.log(`Formatting timestamp: ${endTimeStamp}`)
      let _formattedTime = formatDateTime(endTimeStamp) as string;
      console.log(_formattedTime);
      let now = Date.now(); // in a single page app, can this be manipulated by the user? don't use this as a security, the blockchain functions do that, this just hides buttons if needed
      let _endIsInThePast = now >= endTimeStamp;
      setEndIsInThePast(_endIsInThePast);
      setFormattedTime(_formattedTime);
    }
  }, [endTimeStamp]);

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
          <a href={`${BASE_URL}/${saleAddress}`} target="_blank"><b>{saleAddress}</b></a>
        </Typography>

        {/* todo (link to video about timeout() vs canEndStateConfig()*/}

        <Typography color="black" align="center">
          { saleStatus === 0 && (
            <>
              <span className={``}>{redeemableSymbol} Sale pending!</span>&nbsp;
              <Button variant='contained' onClick={() => {startSale()}}>Start Sale</Button>
            </>
          )}
          { saleStatus === 1 && (
            <>
              {/*todo can we have it saying Sale Over! or something, if the sale has passed end time?*/}
              {/*todo what happens if type whilst building? does it break the build?*/}
              <span className={`green`}>{redeemableSymbol} Sale Active! (To create an <a href={`${ESCROW_BASE_URL}`} target="_blank">Escrow</a>, Sale must complete successfully).</span>
            </>
          )}
          { saleStatus === 2 && (
            <span className={`green`}><a href={`${ESCROW_BASE_URL}?s=${saleAddress}`} target="_blank">Sale Ended Successfully: Click to Deploy an Escrow</a> to allow <b>{redeemableSymbol}</b> buyers to claim new Tokens.</span>
          )}
        </Typography>

        <Typography color="black" align="center">
          <b>Sale Can End After: {formattedTime}</b>
        </Typography>

        <Console consoleData={consoleData} consoleColor={consoleColor} />

        { (saleStatus === 1 && endIsInThePast === true) && (
          <>
            <Typography color="black" align="center">
              <sub>Be aware that, these functions can be called by <b className='red'>ANYONE</b>, so the deployer of a Sale, must understand how to configure when these can be called in order for a Sale to work as intended.</sub>
            </Typography><br/>
            <Button variant='contained' onClick={() => {endSale()}}>End Sale</Button>
          </>
        )}

        { saleStatus === 3 && (
          <>
            <span className={`red`}>Sale Failed! (You cannot create an <a href={`${ESCROW_BASE_URL}`} target="_blank">Escrow</a> for a failed Sale).</span>
          </>
        )}

      </Box>
    </>
  )
}
