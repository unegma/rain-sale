import NavBar from "./NavBar";
import Modal from "./Modal";
import {Canvas} from "@react-three/fiber";
import React, {Suspense} from "react";
import Shoes from "./Shoes";
import {Environment, OrbitControls} from "@react-three/drei";

type saleViewProps = {
  redeemableName: any, redeemableSymbol: any, modalOpen: any, setModalOpen: any, initiateBuy: any, buttonLock: any,
  redeemableTokenAddress: any, staticReservePriceOfRedeemable: any, reserveSymbol: any, consoleData: any,
  consoleColor: any, redeemableInitialSupply: any
}

export default function SaleView({
    redeemableName, redeemableSymbol, modalOpen, setModalOpen, initiateBuy, buttonLock, redeemableTokenAddress,
    staticReservePriceOfRedeemable, reserveSymbol, consoleData, consoleColor, redeemableInitialSupply
  }: saleViewProps )
{

  return (
    <>
      <NavBar string={`${redeemableName} (${redeemableSymbol}) Sale!`} stringRight={`Click a Shoe!`} />
      <div className="canvasContainer">
        <Modal
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
        />

        <Canvas camera={{ position: [0, 0, 20], fov: 50 }} performance={{ min: 0.1 }}>
          <ambientLight intensity={0.5} />
          <directionalLight intensity={0.3} position={[5, 25, 20]} />
          <Suspense fallback={null}>
            <Shoes modalOpen={modalOpen} setModalOpen={setModalOpen} amount={redeemableInitialSupply} />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={1} />
        </Canvas>
      </div>
    </>
  )
}
