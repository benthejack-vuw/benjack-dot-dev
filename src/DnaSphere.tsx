/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 houdiniSpherePoints3.gltf --transform
*/

import React, { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { Group, Mesh, Points, ShaderMaterial, Vector3 } from 'three'
import passthroughVert from './shaders/dnaSpikeVert';
import spikePointShader from './shaders/dnaSpikeFrag';

import { useFrame } from '@react-three/fiber';

type VectorArray = [x: number, y:number, z:number];

type DnaSphereProps = {
  opacity?: number;
  speed?: number;
  animateIn?: number;
  animateDna?: number;
  position: VectorArray;
};

const lerp = (a: number, b:number, t: number) => {
  return a + (b - a) * t;
}

const DnaSphere = ({ opacity = 1.0, speed = 0.5, animateIn = 0, animateDna = 0, position, ...props }: DnaSphereProps)  => {
  const groupRef = useRef<Group>(null);
  const shaderRef = useRef<ShaderMaterial>(null);
  const { nodes } = useGLTF('/HoudiniSphereWithPoints-transformed.glb') as unknown as { nodes: { SphereMesh: Mesh, DnaStrands: Points, SpherePoints: Points }}
  const rotation = useMemo(() => (
    new Vector3(Math.random() * speed, Math.random() * speed, Math.random() * speed)
  ), []);
  const uniforms = useMemo(() => ({ anim: {value: 0}, opacity: {value: opacity} }), []);
  const pos: VectorArray = useMemo(() => [position[0], lerp(3 * Math.abs(position[2]), position[1], animateIn), position[2]], [animateIn]);

  useEffect(() => {
    if(!shaderRef.current) return;
    shaderRef.current.uniforms.anim.value = animateDna;
    shaderRef.current.uniformsNeedUpdate = true;
  }, [animateDna]);

  useFrame((state) => {
    if(!shaderRef.current || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.x = rotation.x * t;
    groupRef.current.rotation.y = rotation.y * t;
    groupRef.current.rotation.z = rotation.z * t;
  }) 

  return (
    
    <group ref={groupRef} position={pos} {...props} dispose={null}>
      <mesh
        geometry={nodes.SphereMesh.geometry}
        material={nodes.SphereMesh.material}
        castShadow
        receiveShadow
        scale={animateIn}
      >
        <meshStandardMaterial transparent opacity={opacity} color={[0.05,0.05, 0.05]} metalness={0.5} roughness={0.6}/>
      </mesh>

      <points geometry={nodes.DnaStrands.geometry} material={nodes.DnaStrands.material}>
        <shaderMaterial
              ref={shaderRef}
              uniforms={uniforms}
              fragmentShader={spikePointShader()}
              vertexShader={passthroughVert()}
              transparent
            />
      </points>
    </group>

  )
}

export default DnaSphere;

useGLTF.preload('/HoudiniSphereWithPoints-transformed.glb')

