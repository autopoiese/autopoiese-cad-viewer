import * as THREE from 'three'
import { Point } from './types'

export const toVector3 = (point: Point): THREE.Vector3 => {
  if (isVector3(point)) return point
  if (isVector2(point)) return new THREE.Vector3(point.x, point.y)
  if (typeof point === 'number') return new THREE.Vector3(point, point, point)
  if (isVectorArray(point))
    return new THREE.Vector3(point[0] || 0, point[1] || 0, point[2] || 0)
  if (isVectorObject(point))
    return new THREE.Vector3(point.x, point.y, point.z || 0)
}

export const toVector3Array = (point: Point): [number, number, number] => {
  if (isVector3(point)) return point.toArray()
  if (isVector2(point)) return [...point.toArray(), 0]
  if (isVectorArray(point)) return [point[0], point[1], point[2] || 0]
}

const isVector3 = (def): def is THREE.Vector3 =>
  def && (def as THREE.Vector3).isVector3

const isVector2 = (def): def is THREE.Vector2 =>
  def && (def as THREE.Vector2).isVector2

const isVectorObject = (def): def is VectorObject =>
  def &&
  typeof (def as VectorObject).x === 'number' &&
  typeof (def as VectorObject).y === 'number'

const isVectorArray = (def): def is VectorArray =>
  def && typeof def[0] === 'number' && typeof def[1] === 'number'

type VectorArray = [number, number] | Vector3Array

type VectorObject = { x: number; y: number; z?: number }

type Vector2Object = { [key in 'x' | 'y']: number }
type Vector3Object = { [key in 'x' | 'y' | 'z']: number }

type Vector3Array = [number, number, number]
