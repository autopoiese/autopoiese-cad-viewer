import { ReactThreeFiber } from '@react-three/fiber'
import * as THREE from 'three'
import { toVector3 } from './toVector'
import { ObjectToFit, Point } from './types'

export const getBox = (input: ObjectToFit): THREE.Box3 => {
  if (input instanceof THREE.Box3) return input
  if (input instanceof THREE.Sphere) {
    const target = new THREE.Box3()
    return input.getBoundingBox(target), target
  }
  if (input instanceof THREE.BufferGeometry)
    return input.boundingBox || (input.computeBoundingBox(), input.boundingBox)

  if (Array.isArray(input)) return getBoxFromPoints(input)
  if (input instanceof THREE.Object3D)
    return new THREE.Box3().setFromObject(input)
  return new THREE.Box3()
}

const getBoxFromPoints = (points: Point[]): THREE.Box3 => {
  return new THREE.Box3().setFromPoints(points.map<THREE.Vector3>(toVector3))
}
