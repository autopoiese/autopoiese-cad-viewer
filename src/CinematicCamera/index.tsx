import * as React from 'react'
import * as THREE from 'three'
import { extend, useThree, ReactThreeFiber } from '@react-three/fiber'
import mergeRefs from 'react-merge-refs'
import { CinematicCamera as CinematicCameraImpl } from 'three-stdlib/cameras/CinematicCamera'

extend({ CinematicCamera: CinematicCameraImpl })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      cinematicCamera: ReactThreeFiber.Object3DNode<
        CinematicCameraImpl,
        typeof CinematicCameraImpl
      >
    }
  }
}

export type CinematicCameraRef = CinematicCameraImpl

export type CinematicCameraProps = ReactThreeFiber.Object3DNode<
  CinematicCameraImpl,
  typeof CinematicCameraImpl
> & { makeDefault?: boolean; focalLength?: number }

export const CinematicCamera = React.forwardRef<
  CinematicCameraRef,
  CinematicCameraProps
>(
  (
    {
      makeDefault = false,
      fov = 60,
      near = 1,
      far = 1000,
      position = [2, 1, 500],
      focalLength = 5,
      ...props
    },
    ref
  ) => {
    const set = useThree(({ set }) => set)
    const mainCamera = useThree(({ camera }) => camera)
    const size = useThree(({ size }) => size)
    const cameraRef = React.useRef<CinematicCameraImpl>(null)

    React.useLayoutEffect(() => {
      const { current: cam } = cameraRef
      console.log('set focal length')
      if (cam) cam.setFocalLength(focalLength)
    }, [focalLength])

    React.useLayoutEffect(() => {
      const { current: cam } = cameraRef
      if (cam) {
        cam.aspect = size.width / size.height
        cam.updateProjectionMatrix()
      }
    }, [size])

    React.useLayoutEffect(() => {
      if (makeDefault && cameraRef.current) {
        const oldCam = mainCamera
        set(() => ({
          camera: cameraRef.current!
        }))
        return () =>
          set(() => ({
            camera: oldCam
          }))
      }
    }, [cameraRef, makeDefault, set])
    return (
      <cinematicCamera
        {...{
          near,
          far,
          fov,
          position,
          ...props,
          onUpdate: (cam) => cam.updateProjectionMatrix(),
          ref: mergeRefs([ref, cameraRef])
        }}
      />
    )
  }
)
