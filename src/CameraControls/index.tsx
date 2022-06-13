import * as React from 'react'
import * as THREE from 'three'
import {
  useThree,
  useFrame,
  ReactThreeFiber,
  applyProps
} from '@react-three/fiber'
import CameraControlsDef from 'camera-controls'
import { Side } from '../constants'

// abstract class AbstractCameraControls extends CameraControlsDef {
//   public abstract _spherical: CameraControlsDef['_spherical']
//   public abstract _sphericalEnd: CameraControlsDef['_sphericalEnd']
//   public abstract _yAxisUpSpaceInverse: CameraControlsDef['_yAxisUpSpaceInverse']
// }

type SideMap = { [key in Side]: [number, number] }

const deg = Math.PI / 180

const sideMap: SideMap = {
  front: [0, 90 * deg],
  top: [0, 0],
  right: [90 * deg, 90 * deg],
  bottom: [0, 180 * deg],
  left: [-90 * deg, 90 * deg],
  back: [180 * deg, 90 * deg]
}

// // @ts-ignore
class CameraControlsImpl extends CameraControlsDef {
  static SIDE = sideMap
  SIDE = sideMap

  get spherical() {
    return this['_spherical']
  }
  get sphericalEnd() {
    return this._sphericalEnd
  }
  set sphericalEnd(sphericalEnd) {
    this._sphericalEnd = sphericalEnd
  }
  get yAxisUpSpaceInverse() {
    return this._yAxisUpSpaceInverse
  }

  set yAxisUpSpaceInverse(up) {
    this._yAxisUpSpaceInverse = up
  }

  get type() {
    return this._camera.type
  }
  get camera() {
    return this._camera
  }
  set camera(camera) {
    this._camera = camera
  }

  getZoom() {
    return this._zoom
  }
}

CameraControlsImpl.install({ THREE })

interface CameraControlsStatics {
  ACTION: typeof CameraControlsImpl['ACTION']
  SIDE: SideMap
}

export type CameraControlsRef = CameraControlsImpl

// type CameraControlsMouseActions =typeof CameraControlsImpl["ACTION"]["DOLLY" | ""]

export type CameraControlsProps = ReactThreeFiber.Object3DNode<
  CameraControlsImpl,
  typeof CameraControlsImpl
> & {
  fitInitial?: boolean | THREE.Object3D
  regress?: boolean
  camera?: THREE.Camera
  mouseButtons?: Partial<CameraControlsImpl['mouseButtons']>
}

interface UseCameraControls extends CameraControlsStatics {
  (args?: CameraControlsProps): CameraControlsImpl
}

export const useCameraControls: UseCameraControls = ({
  camera,
  fitInitial,
  regress,
  ...props
} = {}) => {
  const invalidate = useThree(({ invalidate }) => invalidate)
  const defaultCamera = useThree(({ camera }) => camera)
  const scene = useThree(({ scene }) => scene)
  const gl = useThree(({ gl }) => gl)
  const performance = useThree(({ performance }) => performance)
  const explCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera =
    (camera as any) || defaultCamera

  const controls = React.useMemo(() => {
    const controls = new CameraControlsImpl(explCamera, gl.domElement)
    props && applyProps(controls as any, props as any)
    return controls
  }, [explCamera])

  useFrame(({ scene, camera, gl }, delta) => {
    if (controls) {
      const hasControlsUpdated = controls.update(delta)
      if (hasControlsUpdated) gl.render(scene, camera)
    }
  })

  React.useEffect(() => {
    const callback = () => {
      invalidate()
      if (regress) performance.regress()
    }
    controls.addEventListener('control', callback)
    return () => {
      controls.removeEventListener('control', callback)
      controls.dispose()
    }
  }, [regress, controls, invalidate])

  React.useLayoutEffect(() => {
    if (fitInitial) {
      const obj = fitInitial instanceof THREE.Object3D ? fitInitial : scene
      controls.fitTo(obj, true)
    }
  }, [])
  return controls
}

useCameraControls['ACTION'] = CameraControlsImpl.ACTION
useCameraControls['SIDE'] = sideMap

const CameraControlsComponent = React.forwardRef<
  CameraControlsRef,
  CameraControlsProps
>(({ fitInitial, regress, camera, ...props }, ref) => {
  // const invalidate = useThree(({ invalidate }) => invalidate)
  // const defaultCamera = useThree(({ camera }) => camera)
  // const scene = useThree(({ scene }) => scene)
  // const gl = useThree(({ gl }) => gl)
  // const performance = useThree(({ performance }) => performance)
  // const explCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera =
  //   (camera as any) || defaultCamera

  // const controls = React.useMemo(() => {
  //   const controls = new CameraControlsImpl(explCamera, gl.domElement)
  //   return controls
  // }, [explCamera])

  // useFrame(({ scene, camera, gl }, delta) => {
  //   if (controls) {
  //     const hasControlsUpdated = controls.update(delta)
  //     if (hasControlsUpdated) gl.render(scene, camera)
  //   }
  // })

  // React.useEffect(() => {
  //   const callback = () => {
  //     invalidate()
  //     if (regress) performance.regress()
  //   }
  //   controls.addEventListener('control', callback)
  //   return () => {
  //     controls.removeEventListener('control', callback)
  //     controls.dispose()
  //   }
  // }, [regress, controls, invalidate])

  // React.useLayoutEffect(() => {
  //   if (fitInitial) {
  //     const obj = fitInitial instanceof THREE.Object3D ? fitInitial : scene
  //     controls.fitTo(obj, true)
  //   }
  // }, [])
  const controls = useCameraControls({ fitInitial, regress, camera, ...props })
  return <primitive {...{ ...props, ref, object: controls }} />
})

CameraControlsComponent['ACTION'] = CameraControlsImpl.ACTION
CameraControlsComponent['SIDE'] = sideMap

export const CameraControls = CameraControlsComponent as typeof CameraControlsComponent &
  CameraControlsStatics
