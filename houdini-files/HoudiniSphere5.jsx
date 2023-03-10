/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 ./HoudiniSphere5.gltf --transform
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/HoudiniSphere5-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.spikes.geometry} material={nodes.spikes.material} />
      <mesh geometry={nodes.sphere.geometry} material={nodes.sphere.material} />
    </group>
  )
}

useGLTF.preload('/HoudiniSphere5-transformed.glb')
