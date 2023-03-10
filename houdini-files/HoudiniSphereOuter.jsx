/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 ./HoudiniSphereOuter.gltf --transform
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/HoudiniSphereOuter-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <points geometry={nodes.sphere.geometry} material={nodes.sphere.material} />
    </group>
  )
}

useGLTF.preload('/HoudiniSphereOuter-transformed.glb')
