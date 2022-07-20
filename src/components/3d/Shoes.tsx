import {Canvas, useLoader} from "@react-three/fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Instances} from "@react-three/drei";
import Shoe from "./Shoe";
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';

const DECODER_PATH="https://www.gstatic.com/draco/versioned/decoders/1.4.1/";
const shoeURL = 'https://assets.unegma.net/unegma.work/rain-shoe-sale.unegma.work/shoe-compressed.gltf';
const randomVector = (r: any) => [r / 2 - Math.random() * r, r / 2 - Math.random() * r, r / 2 - Math.random() * r];
const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
const randomData = Array.from({ length: 1000 }, (r = 10) => ({ random: Math.random(), position: randomVector(r), rotation: randomEuler() }))

/**
 * From this example:
 * https://codesandbox.io/s/floating-instanced-shoes-h8o2d?file=/src/App.js:1195-1246
 */
export default function Shoes({amount, modalOpen, setModalOpen}: {amount: any, modalOpen: boolean, setModalOpen: any}) {
  const useDraco = true;
  const { nodes, materials }: any = useLoader(GLTFLoader, shoeURL, (loader: any) => {
    if (useDraco) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderConfig({type: 'js'});
      dracoLoader.setDecoderPath(DECODER_PATH);
      loader.setDRACOLoader(dracoLoader);
    }
  });
  return (
    <Instances range={amount} material={materials.phong1SG} geometry={nodes.Shoe.geometry}>
      {randomData.map((props, i) => (
        <Shoe modalOpen={modalOpen} setModalOpen={setModalOpen} key={i} {...props} />
      ))}
    </Instances>
  )
}
