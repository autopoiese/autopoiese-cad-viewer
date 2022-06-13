import * as React from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
/**
 * https://threejs.org/docs/index.html#api/en/cameras/ArrayCamera
 *
 */

type UseSplitViewProps = {
  amount: 1 | 2 | 4 | 6 | 8 | 10
  aspect?: number
}

const useSplitView = (props: UseSplitViewProps) => {
  const AMOUNT = props?.amount
  const size = useThree(({ size }) => size)
  const ASPECT_RATIO = props?.aspect || size.width / size.height

  const WIDTH = (size.width / AMOUNT) * window.devicePixelRatio
  const HEIGHT = (size.height / AMOUNT) * window.devicePixelRatio

  const cameras = React.useMemo(() => {
    const cameras = []
    for (let y = 0; y < AMOUNT; y++) {
      for (let x = 0; x < AMOUNT; x++) {
        const subcamera = new THREE.PerspectiveCamera(40, ASPECT_RATIO, 0.1, 10)
        subcamera['viewport'] = new THREE.Vector4(
          Math.floor(x * WIDTH),
          Math.floor(y * HEIGHT),
          Math.ceil(WIDTH),
          Math.ceil(HEIGHT)
        )
        subcamera.position.x = x / AMOUNT - 0.5
        subcamera.position.y = 0.5 - y / AMOUNT
        subcamera.position.z = 1.5
        subcamera.position.multiplyScalar(2)
        subcamera.lookAt(0, 0, 0)
        subcamera.updateMatrixWorld()
        cameras.push(subcamera)
      }
    }
    return new THREE.ArrayCamera(cameras)
  }, [])
}
