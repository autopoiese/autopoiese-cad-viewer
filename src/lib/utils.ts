import * as THREE from 'three'

export function isOrthographicCamera(
  def: THREE.Camera
): def is THREE.OrthographicCamera {
  return (def as THREE.OrthographicCamera).isOrthographicCamera
}

export function isPerpectiveCamera(
  def: THREE.Camera
): def is THREE.PerspectiveCamera {
  return (def as THREE.PerspectiveCamera).isPerspectiveCamera
}

export const getDiameter = (
  object: THREE.Object3D | THREE.BufferGeometry | THREE.Box3
) => {
  let radius
  if (object instanceof THREE.BufferGeometry) {
    object.computeBoundingSphere()
    radius = (object.boundingSphere as THREE.Sphere).radius
  } else if (object instanceof THREE.Box3) {
    const boundingSphere = new THREE.Sphere()
    object.getBoundingSphere(boundingSphere)
    radius = boundingSphere.radius
  } else {
    radius = getBoundingSphere(object).radius
  }
  if (radius !== Infinity) {
    return radius * 2
  }
  return 0
}

export const getBoundingBox = (object: THREE.Object3D): THREE.Box3 =>
  new THREE.Box3().setFromObject(object)

export const getBoundingSphere = (object: THREE.Object3D): THREE.Sphere => {
  const sphere = new THREE.Sphere()
  getBoundingBox(object).getBoundingSphere(sphere)
  return sphere
}
