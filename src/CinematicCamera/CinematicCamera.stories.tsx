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
import { Setup, CameraViewer } from '@autopoiese/stories'
import { CameraControls, CameraControlsRef } from '../CameraControls'

export default {
  title: 'Cad/Viewer/CinematicCamera',
  component: CinematicCamera,
  decorators: [
    (story) => (
      <Setup {...{ controls: false }}>
        {story()}
        <Box {...{ args: [15, 15, 15] }}>
          <meshNormalMaterial />
        </Box>
        <CameraViewer />
      </Setup>
    ),
    withKnobs
  ]
} as Meta

const Template = ({ id, focalLength, near, position, ...args }) => {
  const onMount = React.useCallback((camera) => {
    if (camera) {
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    }
  }, [])
  return (
    <CinematicCamera
      {...{ ref: onMount, makeDefault: true, focalLength, position, near }}
    />
  )
}

export const Wide = Template.bind({})
Wide.args = {
  focalLength: 2,
  near: 0.01,
  position: [25, 25, 25]
}

export const Tele = Template.bind({})
Tele.args = {
  focalLength: 200,
  position: [250, 250, 250]
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
