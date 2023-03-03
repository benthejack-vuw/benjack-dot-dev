import {Canvas} from "@react-three/fiber";
import DnaSphere from './DnaSphere';
import { Environment, Stats } from '@react-three/drei'
import EffectLayers from "./EffectLayers";
import { useMemo } from "react";
import { smoothstep } from "three/src/math/MathUtils";

type GLCanvasProps = {
    intensity?: number;
    lightRadius?: number;
};

const GLCanvas = ({intensity = 1, lightRadius = 2}: GLCanvasProps) => {
    const spherePosition: [x: number, y: number, z:number] = useMemo(() => (
        window.innerWidth > 700 ? [1.5, 0, 2] : [0, -1.5, 2] 
    ), [])

    return (
        <div className="fixed w-full h-full top-0 left-0 z-[-1]">
            <Canvas camera={{near: 1, far: -1}} shadows>
                <color attach="background" args={[0.01, 0.01, 0.01]} />
                <pointLight
                    position={[-2 * lightRadius, -0.5 * lightRadius, -2 * lightRadius]}
                    intensity={intensity}
                />
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
                <Environment preset="city" />

                <DnaSphere
                    position={spherePosition}
                    speed={0.1}
                />
                
                <EffectLayers/>
                <Stats/>                
            </Canvas>
        </div>
    );
};

export default GLCanvas;