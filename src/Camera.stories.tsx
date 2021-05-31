import * as React from 'react'
import * as THREE from 'three'
import { Meta, Args } from '@storybook/react'
import { Setup, CameraViewer, SphereHelper } from '@autopoiese/stories'
import {
  PerspectiveCamera,
  OrthographicCamera,
  Octahedron,
  OrbitControls,
  Box,
  Html,
  Sphere,
  useHelper
} from '@react-three/drei'
import {
  PerspectiveCameraProps,
  ReactThreeFiber,
  useThree
} from '@react-three/fiber'
import { animated, useSpring, config } from '@react-spring/three'
import { getFovToFit, getDistanceToFit } from './utils/perspectiveHelpers'

export default {
  title: 'Cad/Viewer/camera',
  component: () => <div></div>,
  decorators: [
    (Story) => (
      <Setup
        {...{
          controls: true
        }}
      >
        <Story />
        <CameraViewer />
      </Setup>
    )
  ]
} as Meta

const AnimatedPerspectiveCamera = animated(PerspectiveCamera)

const PerspectiveComponent: React.FC<
  {
    [key in 'from' | 'to']?: Partial<
      ReactThreeFiber.Object3DNode<
        THREE.PerspectiveCamera,
        typeof THREE.PerspectiveCamera
      >
    >
  } & { onUpdate?: PerspectiveCameraProps['onUpdate'] }
> = ({ from, to, children, onUpdate, ...springConfig }) => {
  const spring = useSpring({
    from,
    to,
    loop: { reverse: true },
    config: {},
    ...springConfig
  })
  return (
    <>
      {children || (
        <>
          <Box {...{ args: [1, 2, 3] }}>
            <meshNormalMaterial />
          </Box>
          <Sphere {...{ args: [4, 200, 200] }}>
            <meshBasicMaterial
              {...{
                color: 'black',
                wireframe: true,
                opacity: 0.3,
                transparent: true
              }}
            />
          </Sphere>
        </>
      )}
      <AnimatedPerspectiveCamera
        {...{
          makeDefault: true,
          position: [0, 0, 50],
          ...(spring as any),
          onUpdate: (cam) => {
            onUpdate?.(cam)
            cam.updateProjectionMatrix()
          }
        }}
      />
    </>
  )
}

export const PerspectiveZoomStory = () => (
  <PerspectiveComponent {...{ from: { zoom: 1 }, to: { zoom: 10 } }} />
)
PerspectiveZoomStory.story = { name: 'zoom' }

export const PerspectivePositionStory = () => (
  <PerspectiveComponent
    {...{ from: { position: [0, 0, 10] }, to: { position: [0, 0, 1000] } }}
  />
)
PerspectivePositionStory.story = { name: 'position' }

export const PerspectiveFovStory = () => (
  <PerspectiveComponent {...{ from: { fov: 5 }, to: { fov: 200 } }} />
)
PerspectiveFovStory.story = { name: 'fov' }

export const PerspectiveFovPositionStory = () => (
  <PerspectiveComponent
    {...{
      from: { position: [0, 0, 10], far: 20, near: 0.1 },
      to: { position: [0, 0, 100], far: 110, near: 90 }
    }}
  />
)
PerspectiveFovPositionStory.story = { name: 'far, near & position' }

const rotation = new THREE.Euler(10, 2, 3)

export const PerspectiveZoomPositionStory = () => (
  <PerspectiveComponent
    {...{
      from: { zoom: 1, position: [0, 0, 10], far: 20, near: 0.1 },
      to: { zoom: 30, position: [0, 0, 100], far: 110, near: 90 }
    }}
  />
)
PerspectiveZoomPositionStory.story = { name: 'spring zoom & position' }

/**
 *
 *
 */

const helpCam = new THREE.PerspectiveCamera()

export const PerspectiveMorphPositionStory = () => {
  const fov = 50
  const ß = 50
  helpCam.setFocalLength(200)
  const nextFov = helpCam.fov
  const dist = ({ radius, fov }) =>
    radius / Math.sin((fov * (Math.PI / 180)) / 2)
  const a = dist({ radius: 4, fov: 50 })
  const nextA = dist({ radius: 4, fov: nextFov })
  return (
    <PerspectiveComponent
      {...{
        from: {
          fov,
          position: [0, 0, a],
          far: a + ß / 2,
          near: Math.max(0.1, a - ß)
        },
        to: {
          fov: nextFov,
          position: [0, 0, nextA],
          far: nextA + ß / 2,
          near: Math.max(0.1, nextA - ß)
        },
        config: { duration: 1000 }
      }}
    />
  )
}
PerspectiveMorphPositionStory.story = { name: 'spring fov & position' }

export const PerspectiveMorpFovhPositionStory = () => {
  const aspect = useThree(({ size }) => size.width / size.height)
  const a = 5
  const nextA = 30

  return (
    <PerspectiveComponent
      {...{
        onUpdate(cam: THREE.PerspectiveCamera) {
          cam.position.z
          cam.fov = getFovToFit({ radius: 4, aspect, distance: cam.position.z })
          cam.updateProjectionMatrix()
        },
        from: {
          position: [0, 0, a],
          far: a + 4,
          near: Math.max(0.1, a - 4)
        },
        to: {
          position: [0, 0, nextA],
          far: nextA + 4,
          near: Math.max(0.1, nextA - 4)
        },
        config: { duration: 4000 }
      }}
    />
  )
}
PerspectiveMorpFovhPositionStory.story = { name: 'fov fit to distance' }

export const PerspectiveMorpFovStory = () => {
  return (
    <PerspectiveComponent
      {...{
        onUpdate(cam: THREE.PerspectiveCamera) {
          const distance = getDistanceToFit({ radius: 4, fov: cam.fov })
          cam.position.setZ(distance)
          cam.far = distance + 4
          cam.near = Math.max(0.1, distance - 4)
          cam.updateProjectionMatrix()
        },
        from: { fov: 1 },
        to: { fov: 50 },
        config: { duration: 4000 }
      }}
    />
  )
}
PerspectiveMorpFovStory.story = { name: 'distance fit to fov' }

const HandlerStoryComponent = ({ fov }) => {
  return (
    <>
      <PerspectiveCamera
        {...{
          makeDefault: true,
          fov,
          onUpdate(cam: THREE.PerspectiveCamera) {
            const distance = getDistanceToFit({ radius: 4, fov: cam.fov })
            cam.position.setZ(distance)
            cam.far = distance + 4
            cam.near = Math.max(0.1, distance - 4)
            cam.updateProjectionMatrix()
            console.log(cam.getFocalLength())
          }
        }}
      />
      <Sphere {...{ args: [4] }}>
        <meshNormalMaterial {...{ wireframe: true }} />
      </Sphere>
    </>
  )
}
const HandlerStoryTemplate = (args) => <HandlerStoryComponent {...args} />

export const HandlerStory = HandlerStoryTemplate.bind({})
HandlerStory.args = {
  fov: 50
} as Args
HandlerStory.argTypes = {
  fov: {
    control: { type: 'range', min: 1, max: 100, step: 1 }
  }
}
