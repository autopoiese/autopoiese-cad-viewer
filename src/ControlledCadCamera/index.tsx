import * as React from 'react'
import { useThree } from '@react-three/fiber'
import {
  CameraControls,
  CameraControlsRef,
  CamereaControlProps
} from '../CameraControls'
import {
  CinematicCamera,
  CinematicCameraProps,
  CinematicCameraRef
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
  const camera = React.useRef<CinematicCameraRef>(null)
  const controls = React.useRef<CameraControlsRef>(null)
  const scene = useThree(({ scene }) => scene)
  React.useImperativeHandle(ref, () => ({
    camera: camera.current,
    controls: controls.current
  }))
  React.useMemo(() => {
    console.log(props)
  }, [props.cameraProps])
  return (
    <React.Fragment>
      <CinematicCamera {...{ ...props.cameraProps, ref: camera }} />
      <CameraControls
        {...{ ...props.controlProps, camera: camera.current, ref: controls }}
      />
    </React.Fragment>
  )
})
