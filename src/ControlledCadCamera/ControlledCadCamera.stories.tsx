import * as React from 'react'
import * as THREE from 'three'
import { Meta } from '@storybook/react'
import { withKnobs, number } from '@storybook/addon-knobs'
import { Box } from '@react-three/drei'
import { Setup, CameraHelper } from '../../.storybook/Setup'
import { ControlledCadCamera, ControlledCadCameraRef } from './index'
import { a, useSpring, useSpringRef } from '@react-spring/three'
import { useThree } from '@react-three/fiber'

export default {
  title: 'ControlledCadCamera',
  component: ControlledCadCamera,
  decorators: [
    withKnobs,
    (story) => (
      <Setup
        {...{
          controls: false,
          object: null
        }}
      >
        {story()}
      </Setup>
    )
  ]
} as Meta

const Component = (props) => {
  const scene = useThree(({ scene }) => scene)
  return (
    <React.Fragment>
      <Box>
        <meshNormalMaterial />
      </Box>
      <ControlledCadCamera
        {...{
          cameraProps: {
            makeDefault: true
          },
          controlProps: {
            fitInitial: true
          }
        }}
      />
    </React.Fragment>
  )
}

const Template = (args) => <Component {...args} />

const SpringComponent = (props) => {
  const ref = React.useRef<ControlledCadCameraRef>()
  const box = React.useRef<THREE.Mesh>()
  const scene = useThree(({ scene }) => scene)
  const spring = useSpringRef()
  const reverse = React.useRef(false)
  const { focalLength } = useSpring({
    ref: spring,
    from: { focalLength: 2 },
    to: { focalLength: 200 },
    config: { duration: 2000 },
    loop: { reverse: true },
    onChange: ({ value: { focalLength } }) => {
      ref.current?.camera.setFocalLength(focalLength)
      // ref.current?.controls.fitToBox(scene, false)
    },
    onResolve: () => {
      reverse.current = !reverse.current
    }
  })
  React.useLayoutEffect(() => {
    if (ref.current.controls) {
      const sphere = new THREE.Sphere(new THREE.Vector3(), 0.5)
      console.log('FIT', ref.current.controls)
      ref.current.controls.fitToSphere(sphere, true)
    }
  }, [])
  return (
    <React.Fragment>
      <Box
        {...{
          ref: box,
          onClick: async () => {
            spring.start()
          }
        }}
      >
        <meshNormalMaterial />
      </Box>
      <ControlledCadCamera
        {...{
          ref,
          cameraProps: {
            makeDefault: true
            // focalLength
          },
          controlProps: {
            fitInitial: box.current
          }
        }}
      />
      <CameraHelper />
    </React.Fragment>
  )
}

export const DefaultStory = Template.bind({})
DefaultStory.story = { name: 'Default' }

export const SpringStory = () => <SpringComponent />
SpringStory.story = { name: 'Spring' }
