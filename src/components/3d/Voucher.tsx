import React, {useEffect, useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import {Html, Instance, Text} from "@react-three/drei";
import * as THREE from "three";
const color = new THREE.Color();

export default function Voucher({random, modalOpen, setModalOpen, redeemableSymbol, ...props }: {random: number, modalOpen: boolean, setModalOpen: any, redeemableSymbol: string}) {
  const ref = useRef<any>()
  const [hovered, setHover] = useState(false)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }, [hovered])

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + random * 10000
    ref.current.rotation.set(Math.cos(t / 4) / 2, Math.sin(t / 4) / 2, Math.cos(t / 1.5) / 2)
    ref.current.position.y = Math.sin(t / 1.5) / 2
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 0.5 : 0.15, 0.1)
    ref.current.color.lerp(color.set(hovered ? 'red' : 'gold'), hovered ? 0.8 : 0.1)
  })

  return (
    <group {...props}>
      {/*<Text*/}
      {/*  position={[0, -1, 0.58]}*/}
      {/*  rotation={[0,0,0]}*/}
      {/*  fontSize={2}*/}
      {/*  // lineHeight={0.8}*/}
      {/*  // material-toneMapped={false}*/}
      {/*  color='#444444'*/}
      {/*>*/}
      {/*  {redeemableSymbol}*/}
      {/*</Text>*/}
      <Instance ref={ref} onClick={() =>{setModalOpen(true)}} onPointerOver={(e) => (e.stopPropagation(), setHover(true))} onPointerOut={(e) => setHover(false)} />
    </group>
  )
}
