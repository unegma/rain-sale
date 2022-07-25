import React, {Suspense, useEffect} from "react";
import {
  useParams
} from "react-router-dom";
import NavBar from "../layout/NavBar";
import SaleModal from "./SaleModal";
import {Canvas} from "@react-three/fiber";
import Vouchers from "../3d/Vouchers";
import {Environment, Html, OrbitControls} from "@react-three/drei";
import {Typography} from "@mui/material";
const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME; // Mumbai (Polygon Testnet) Chain ID
const GITHUB_LINK = process.env.REACT_APP_GITHUB_URL;

type saleViewProps = {
  redeemableName: any, redeemableSymbol: any, modalOpen: any, setModalOpen: any, initiateBuy: any, buttonLock: any,
  redeemableTokenAddress: any, staticReservePriceOfRedeemable: any, reserveSymbol: any, consoleData: any,
  consoleColor: any, saleAddress: string, rTKNAvailable: number, saleView: any
  setSaleAddress: any, reserveTokenAddress: string, reserveTokenBalance: string, saleStatus: number
}

export default function SaleView({
    redeemableName, redeemableSymbol, modalOpen, setModalOpen, initiateBuy, buttonLock, redeemableTokenAddress,
    staticReservePriceOfRedeemable, reserveSymbol, consoleData, consoleColor, saleAddress, saleView,
    rTKNAvailable, setSaleAddress, reserveTokenAddress, reserveTokenBalance, saleStatus
  }: saleViewProps )
{

  let {id}: any = useParams();
  // set token address by url instead of t= (check line 80 onwards works in app.tsx for getting the tokenData)
  useEffect(() => {
    setSaleAddress(id);
  }, []);

  return (
    <>
      { saleView && (
        <>
          <NavBar string={`${redeemableSymbol} Sale (${redeemableName} Collection)`} stringRight={``} />
          <p className='deploy-own'>Must be connected to <a href={`https://chainlist.org/?search=mumbai&testnets=true`} target="_blank"><b className='modalTextRed'>{CHAIN_NAME}</b></a> Testnet. <a href={`${window.location.origin}`}>Deploy Your Own Sale Here!</a></p>
          <p className={`github github--secondview`}><a href={`${GITHUB_LINK}`} target="_blank">(Github Link)</a></p>

          {/*todo check these are correct status codes*/}
          { saleStatus === 1 && (
            <>
              {/*todo can we have it saying Sale Over or something, if the sale has passed the end time duration? also, can users still buy at this point?*/}
              <p className={`saleStatusInfo saleStatusInfo--active`}>{redeemableSymbol} Sale!</p>
            </>
            )}
          { saleStatus === 2 && (
            <p className={`saleStatusInfo saleStatusInfo--ended`}>Sale Ended!</p>
          )}
          { saleStatus === 3 && (
            <p className={`saleStatusInfo saleStatusInfo--ended`}>Sale Ended!</p>
          )}

          <div className="canvasContainer">
            <SaleModal
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              initiateBuy={initiateBuy}
              buttonLock={buttonLock}
              redeemableTokenAddress={redeemableTokenAddress}
              staticReservePriceOfRedeemable={staticReservePriceOfRedeemable}
              reserveSymbol={reserveSymbol}
              redeemableSymbol={redeemableSymbol}
              consoleData={consoleData}
              consoleColor={consoleColor}
              saleAddress={saleAddress}
              redeemableName={redeemableName}
              saleStatus={saleStatus}
              reserveTokenAddress={reserveTokenAddress}
              reserveTokenBalance={reserveTokenBalance}
            />

            <Canvas className="the-canvas" camera={{ position: [0, 0, 20], fov: 50 }} performance={{ min: 0.1 }}>
              <ambientLight intensity={0.5} />
              <directionalLight intensity={0.3} position={[5, 25, 20]} />
              <Suspense fallback={<Html className="black">loading..</Html>}>
                <Vouchers modalOpen={modalOpen} setModalOpen={setModalOpen} amount={rTKNAvailable} redeemableSymbol={redeemableSymbol}/>
                <Environment preset="city" />
              </Suspense>
              <OrbitControls autoRotate autoRotateSpeed={1} enableRotate={true} enablePan={false} enableZoom={false} />
            </Canvas>
          </div>
        </>
      )}
      {!saleView && (
        <>
          <Typography className="black">Loading..<br/>If this message persists,<br/>Sale may need to finish indexing,<br/>or the address doesn't exist.<br/>Try again in a few moments).</Typography>
        </>
      )}
    </>
  )
}
