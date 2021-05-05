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
