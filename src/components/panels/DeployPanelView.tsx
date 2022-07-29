import NavBar from "../layout/NavBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, {Suspense, useState} from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Canvas} from "@react-three/fiber";
import {Environment, Html, OrbitControls} from "@react-three/drei";
import RTKN from "../3d/RTKN";
import {DateTimePicker} from "@mui/x-date-pickers";
import {Accordion, AccordionDetails, AccordionSummary, InputAdornment} from "@mui/material";
import Warning from "../various/Warning";
import {TransactionsChartDeploy} from "../various/TransactionsChartDeploy";
const FAUCET_BASE_URL = process.env.REACT_APP_FAUCET_BASE_URL;
const TIER_GATING_BASE_URL = process.env.REACT_APP_TIER_GATING_BASE_URL;
const RESERVE_TOKEN_ADDRESS = process.env.REACT_APP_RESERVE_TOKEN_ADDRESS;
const SALE_EXAMPLE = process.env.REACT_APP_SALE_EXAMPLE;
const GITHUB_LINK = process.env.REACT_APP_GITHUB_URL;

type adminPanelProps = { adminConfigPage: number, reserveTokenAddress: string, reserveSymbol: string
  handleChangeReserveTokenAddress: any, staticReservePriceOfRedeemable: any,
  handleChangeStaticReservePriceOfRedeemable: any, saleTimeout: any, handleChangeSaleTimeout: any,
  resetToDefault: any, setAdminConfigPage: any, redeemableName: any, handleChangeRedeemableName: any,
  redeemableSymbol: any, handleChangeRedeemableSymbol: any, redeemableInitialSupply: any,
  handleChangeRedeemableInitialSupply: any, buttonLock: any, deploySale: any,
  tierGatingAddress: string, handleChangeTierGatingAddress: any, minimumTier: any, handleChangeMinimumTier: any
}

// todo rename from admin panel
export default function DeployPanelView({
    adminConfigPage, reserveTokenAddress, reserveSymbol, handleChangeReserveTokenAddress, staticReservePriceOfRedeemable,
    handleChangeStaticReservePriceOfRedeemable, saleTimeout, handleChangeSaleTimeout, resetToDefault,
    setAdminConfigPage, redeemableName, handleChangeRedeemableName, redeemableSymbol, handleChangeRedeemableSymbol,
    redeemableInitialSupply, handleChangeRedeemableInitialSupply, buttonLock, deploySale,
    tierGatingAddress, handleChangeTierGatingAddress, minimumTier, handleChangeMinimumTier
  } : adminPanelProps)
{

  const [theDate, changeTheDate] = useState(saleTimeout); // this will be Date.now()

  const changeTimeout = (newValue: any) => {
    console.log(`New Value: ${newValue}`);
    changeTheDate(newValue);
  };

  /**
   * TODO THERE IS CURRENTLY A BUG WHEREBY IF A USER CHANGES THE TEXT (INSTEAD OF SELECTING ON THE GUI), THE DATE AND TIME WON'T BE WHAT IS SET
   * TODO THIS DATE ALSO NEEDS CONVERING TO UTC BECAUSE IT SEEMS TO BE APPLYING THE TIMEZONE OF THE USER SELECTING THE TIME (SO IF I DEPLOY FOR 3PM IN THE UK DURING BST, IT WILL SET IT FOR 2PM IN THE SMART CONTRACT)
   * @param newValue
   */
  const setFinishTimeout = (newValue: any) => {
    let finishTime = Date.parse(newValue); // be aware, this will use your local time (not UTC): https://stackoverflow.com/questions/2587345/why-does-date-parse-give-incorrect-results
    finishTime = finishTime/1000;
    handleChangeSaleTimeout(finishTime);
  }

  return (
    <>
      <NavBar string={`Configure Your Sale`} />
      <p className={'github github--firstview'}><a href={`${GITHUB_LINK}`} target="_blank">(Github Link)</a></p>

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
          Configure your Digital Objects Sale
        </Typography>

        { adminConfigPage !== 2 && (
          <>
            <>
              <Typography color="black" align="center">
                <a className="bullet" href="#" target="_blank">Rain Protocol Sale Demo Video</a><br/>
                <a className="bullet" href="https://docs.rainprotocol.xyz">Tutorials at docs.rainprotocol.xyz</a><br/>
                <a className="bullet" href={`${window.location.origin}/${SALE_EXAMPLE}`} target="_blank">Example Sale: Shoes Collection (shoeVoucher)</a>
              </Typography>
            </>
          </>
        )}

        <Canvas hidden={!(adminConfigPage !== 2)} className="the-canvas-deploypanel" camera={{ position: [0, 10, 20], fov: 40 }} performance={{ min: 0.1 }}>
          <ambientLight intensity={0.1} />
          <directionalLight intensity={0.01} position={[5, 25, 20]} />
          <Suspense fallback={<Html className="black">loading..</Html>}>
            <RTKN rotation={[-1.5,0,0]} redeemableSymbol={redeemableSymbol} />
            <Environment preset="lobby" />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>

        { adminConfigPage === 0 && (
          <>
            <Typography variant="h5" component="h3" color="black">
              (Page 1/3)
            </Typography>

            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">Name of your Digital Object Collection</InputLabel>
              <Input
                id="component-helper"
                value={redeemableName}
                onChange={handleChangeRedeemableName}
              />
            </FormControl>

            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">Your Digital Object Symbol</InputLabel>
              <Input
                id="component-helper"
                value={redeemableSymbol}
                onChange={handleChangeRedeemableSymbol}
              />
            </FormControl>

            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">Amount of Objects for Sale (in this example, limited to 1 per User)</InputLabel>
              <Input
                id="component-helper"
                value={redeemableInitialSupply}
                onChange={handleChangeRedeemableInitialSupply}
                endAdornment={<InputAdornment position="end">{redeemableSymbol}</InputAdornment>}
              />
            </FormControl>

            <div className="buttons-box">
              <Button className="fifty-percent-button" variant="outlined" onClick={() => {resetToDefault()}}>Reset</Button>
              <Button className="fifty-percent-button" variant="contained" onClick={() => {setAdminConfigPage(adminConfigPage+1)}}>Next</Button>
            </div>
          </>
        )}

        { adminConfigPage === 1 && (
          <>

            <Typography variant="h5" component="h3" color="black">
              (Page 2/3)
            </Typography>

            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">The <a href={`${FAUCET_BASE_URL}`} target="_blank">Reserve Token</a> others will use to buy your Digital Objects (i.e. {redeemableSymbol})</InputLabel>
              <Input
                id="component-helper"
                value={reserveTokenAddress}
                onChange={handleChangeReserveTokenAddress}
              />
            </FormControl>

            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">The Price (in {reserveSymbol}) of each Digital Object (i.e. {redeemableSymbol})</InputLabel>
              <Input
                id="component-helper"
                value={staticReservePriceOfRedeemable}
                onChange={handleChangeStaticReservePriceOfRedeemable}
                endAdornment={<InputAdornment position="end"><sub>{reserveSymbol}</sub></InputAdornment>}
              />
            </FormControl>

            <FormControl variant="standard">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Sale End (i.e. when end() can be called on the Sale contract)"
                  inputFormat="yyyy-MM-dd HH:mm"
                  ampm={false}
                  disablePast={true}
                  value={theDate}
                  onChange={changeTimeout}
                  onAccept={setFinishTimeout}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>

            <div className="buttons-box">
              <Button className="fifty-percent-button" variant="outlined" onClick={() => {setAdminConfigPage(adminConfigPage-1)}}>Previous</Button>
              <Button className="fifty-percent-button" variant="contained" onClick={() => {setAdminConfigPage(adminConfigPage+1)}}>Next</Button>
            </div>
          </>
        )}

        { adminConfigPage === 2 && (
          <>
            <TransactionsChartDeploy />

            <Typography variant="h5" component="h3" color="black">
              (Page 3/3)
            </Typography>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Advanced Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl variant="standard" className="accordion-style">
                  <InputLabel className="input-box-label" htmlFor="component-helper">The <a href={`${TIER_GATING_BASE_URL}`} target="_blank">Tier Gating</a> address for your Sale</InputLabel>
                  <Input
                    id="component-helper"
                    value={tierGatingAddress}
                    onChange={handleChangeTierGatingAddress}
                  />
                </FormControl>

                <FormControl variant="standard" className="accordion-style">
                  <InputLabel className="input-box-label" htmlFor="component-helper">Minimum Tier for taking part</InputLabel>
                  <Input
                    id="component-helper"
                    value={minimumTier}
                    onChange={handleChangeMinimumTier}
                  />
                </FormControl>
              </AccordionDetails>
            </Accordion>

            <Warning />

            <div className="buttons-box">
              <Button className="fifty-percent-button" variant="outlined" onClick={() => {setAdminConfigPage(adminConfigPage-1)}}>Previous</Button>
              <Button className="fifty-percent-button" disabled={buttonLock} variant="contained" onClick={() => {deploySale()}}>Deploy</Button>
            </div>
          </>
        )}
      </Box>
    </>
  )
}
