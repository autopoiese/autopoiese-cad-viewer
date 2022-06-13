import * as THREE from 'three'
import * as React from 'react'
import { useThree } from '@react-three/fiber'
import { getBox } from './getBox'
import { ObjectToFit } from './types'
import { getFovToFit } from './perspectiveHelpers'
import { isOrthographicCamera, isPerspectiveCamera } from './checkTyped'

type FitArgs = {
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  controls?
  object: ObjectToFit
  size
}

const center = new THREE.Vector3()

export const fitCamera: (params: FitArgs) => void = ({
  camera,
  object,
  size: { width, height }
}) => {
  const box3 = getBox(object)
  box3.getCenter(center)
  const { min, max } = box3
  const minDis = Math.sqrt(min.x ** 2 + min.y ** 2 + min.z ** 2)
  const maxDis = Math.sqrt(max.x ** 2 + max.y ** 2 + max.z ** 2)
  const radius = minDis > maxDis ? minDis : maxDis
  const aspect = width / height

  if (isOrthographicCamera(camera)) {
    camera.zoom = aspect > 1 ? height / (radius * 2) : width / (radius * 2)
    console.log(camera.zoom, min, max)
  } else if (isPerspectiveCamera(camera)) {
    const distance = center.distanceTo(camera.position)
    const fov = getFovToFit({
      distance,
      aspect,
      radius
    })
    camera.fov = fov
  }
  camera.lookAt(center.x, center.y, center.z)
  camera.updateProjectionMatrix()
}

export const useFitCamera: (params?: Partial<FitArgs>) => void = (arg) => {
  const mainCamera = useThree(({ camera }) => camera)
  const mainSize = useThree(({ size }) => size)
  const scene = useThree(({ scene }) => scene)
  const camera = arg?.camera || mainCamera
  const object = arg?.object || scene
  const size = arg?.size || mainSize
  React.useEffect(() => {
    fitCamera({ camera, size, object })
  }, [camera, object, size])
}
