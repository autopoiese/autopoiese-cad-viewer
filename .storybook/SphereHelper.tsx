import * as React from 'react'
import * as THREE from 'three'
import '@react-three/fiber'

export const SphereHelper = ({ object }: { object: THREE.Object3D }) => {
  const sphere = React.useMemo(() => {
    if (object) {
      const sphere = new THREE.Sphere()
      new THREE.Box3().setFromObject(object).getBoundingSphere(sphere)
      return sphere
    }
  }, [object])
  return (
    <mesh>
      <sphereBufferGeometry {...{ args: [sphere.radius, 32, 32] }} />
      <meshBasicMaterial {...{ wireframe: true, color: 'black' }} />
    </mesh>
  )
}
