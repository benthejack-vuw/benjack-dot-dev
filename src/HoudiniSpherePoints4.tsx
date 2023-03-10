/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 houdiniSpherePoints3.gltf --transform
*/

import React, { useEffect, useMemo, useRef } from 'react'
import { Backdrop, useGLTF, Stage, Bounds } from '@react-three/drei'
import { Group, Mesh, Points, ShaderMaterial } from 'three'
import passthroughVert from './shaders/dnaSpikeVert';
import spikePointShader from './shaders/dnaSpikeFrag';
import { useFrame } from '@react-three/fiber';


export const Sphere4 = ({ ...props })  => {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const shaderRef = useRef<ShaderMaterial>(null);
  const { nodes } = useGLTF('/HoudiniSphere4-transformed.glb') as unknown as { nodes: { sphere: Mesh, spikes: Points }}
  const uniforms = useMemo(() => ({ anim: {value: 0} }), []);

  useEffect(() => {
    if(!meshRef.current) return;
    meshRef.current.geometry.computeVertexNormals();
    console.log('recalc')
  }, []);

  useFrame((state) => {
    if(!shaderRef.current || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    if(true) {
      shaderRef.current.uniforms.anim.value = state.mouse.x * 0.5 + 0.5;
      shaderRef.current.uniformsNeedUpdate = true;
    }
    
    groupRef.current.rotation.y = t/6;
    groupRef.current.rotation.x = t/4;
    groupRef.current.rotation.z = t/5;
  }) 

  return (
    
    <group ref={groupRef} {...props} dispose={null}>
        <mesh ref={meshRef} geometry={nodes.sphere.geometry} material={nodes.sphere.material} castShadow receiveShadow/>
        <points geometry={nodes.spikes.geometry} castShadow receiveShadow>
          <shaderMaterial
            ref={shaderRef}
            uniforms={uniforms}
            fragmentShader={spikePointShader()}
            vertexShader={passthroughVert()}
            transparent
            depthWrite
          />
        </points>
    </group>

  )
}

useGLTF.preload('/HoudiniSphere4-transformed.glb')
