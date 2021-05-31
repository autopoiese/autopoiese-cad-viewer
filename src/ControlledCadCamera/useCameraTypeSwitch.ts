import * as React from 'react'
import * as THREE from 'three'
import { CameraControlsRef } from '../CameraControls'
import { useThree } from '@react-three/fiber'
import { useSpring, useSpringRef } from '@react-spring/three'
import { isOrthographicCamera, isPerpectiveCamera } from '../lib/utils'

const box3 = new THREE.Box3()
const sphere = new THREE.Sphere()
const target = new THREE.Vector3()
const origin = new THREE.Vector3()
const DEG90 = Math.PI * 0.5
const DEG180 = Math.PI

type Props = {
  controls: CameraControlsRef
  camera: THREE.PerspectiveCamera
}

export const useCameraTypeSwitch = (
  { controls, camera }: Props,
  deps: ['OrthographicCamera' | 'PerspectiveCamera']
) => {
  const invalidate = useThree(({ invalidate }) => invalidate)
  const set = useThree(({ set }) => set)
  const setDefaultCamera = (camera) => set({ camera })
  const ref = useSpringRef()
  const prevZoom = React.useRef<number>()
  const initDistance = React.useRef<number>()
  const initDistanceOrth = React.useRef<number>()
  const unitDistanceRatio = React.useRef<
    { [key in 'ratio' | 'orthRatio']: number }
  >()
  const ratio = React.useRef<number>(1)

  useSpring(
    {
      ref,
      fov: 50,
      onChange: {
        fov: ({ value }, spring) => {
          const { from, to } = spring.get()
          const diff = to - from
          const per = ((value - 0.055) / diff) * 100
          const p = to > from ? per : 100 + per
          const n = 100 - p
          let factor
          const orthRatio = unitDistanceRatio.current?.orthRatio || 1
          const persRatio = unitDistanceRatio.current?.ratio || 1
          if (to > from) {
            factor = orthRatio * (n / 100) + persRatio * (p / 100)
          } else {
            factor = persRatio * (n / 100) + orthRatio * (p / 100)
          }
          camera.fov = value
          camera.updateProjectionMatrix()
          const azimuth = controls.azimuthAngle
          const polar = controls.polarAngle
          const unitDistance = controls.getDistanceToFitBox(1, 1, 1) * factor
          const distance = unitDistance * ratio.current
          controls.setTarget(target.x, target.y, target.z, false)
          controls.rotateTo(azimuth, polar, false)
          controls.sphericalEnd.radius = distance

          const maxDistance = distance + 1500
          const minDistance = Math.max(distance - 300, 0.01)

          controls.spherical.radius = controls.sphericalEnd.radius
          camera.position
            .setFromSpherical(controls.spherical)
            .applyQuaternion(controls.yAxisUpSpaceInverse)
            .add(target)

          camera.far = maxDistance
          camera.near = minDistance
          // controls.maxDistance = maxDistance
          // controls.minDistance = minDistance
          camera.updateProjectionMatrix()
          // camera.updateMatrix()
          // console.log(distance, maxDistance, minDistance)
          invalidate()
        }
      },
      config: {
        easing: (t) =>
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
      }
    },
    deps
  )
  React.useLayoutEffect(() => {
    Object.values(instances).forEach(({ controls }) => {
      const { azimuth, polarAngle } = controls
      if (isPerpectiveCamera(controls.camera)) {
        controls.camera.fov = 0.055
        controls.camera.far = 100000
        controls.camera.near = 0.01
        controls.camera.updateProjectionMatrix()
        controls.fitToBox(box, false, padding)
        const orth = {
          distance: controls.distance,
          distanceToFit: controls.getDistanceToFitBox(1, 1, 1)
        }
        initDistanceOrth.current = controls.distance
        controls.camera.fov = 50
        controls.camera.updateProjectionMatrix()
        controls.fitToBox(box, false, padding)
        const distanceToFit = controls.getDistanceToFitBox(1, 1, 1)
        unitDistanceRatio.current = {
          orthRatio: orth.distance / orth.distanceToFit,
          ratio: controls.distance / distanceToFit
        }
        initDistance.current = controls.distance
      } else if (isOrthographicCamera(controls.camera)) {
        controls.fitToBox(box, false, padding)
        prevZoom.current = controls.getZoom()
      }
      controls.rotateTo(azimuth || 0, polarAngle || 0, false)
    })
  }, [])

  const switchHandler = async ({
    camera,
    controls
  }: {
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
    controls: CameraControlsRef
  }) => {
    const azimuth = previous.controls.azimuthAngle
    const polar = previous.controls.polarAngle
    if (isOrthographicCamera(camera)) {
      if (!ref.fov.animation.changed) {
        // get current ratio
        ratio.current = previous.controls.distance / initDistance.current
      }
      controls.zoomTo(prevZoom.current / ratio.current, false)
      controls.rotateTo(azimuth || 0, polar || 0, false)

      await Promise.all(ref.start())
      setDefaultCamera(camera)
      invalidate()

      // from orthographic to perspective
    } else if (isPerpectiveCamera(camera)) {
      const zoom = previous.controls.getZoom()
      const nextRatio = prevZoom.current / zoom // <=== FALSCH
      ratio.current = nextRatio

      const distance = initDistanceOrth.current * nextRatio
      camera.fov = 0.055
      camera.updateProjectionMatrix()
      //controls.distance = distance;
      controls.dollyTo(distance, false)
      controls.rotateTo(azimuth || 0, polar || 0, false)
      controls.setTarget(target.x, target.y, target.z, false)
      setDefaultCamera(camera)
      ref.start({ from: { fov: 0.055 }, to: { fov: 50 } })
      invalidate()
    }
  }
}
