import * as THREE from 'three'

export const getCameraRail = ({ camera }: { camera: THREE.Camera }) =>
  camera.rotation.toVector3().normalize()
