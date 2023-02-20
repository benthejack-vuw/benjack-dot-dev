/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 the-sphere.gltf --transform
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import {useFrame} from "@react-three/fiber";
import {Group, Mesh} from "three";

export const Model = ({ ...props }) => {
  const { nodes } = useGLTF('/the-sphere-transformed.glb') as unknown as { nodes: { tube_object1: Mesh} };
  const meshRef = useRef<Group>(null);

  useFrame((state) => {
      if(!meshRef.current) return;
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.y = t/10;
  });

  return (
    <group ref={meshRef} {...props} dispose={null}>
      <mesh
          geometry={nodes.tube_object1.geometry}
          material={nodes.tube_object1.material}
      />
    </group>
  )
}

useGLTF.preload('/the-sphere-transformed.glb')
