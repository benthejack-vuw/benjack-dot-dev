import React, { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { ShaderMaterial } from "three";
import passthroughVert from './shaders/dnaSpikeVert';
import spikePointShader from './shaders/dnaSpikeFrag';

const DnaPoints = ({animateDna = 0, opacity = 1}) => {
    const shaderRef = useRef<ShaderMaterial>(null);
    const [pointPositions, setPointPositions] = useState<Float32Array>();
    
    const uniforms = useMemo(() => ({ anim: {value: 0}, opacity: {value: opacity} }), []);

    useEffect(() => {
        fetch('/dna_out.json')
            .then((result) => result.json())
            //@ts-ignore
            .then((json) => console.log(json) || setPointPositions(new Float32Array(json)));
    }, []);

    useEffect(() => {
        if(!shaderRef.current) return;
        shaderRef.current.uniforms.anim.value = animateDna;
        shaderRef.current.uniformsNeedUpdate = true;
      }, [animateDna]);

    return (
        <group>
{
            !!pointPositions && (
                <points>
                    <bufferGeometry attach="geometry">
                        <bufferAttribute
                            attach="attributes-position" //attribute parameter yang akan dikontrol
                            array={pointPositions}
                            count={pointPositions.length / 3} //
                            itemSize={3} //dikeranakan telah diketahui bahwa tiap arraytype axis akan berisi 3 value pada 1d array
                        />
                    </bufferGeometry>
                    <shaderMaterial
                        ref={shaderRef}
                        uniforms={uniforms}
                        fragmentShader={spikePointShader()}
                        vertexShader={passthroughVert()}
                        transparent
                    />
                </points>
            )
        }
        </group>
    );


}

export default DnaPoints;