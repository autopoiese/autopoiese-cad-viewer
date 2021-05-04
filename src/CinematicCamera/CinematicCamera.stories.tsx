import * as React from 'react'
import * as THREE from 'three'
import { Meta } from '@storybook/react'
import { withKnobs, number } from '@storybook/addon-knobs'
import { Box, PerspectiveCamera } from '@react-three/drei'
import { animated, useSpring, useSpringRef } from '@react-spring/three'
import {
  CinematicCamera,
  CinematicCameraProps,
  CinematicCameraRef
} from './index'
import { Setup } from '../../.storybook/Setup'
import { CameraControls, CameraControlsRef } from '../CameraControls'

export default {
  title: 'CinematicCamera',
  component: CinematicCamera,
  decorators: [
    (story) => (
      <Setup {...{ controls: false }}>
        {story()}
        <Box {...{ args: [20, 20, 20] }}>
          <meshNormalMaterial />
        </Box>
      </Setup>
    ),
    withKnobs
  ]
} as Meta

const Template = ({ focalLength, position }) => {
  const camera = React.useRef<CinematicCameraRef>(null)
  // const controls = React.useRef<CameraControlsRef>(null)
  // React.useEffect(() => {
  //   if (controls.current) {
  //     console.log('CONTROLS READY')
  //     controls.current.fitToSphere(
  //       new THREE.Sphere(new THREE.Vector3(), 10),
  //       true
  //     )
  //   }
  // }, [controls.current])
  return (
    <React.Fragment>
      <CinematicCamera
        {...{ ref: camera, makeDefault: true, focalLength, position }}
      />
      {/* {camera.current && (
        <CameraControls {...{ ref: controls, camera: camera.current }} />
      )} */}
    </React.Fragment>
  )
}

export const Wide = Template.bind({})
Wide.args = {
  focalLength: 2,
  near: 0.01,
  position: [15, 15, 15]
}

export const Tele = Template.bind({})
Tele.args = {
  focalLength: 200,
  position: [150, 150, 150]
}

const AnimatedCinematicCamera = animated(CinematicCamera)

const Component = () => {
  const ref = React.useRef<CinematicCameraRef>(null)
  const spring = useSpringRef()
  useSpring({
    ref: spring,
    from: { focalLength: 2 },
    to: { focalLength: 200 },
    loop: { reverse: true },
    onChange: ({ value: { focalLength } }) => {
      ref.current?.setFocalLength(focalLength)
    }
  })

  React.useEffect(() => {
    if (ref.current) spring.start()
    return () => {
      spring.stop()
    }
  }, [])
  return (
    <React.Fragment>
      <AnimatedCinematicCamera
        {...{
          ref,
          makeDefault: true,
          position: [0, 0, 150]
        }}
      />
      {ref.current && <CameraControls {...{ camera: ref.current }} />}
    </React.Fragment>
  )
}

export const Spring = () => {
  const fromFocalLength = number('from focalLength', 2)
  const toFocalLength = number('to focalLength', 200)
  return <Component />
}
