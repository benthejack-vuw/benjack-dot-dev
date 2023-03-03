import React, { useEffect, useMemo, useRef, useState } from "react"
import { ShaderMaterial } from "three";
import gsap from 'gsap';
import passthroughVert from './shaders/dnaSpikeVert';
import spikePointShader from './shaders/dnaSpikeFrag';
import useScrollAnimation from "./hooks/useScrollAnimation";


const DnaPoints = ({ opacity = 1}) => {
    const animRef = useRef<gsap.core.Animation>();
    const shaderRef = useRef<ShaderMaterial>(null);
    const [pointPositions, setPointPositions] = useState<Float32Array>();
    const { scrollAnimation, setScrollAnimationValue } = useScrollAnimation(0, window.innerHeight * 0.3, 0.6, animRef);

    const uniforms = useMemo(() => ({ anim: {value: 0}, opacity: {value: opacity} }), []);

    useEffect(() => {
        fetch('/dna_out.json')
            .then((result) => result.json())
            //@ts-ignore
            .then((json) => console.log(json) || setPointPositions(new Float32Array(json)))
            .then(() => {
                const anim = { animValue: 1 };
                animRef.current = gsap.to(anim, {
                    animValue: 0,
                    duration: 10,
                    delay: 2,
                    onUpdate: () => setScrollAnimationValue(anim.animValue)
                })
            });
    }, []);

    useEffect(() => {
        if(!shaderRef.current) return;
        shaderRef.current.uniforms.anim.value = 1 - scrollAnimation;
        shaderRef.current.uniformsNeedUpdate = true;
      }, [scrollAnimation]);

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