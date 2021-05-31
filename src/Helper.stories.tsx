import * as React from 'react'
import * as THREE from 'three'
import { Meta } from '@storybook/react'
import { fitCamera } from './utils/fitCamera'
import { Setup, SphereHelper } from '@autopoiese/stories'
import {
  PerspectiveCamera,
  OrthographicCamera,
  Octahedron,
  OrbitControls,
  Box,
  Html,
  useHelper
} from '@react-three/drei'
import { useThree } from '@react-three/fiber'

export default {
  title: 'Cad/Viewer/helper',
  component: () => <div></div>,
  decorators: [
    (Story) => (
      <Setup
        {...{
          controls: true,
          orthographic: true,
          camera: { far: 10000, near: -10000 }
        }}
      >
        <Story />
      </Setup>
    )
  ]
} as Meta

const StoryComponent: React.FC<{ initialFit?: boolean }> = ({
  children,
  initialFit = true
}) => {
  const camera = useThree(({ camera }) => camera)
  const size = useThree(({ size }) => size)
  const [object, set] = React.useState(null)
  const handleFit = React.useCallback(() => {
    fitCamera({ object, camera, size })
  }, [object, camera, size])
  React.useEffect(() => {
    object !== null && initialFit && handleFit()
  }, [object, size])
  return (
    <>
      <group {...{ ref: set }}>
        <Box {...{ args: [2, 1, 3] }}>
          <meshNormalMaterial {...{ opacity: 0.5, transparent: true }} />
        </Box>
      </group>
      {object && <SphereHelper {...{ object }} />}
      <Html
        {...{
          children: <button {...{ onClick: handleFit, children: 'FIT' }} />
        }}
      />

      {children}
    </>
  )
}

export const DefaultStory = () => <StoryComponent />
DefaultStory.story = { name: 'orthographic fit' }

const PerspectiveCameraStoryComponent = () => {
  return (
    <StoryComponent {...{ initialFit: true }}>
      <PerspectiveCamera {...{ makeDefault: true, position: [0, 0, 20] }} />
    </StoryComponent>
  )
}

export const PerspectiveCameraStory = () => <PerspectiveCameraStoryComponent />
PerspectiveCameraStory.story = { name: 'perspective fit' }
