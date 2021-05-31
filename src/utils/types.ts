import * as THREE from 'three'
import { ReactThreeFiber } from '@react-three/fiber'

export type Point =
  | ReactThreeFiber.Vector2
  | ReactThreeFiber.Vector3
  | { x: number; y: number; z?: number }

export type ObjectToFit =
  | THREE.Object3D
  | THREE.Box3
  | THREE.Sphere
  | Point[]
  | THREE.BufferGeometry
