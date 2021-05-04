import * as React from 'react'
import * as THREE from 'three'
import { useThree, ReactThreeFiber } from '@react-three/fiber'

import { CinematicCamera as CinematicCameraImpl } from 'three-stdlib/cameras/CinematicCamera'

export type CinematicCameraRef = CinematicCameraImpl

export type CinematicCameraProps = ReactThreeFiber.Object3DNode<
  CinematicCameraImpl,
  typeof CinematicCameraImpl
> & { makeDefault?: boolean; focalLength?: number }

export const useCinematicCamera = (
  props: CinematicCameraProps
): CinematicCameraRef => {
  const {
    focalLength = 5,
    makeDefault = false,
    fov = 60,
    near = 0.1,
    far = 1000,
    aspect = undefined
  } = props || {}
  const set = useThree(({ set }) => set)
  const mainCamera = useThree(({ camera }) => camera)
  const size = useThree(({ size }) => size)
  const camera = React.useMemo(() => {
    const cinematicCamera = new CinematicCameraImpl(
      fov,
      aspect || size.width / size.height,
      near,
      far
    )
    return cinematicCamera
  }, [])
  React.useLayoutEffect(() => {
    console.log('set focal length')
    !focalLength && camera.setFocalLength(focalLength)
  }, [focalLength])

  React.useLayoutEffect(() => {
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
  }, [size])

  React.useLayoutEffect(() => {
    if (makeDefault) {
      const oldCam = mainCamera
      set(() => ({ camera }))
      return () =>
        set(() => ({
          camera: oldCam
        }))
    }
  }, [makeDefault, set])
  return camera
}

export const CinematicCamera = React.forwardRef<
  CinematicCameraRef,
  CinematicCameraProps
>((props, ref) => {
  const camera = useCinematicCamera(props)
  React.useImperativeHandle(ref, () => camera)
  const { focalLength, makeDefault, ...objectProps } = props
  return (
    <primitive
      {...{
        ...objectProps,
        object: camera,
        onUpdate: (cam) => cam.updateProjectionMatrix()
      }}
    />
  )
})
