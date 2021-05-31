import * as THREE from 'three'
import { ObjectToFit } from './types'
import { toVector3 } from './toVector'

export const getSphere = (input: ObjectToFit): THREE.Sphere => {
  if ((input as THREE.Sphere) instanceof THREE.Sphere)
    return input as THREE.Sphere
  if ((input as THREE.BufferGeometry).isBufferGeometry)
    return (
      (input as THREE.BufferGeometry).boundingSphere ||
      ((input as THREE.BufferGeometry).computeBoundingSphere(),
      (input as THREE.BufferGeometry).boundingSphere)
    )
  if ((input as THREE.Box3).isBox3) {
    return (input as THREE.Box3).getBoundingSphere(undefined)
  }
  if (Array.isArray(input))
    return new THREE.Sphere().setFromPoints(input.map(toVector3))
  if ((input as THREE.Object3D).isObject3D)
    return new THREE.Box3()
      .setFromObject(input as THREE.Object3D)
      .getBoundingSphere(undefined)
  return new THREE.Sphere()
}
