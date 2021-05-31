import * as React from 'react'
import * as THREE from 'three'
import { Meta } from '@storybook/react'
import { Box, Html } from '@react-three/drei'
import { Setup, SphereHelper } from '@autopoiese/stories'
import { CameraControls, CameraControlsRef } from './CameraControls'
import { sides, Side } from './constants'
import { fitCamera } from './utils/fitCamera'
import { useControls, buttonGroup, button } from 'leva'
import { isPerspectiveCamera } from './utils/checkTyped'
import {
  getDistanceToFit,
  getRadiusByFovAndDistance,
  getFocalLength,
  getFovByFocalLength
} from './utils/perspectiveHelpers'

export default {
  title: 'Cad/Viewer',
  component: () => <></>
  // decorators: [
  //   (Story) => (
  //     <Setup
  //       {...{
  //         controls: false
  //       }}
  //     >
  //       <Story />
  //     </Setup>
  //   )
  // ]
} as Meta

const box3 = new THREE.Box3().setFromCenterAndSize(
  new THREE.Vector3(),
  new THREE.Vector3(2, 2, 2)
)

const cameraInitialPosition = [5, 5, 5] as const

const DefaultTemplate = () => {
  const controls = React.useRef<CameraControlsRef>()
  const cameraRef = React.useRef<
    THREE.PerspectiveCamera | THREE.OrthographicCamera
  >(null)
  const sizeRef = React.useRef(null)
  const clockRef = React.useRef<THREE.Clock>(null)
  useControls(() => ({
    resetPosition: button(() => controls.current.setTarget(0, 0, 0)),
    fit: button(() =>
      fitCamera({
        object: box3,
        camera: cameraRef.current as any,
        size: sizeRef.current
      })
    ),
    side: buttonGroup(
      sides.reduce(
        (p, side) => ({
          ...p,
          [side]: () => controls.current.rotateTo(...sideMap[side], true)
        }),
        {}
      )
    ),
    'focal length': {
      value: 50,
      min: 8,
      max: 200,
      step: 1,
      onChange: (focalLength) => {
        if (isPerspectiveCamera(cameraRef.current)) {
          const fov = getFovByFocalLength({
            focalLength,
            aspect: sizeRef.current.width / sizeRef.current.height
          })
          const radius = getRadiusByFovAndDistance({
            fov: cameraRef.current.fov,
            distance: controls.current.distance
          })
          cameraRef.current.fov = fov
          controls.current.distance = getDistanceToFit({ radius, fov })

          cameraRef.current.updateProjectionMatrix()
          controls.current.update(clockRef.current.getDelta())
          // cameraRef.current
        }
      }
    },
    'dolly to cursor': {
      value: true,
      onChange: (value) => {
        controls.current && (controls.current.dollyToCursor = value)
      }
    }
  }))
  return (
    <>
      <Setup
        {...{
          camera: {
            position: [...cameraInitialPosition],
            near: 0.1,
            far: 10000
          },
          onCreated({ camera, size, clock }) {
            cameraRef.current = camera
            sizeRef.current = size
            clockRef.current = clock
          }
        }}
      >
        <CameraControls {...{ ref: controls }} />
        <Box {...{ args: [2, 2, 2] }}>
          <meshNormalMaterial />
        </Box>
      </Setup>
    </>
  )
}

export const DefaultStory = DefaultTemplate.bind({})
DefaultStory.story = { name: 'default' }

const deg = Math.PI / 180

const sideMap: { [key in Side]: [number, number] } = {
  front: [0, 90 * deg],
  top: [0, 0],
  right: [90 * deg, 90 * deg],
  bottom: [0, 180 * deg],
  left: [-90 * deg, 90 * deg],
  back: [180 * deg, 90 * deg]
}
