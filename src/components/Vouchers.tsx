import {Canvas, useLoader} from "@react-three/fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Instances} from "@react-three/drei";
import Voucher from "./Voucher";
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';

const DECODER_PATH="https://www.gstatic.com/draco/versioned/decoders/1.4.1/";
const voucherURL = 'https://assets.unegma.net/unegma.work/rain-voucher-sale.unegma.work/voucher.gltf';
const randomVector = (r: any) => [r / 2 - Math.random() * r, r / 2 - Math.random() * r, r / 2 - Math.random() * r];
const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
const randomData = Array.from({ length: 1000 }, (r = 10) => ({ random: Math.random(), position: randomVector(r), rotation: randomEuler() }))

/**
 * From this example:
 */
export default function Shoes({amount, modalOpen, setModalOpen}: {amount: any, modalOpen: boolean, setModalOpen: any}) {
  const useDraco = false;
  const { nodes, materials }: any = useLoader(GLTFLoader, voucherURL, (loader: any) => {
    if (useDraco) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderConfig({type: 'js'});
      dracoLoader.setDecoderPath(DECODER_PATH);
      loader.setDRACOLoader(dracoLoader);
    }
  });
  console.log(nodes, materials)
  return (
    <Instances range={amount} material={materials.lambert1} geometry={nodes.GoldCoin.geometry}>
      {randomData.map((props, i) => (
        <Voucher modalOpen={modalOpen} setModalOpen={setModalOpen} key={i} {...props} />
      ))}
    </Instances>
  )
}