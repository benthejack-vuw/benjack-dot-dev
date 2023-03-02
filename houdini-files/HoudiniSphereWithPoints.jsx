/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 ./HoudiniSphereWithPoints.gltf --transform
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/HoudiniSphereWithPoints-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.SphereMesh.geometry} material={nodes.SphereMesh.material} />
    </group>
  )
}

useGLTF.preload('/HoudiniSphereWithPoints-transformed.glb')
