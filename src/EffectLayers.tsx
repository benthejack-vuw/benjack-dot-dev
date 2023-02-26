import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Vignette, DepthOfField, Noise } from '@react-three/postprocessing'

const EffectLayers = () => {
    const depth = useRef<any>(null);
    const [mx, setMx] = useState<number>(0);
    

    return (
    <EffectComposer>
        <Vignette
            offset={0.1} // vignette offset
            darkness={1} // vignette darkness
            eskil={false} // Eskil's vignette technique
        />
    </EffectComposer>
    );
};

export default EffectLayers;