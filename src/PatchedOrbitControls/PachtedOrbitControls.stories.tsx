import * as React from 'react'
import { Meta } from '@storybook/react'
import { Octahedron } from '@react-three/drei'
import { PatchedOrbitControls } from './index'
import { Setup } from '../../.storybook/Setup'
import { useGraph, useThree } from '@react-three/fiber'

export default {
  title: 'Cad/Viewer/PatchedOrbitControls',
  component: PatchedOrbitControls,
  decorators: [
    (story) => (
      <Setup
        {...{
          controls: false,
          orthographic: true,
          camera: { near: -10000, far: 10000 },
          // onCreated({ camera, scene, size }) {}
        }}
      >
        <Octahedron {...{ args: [50] }}>
          <meshNormalMaterial />
        </Octahedron>
        {story()}
      </Setup>
    )
  ]
} as Meta

const Template = (args) => {
  const scene = useThree(({ scene }) => scene)

  const graph = useGraph(scene)

  console.log(scene)

  return (
    <>
      <group></group>
      <PatchedOrbitControls />
    </>
  )
}

export const DefaultStory = () => <Template />
DefaultStory.story = { name: 'Default' }
