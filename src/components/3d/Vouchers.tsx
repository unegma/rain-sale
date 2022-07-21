import {Canvas, useLoader} from "@react-three/fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Text, Instances} from "@react-three/drei";
import Voucher from "./Voucher";
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';

const DECODER_PATH="https://www.gstatic.com/draco/versioned/decoders/1.4.1/";
const VOUCHER_URL = 'https://assets.unegma.net/unegma.work/rain-voucher-sale.unegma.work/voucher-transformed.glb';
const randomVector = (r: any) => [r / 2 - Math.random() * r, r / 2 - Math.random() * r, r / 2 - Math.random() * r];
const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
const randomData = Array.from({ length: 1000 }, (r = 10) => ({ random: Math.random(), position: randomVector(r), rotation: randomEuler() }))

/**
 * From this example:
 */
export default function Vouchers({amount, modalOpen, setModalOpen, redeemableSymbol}: {amount: any, modalOpen: boolean, setModalOpen: any, redeemableSymbol: string}) {
  const useDraco = true;
  const { nodes, materials }: any = useLoader(GLTFLoader, VOUCHER_URL, (loader: any) => {
    if (useDraco) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderConfig({type: 'js'});
      dracoLoader.setDecoderPath(DECODER_PATH);
      loader.setDRACOLoader(dracoLoader);
    }
  });
  console.log(nodes, materials)
  return (
    <Instances range={amount} material={materials.paper_Mat} geometry={nodes.Object_2.geometry}>
      {randomData.map((props, i) => (
        <Voucher modalOpen={modalOpen} setModalOpen={setModalOpen} key={`${i}`} {...props} redeemableSymbol={redeemableSymbol}/>
      ))}
    </Instances>
  )
}
