import * as React from 'react'
import * as THREE from 'three'
import { Meta } from '@storybook/react'
import { Octahedron } from '@react-three/drei'
import { useViewer, ControlButtons, Viewer } from './index'
import { Setup } from '../../.storybook/Setup'
import { useThree } from '@react-three/fiber'

export default {
  title: 'Cad/Viewer/useViewer',
  component: () => null
  // decorators: [(story) => <Setup {...{ controls: false }}>{story()}</Setup>]
}

const Template = () => {
  return (
    <>
      <Setup>
        <group>
          <Octahedron>
            <meshNormalMaterial />
          </Octahedron>
        </group>
        <Viewer />
      </Setup>
    </>
  )
}

export const UseViewerStory = () => <Template />
UseViewerStory.story = { name: 'default' }
