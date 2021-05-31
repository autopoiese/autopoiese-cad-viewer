import * as THREE from 'three'
import { MathUtils } from 'three'

/**
 *  get target to position line, need a fixpoint
 *
 */

const fixpoint = new THREE.Vector3()

const fitPerspective = ({ object, camera, size }) => {}

const getCurrentSphere = ({ camera }) => {
  const center = camera
}

/**
 *
 * https://stackoverflow.com/questions/22500214/calculate-camera-fov-distance-for-sphere/22501791#22501791
 *
 */

export const getDistanceToFit = ({
  radius,
  fov
}: { [key in 'radius' | 'fov']: number }): number =>
  radius / Math.sin((fov * (Math.PI / 180)) / 2)

/**
 *
 * https://stackoverflow.com/questions/44849861/how-to-adjust-a-three-js-perspective-cameras-field-of-view-to-fit-a-sphere
 *
 */

export const getFovToFit = ({
  radius,
  aspect,
  distance
}: { [key in 'radius' | 'aspect' | 'distance']: number }): number => {
  var vFOV = 2 * Math.asin(radius / distance)
  // get the project's aspect ratio to calculate a horizontal fov
  // more trig to calculate a horizontal fov, used to fit a sphere horizontally
  var hFOV = 2 * Math.atan(Math.tan(vFOV / 2) / aspect)
  return Math.max(hFOV, vFOV) * (180 / Math.PI)
}

export const getRadiusByFovAndDistance = ({ fov, distance }) =>
  distance * Math.sin((fov * (Math.PI / 180)) / 2)

export const getFocalLength = ({
  fov,
  aspect,
  filmGauge = 35
}: {
  fov: number
  aspect: number
  filmGauge?: number
}) => {
  const vExtentSlope = Math.tan(MathUtils.DEG2RAD * 0.5 * fov)
  const filmHeight = filmGauge / Math.max(aspect, 1)
  return (0.5 * filmHeight) / vExtentSlope
}

export const getFovByFocalLength = ({
  focalLength,
  aspect,
  filmGauge = 35
}: {
  focalLength: number
  aspect: number
  filmGauge?: number
}) => {
  const filmHeight = filmGauge / Math.max(aspect, 1)

  /** see {@link http://www.bobatkins.com/photography/technical/field_of_view.html} */

  const vExtentSlope = (0.5 * filmHeight) / focalLength
  return MathUtils.RAD2DEG * 2 * Math.atan(vExtentSlope)
}
