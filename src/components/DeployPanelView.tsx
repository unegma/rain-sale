import NavBar from "./NavBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import {Bar} from "react-chartjs-2";
import React, {Suspense} from "react";
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
import Vouchers from "./Vouchers";
import {Environment, Html, OrbitControls} from "@react-three/drei";
import RTKN from "./RTKN";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const displayedImage = 'https://assets.unegma.net/unegma.work/rain-voucher-sale.unegma.work/shoe-voucher.jpg'

type adminPanelProps = { adminConfigPage: number, reserveTokenAddress: string,
  handleChangeReserveTokenAddress: any, staticReservePriceOfRedeemable: any,
  handleChangeStaticReservePriceOfRedeemable: any, saleTimeoutInBlocks: any, handleChangeSaleTimeout: any,
  resetToDefault: any, setAdminConfigPage: any, redeemableName: any, handleChangeRedeemableName: any,
  redeemableSymbol: any, handleChangeRedeemableSymbol: any, redeemableInitialSupply: any,
  handleChangeRedeemableInitialSupply: any, buttonLock: any, deploySale: any
}

// todo rename from admin panel
export default function DeployPanelView({
    adminConfigPage, reserveTokenAddress, handleChangeReserveTokenAddress, staticReservePriceOfRedeemable,
    handleChangeStaticReservePriceOfRedeemable, saleTimeoutInBlocks, handleChangeSaleTimeout, resetToDefault,
    setAdminConfigPage, redeemableName, handleChangeRedeemableName, redeemableSymbol, handleChangeRedeemableSymbol,
    redeemableInitialSupply, handleChangeRedeemableInitialSupply, buttonLock, deploySale
  } : adminPanelProps)
{


  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Upcoming Transaction Costs (Estimated MATIC)',
      },
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
          Configure Voucher Sale
        </Typography>
        <Typography color="black" align="center">
          Rain Protocol Sale Demo, tutorials: <a href="https://docs.rainprotocol.xyz">docs.rainprotocol.xyz</a>
        </Typography>
        <Typography color="black" align="center">
          <a href="https://rain-erc20-faucet.unegma.work" target="_blank">'Reserve Tokens' (like demo USDC) can be Deployed and Minted here</a>
        </Typography>

        {/*<img hidden={!(adminConfigPage !== 2)} className="mainImage" src={displayedImage} alt="#" />*/}


        <Canvas hidden={!(adminConfigPage !== 2)} className="the-canvas-deploypanel" camera={{ position: [0, 0, 20], fov: 20 }} performance={{ min: 0.1 }}>
          <ambientLight intensity={0.1} />
          <directionalLight intensity={0.01} position={[5, 25, 20]} />
          <Suspense fallback={null}>
            {/*<Vouchers modalOpen={modalOpen} setModalOpen={setModalOpen} amount={rTKNAvailable} redeemableSymbol={redeemableSymbol}/>*/}
            <RTKN rotation={[1,1,1]} redeemableSymbol={redeemableSymbol} />
            <Environment preset="studio" />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} enablePan={false} enableRotate={false} />
          {/*<OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />*/}
        </Canvas>


        { adminConfigPage === 1 && (
          <>

            <Typography variant="h5" component="h3" color="black">
              (Page 2/3)
            </Typography>

            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">The 'Reserve' Token (e.g. USDC) for buying Vouchers</InputLabel>
              <Input
                id="component-helper"
                value={reserveTokenAddress}
                onChange={handleChangeReserveTokenAddress}
              />
            </FormControl>

            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">The Price (in Reserve Tokens) of a Voucher</InputLabel>
              <Input
                id="component-helper"
                value={staticReservePriceOfRedeemable}
                onChange={handleChangeStaticReservePriceOfRedeemable}
              />
            </FormControl>

            {/*todo add some validation for max*/}
            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">Sale Duration (Matic Mumbai: 600 blocks is 60mins)</InputLabel>
              <Input
                id="component-helper"
                value={saleTimeoutInBlocks}
                onChange={handleChangeSaleTimeout}
              />
            </FormControl>

            <div className="buttons-box">
              <Button className="fifty-percent-button" variant="outlined" onClick={() => {setAdminConfigPage(adminConfigPage-1)}}>Previous</Button>
              <Button className="fifty-percent-button" variant="contained" onClick={() => {setAdminConfigPage(adminConfigPage+1)}}>Next</Button>
            </div>
          </>
        )}

        { adminConfigPage === 0 && (
          <>
            <Typography variant="h5" component="h3" color="black">
              (Page 1/3)
            </Typography>

            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">Collection Name</InputLabel>
              <Input
                id="component-helper"
                value={redeemableName}
                onChange={handleChangeRedeemableName}
              />
            </FormControl>


            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">Voucher Symbol</InputLabel>
              <Input
                id="component-helper"
                value={redeemableSymbol}
                onChange={handleChangeRedeemableSymbol}
              />
            </FormControl>

            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">Amount for Sale (1 per User)</InputLabel>
              <Input
                id="component-helper"
                value={redeemableInitialSupply}
                onChange={handleChangeRedeemableInitialSupply}
              />
            </FormControl>

            <div className="buttons-box">
              <Button className="fifty-percent-button" variant="outlined" onClick={() => {resetToDefault()}}>Reset</Button>
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

            <Typography color="red">
              Please make sure you are connected to Mumbai Matic testnet.
            </Typography>

            <Typography color="black">
              Ratios and costs based on tests taken around the following time: 2022-05-30T15:32:44Z
            </Typography>


            <Typography color="black">
              Please be aware, this example does not have strict checking, and so you will not recover the cost of network fees (gas) if a deployment fails. If Tx2 (Start Sale) fails, you can call this manually on the contract instead of re-deploying the Sale.
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
