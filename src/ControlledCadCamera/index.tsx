import * as React from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import {
  CameraControls,
  CameraControlsRef,
  CamereaControlProps
} from '../CameraControls'
import {
  CinematicCameraProps,
  CinematicCameraRef,
  useCinematicCamera
} from '../CinematicCamera'

export type ControlledCadCameraRef = {
  camera: CinematicCameraRef
  controls: CameraControlsRef
}

export type ControlledCadCameraProps = {
  cameraProps?: CinematicCameraProps
  controlProps?: Omit<CamereaControlProps, 'ref'>
}

export const ControlledCadCamera = React.forwardRef<
  ControlledCadCameraRef,
  ControlledCadCameraProps
>((props, ref) => {
  const size = useThree(({ size }) => size)
  const cinematicCamera = useCinematicCamera(props.cameraProps)
  const controls = React.useRef<CameraControlsRef>(null)
  const scene = useThree(({ scene }) => scene)
  React.useImperativeHandle(ref, () => ({
    camera: cinematicCamera,
    controls: controls.current,
    fitToScene: (
      enableTransition,
      padding = {
        paddingLeft: 1,
        paddingRight: 1,
        paddingTop: 1,
        paddingBottom: 1
      }
    ) => {
      controls.current.fitToBox(scene, enableTransition, padding)
    }
  }))
  return (
    <React.Fragment>
      <primitive
        {...{
          // ...props.cameraProps,
          onUpdate: (cam) => cam.updateProjectionMatrix(),
          object: cinematicCamera
        }}
      />
      <CameraControls
        {...{ ...props.controlProps, camera: cinematicCamera, ref: controls }}
      />
    </React.Fragment>
  )
})
