import {Canvas} from "@react-three/fiber";
import DnaSphere from './DnaSphere';
import { Environment } from '@react-three/drei'
import EffectLayers from "./EffectLayers";
import { useEffect, useMemo } from "react";
import gsap from "gsap";

type GLSphereProps = {
    intensity?: number;
    lightRadius?: number;
    animateIn?: number;
};


const smoothstep = (edge0: number, edge1: number, x: number) => {
   if (x < edge0)
      return 0;

   if (x >= edge1)
      return 1;

   // Scale/bias into [0..1] range
   x = (x - edge0) / (edge1 - edge0);

   return x * x * (3 - 2 * x);
}

const GLSphere = ({intensity = 1, lightRadius = 2, animateIn = 0}: GLSphereProps) => {

    const animOne = useMemo(() => ({
        animateIn: smoothstep(0, 0.3, animateIn),
        animateDna: smoothstep(0.3, 1.0, animateIn),
    }), [animateIn]);

    const spherePosition: [x: number, y: number, z:number] = useMemo(() => (
        window.innerWidth > 700 ? [1.5, 0, 2] : [0, -1.5, 2] 
    ), [])

    return (
        <div className="fixed w-full h-full top-0 left-0 z-[-1]">
            <Canvas camera={{near: 1, far: -1}} shadows>
                <color attach="background" args={[0.005, 0.005, 0.005]} />
                <ambientLight intensity={intensity / 3} />
                <spotLight
                    penumbra={1}
                    position={[1 * lightRadius, 2 * lightRadius, 1 * lightRadius]}
                    intensity={intensity * 2}
                    castShadow={true}
                    shadow-bias={-0.0001}
                    shadow-normalBias={0}
                    shadow-mapSize={1024}
                />
                <pointLight
                    position={[-2 * lightRadius, -0.5 * lightRadius, -2 * lightRadius]}
                    intensity={intensity}
                />
                <Environment preset="city" />
                <DnaSphere position={spherePosition} speed={0.1} animateIn={animOne.animateIn} animateDna={animOne.animateDna} />
                <EffectLayers/>
            </Canvas>
        </div>
    );
};

export default GLSphere;