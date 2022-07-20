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
import {Bar} from "react-chartjs-2";
import React, {Suspense, useEffect, useState} from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Canvas} from "@react-three/fiber";
import {Environment, Html, OrbitControls} from "@react-three/drei";
import RTKN from "../3d/RTKN";
import {DateTimePicker, TimePicker} from "@mui/x-date-pickers";
import {Accordion, AccordionDetails, AccordionSummary, InputAdornment} from "@mui/material";
const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME; // Mumbai (Polygon Testnet) Chain ID

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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


  const options = {
    responsive: true,
    // scales: {
    //   yAxes: [{
    //     scaleLabel: {
    //       display: true,
    //       labelString: 'Y text'
    //     }
    //   }],
    //   xAxes: [{
    //     scaleLabel: {
    //       display: true,
    //       labelString: 'X text'
    //     }
    //   }],
    // },
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Upcoming Transaction Cost Ratios (Estimated MATIC Ratios based on costs at: 2022-05-30T15:32:44Z)',
      }
    },
  };

  const data = {
    labels: ['Tx1: Deploy Sale', 'Tx2: Start Sale'],
    datasets: [
      {
        label: '',
        data: [1],
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
      {
        label: '',
        data: [0.040, 0.00125], // todo base it on dynamic matic costs
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '',
        data: [1],
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }
    ],
  };

  const [theDate, changeTheDate] = useState(saleTimeout); // this will be Date.now()

  const changeTimeout = (newValue: any) => {
    console.log(`New Value: ${newValue}`);
    changeTheDate(newValue);
  };

  const setFinishTimeout = (newValue: any) => {
    let finishTime = Date.parse(newValue); // be aware, this will use your local time (not UTC): https://stackoverflow.com/questions/2587345/why-does-date-parse-give-incorrect-results
    finishTime = finishTime/1000;
    handleChangeSaleTimeout(finishTime);
  }

  return (
    <>
      <NavBar string={`Configure Your Sale`} />

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
        <Typography color="black" align="center">
          An example to go along with the Rain Protocol Sale tutorial: <a href="https://docs.rainprotocol.xyz">docs.rainprotocol.xyz</a>
        </Typography>

        <Canvas hidden={!(adminConfigPage !== 2)} className="the-canvas-deploypanel" camera={{ position: [0, 10, 20], fov: 40 }} performance={{ min: 0.1 }}>
          <ambientLight intensity={0.1} />
          <directionalLight intensity={0.01} position={[5, 25, 20]} />
          <Suspense fallback={<Html className="black">loading..</Html>}>
            {/*<Vouchers modalOpen={modalOpen} setModalOpen={setModalOpen} amount={rTKNAvailable} redeemableSymbol={redeemableSymbol}/>*/}
            <RTKN rotation={[-1.5,0,0]} redeemableSymbol={redeemableSymbol} />
            <Environment preset="lobby" />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} enablePan={false} enableRotate={false} />
          {/*<OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />*/}
          {/*<Html className="canvas-deployment-info">{redeemableName} Collection Sale</Html>*/}
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
              <InputLabel className="input-box-label" htmlFor="component-helper">The <a href="https://rain-erc20-faucet.unegma.work" target="_blank">Reserve Token</a> others will use to buy your Digital Objects (i.e. {redeemableSymbol})</InputLabel>
              <Input
                id="component-helper"
                value={reserveTokenAddress}
                onChange={handleChangeReserveTokenAddress}
              />
            </FormControl>

            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">The Price (in Reserve Token set above) of each Digital Object (i.e. {redeemableSymbol})</InputLabel>
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
            <Bar options={options} data={data} />;

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
                  <InputLabel className="input-box-label" htmlFor="component-helper">The Tier Gating address for your Sale</InputLabel>
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

            <Typography color="black">
              Please make sure you are connected to the <a href={`https://chainlist.org/?search=mumbai&testnets=true`} target="_blank"><b className='modalTextRed'>{CHAIN_NAME}</b></a> Network.<br/>
              <span className="red">Please be aware, you will not recover the cost for network fees (gas) if deployment fails.</span>
            </Typography>

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
