import * as React from 'react'
import * as THREE from 'three'
import { useThree, useFrame, ReactThreeFiber } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import CameraControlsDef from 'camera-controls'

abstract class AbstractCameraControls extends CameraControlsDef {
  public abstract _spherical: CameraControlsDef['_spherical']
  public abstract _sphericalEnd: CameraControlsDef['_sphericalEnd']
  public abstract _yAxisUpSpaceInverse: CameraControlsDef['_yAxisUpSpaceInverse']
}

class CameraControlsImpl
  extends CameraControlsDef
  implements AbstractCameraControls {
  public _spherical = this._spherical
  public _sphericalEnd = this._sphericalEnd
  public _yAxisUpSpaceInverse = this._yAxisUpSpaceInverse

  get type() {
    return this._camera.type
  }
  get camera() {
    return this._camera
  }

  getZoom() {
    return this._zoom
  }
}

CameraControlsImpl.install({ THREE })

export type CameraControlsRef = CameraControlsImpl

export type CamereaControlProps = ReactThreeFiber.Object3DNode<
  CameraControlsImpl,
  typeof CameraControlsImpl
> & {
  fitInitial?: boolean | THREE.Object3D
  regress?: boolean
  camera?: THREE.Camera
}

export const CameraControls = React.forwardRef<
  CameraControlsRef,
  CamereaControlProps
>(({ fitInitial, regress, camera, ...props }, ref) => {
  const invalidate = useThree(({ invalidate }) => invalidate)
  const defaultCamera = useThree(({ camera }) => camera)
  const scene = useThree(({ scene }) => scene)
  const gl = useThree(({ gl }) => gl)
  const performance = useThree(({ performance }) => performance)
  const explCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera =
    (camera as any) || defaultCamera

  const controls = React.useMemo(() => {
    const controls = new CameraControlsImpl(explCamera, gl.domElement)
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
      console.log('FIT INITIAL', obj)
      controls.fitTo(obj, true)
    }
  }, [])
  return (
    <React.Fragment>
      <primitive {...{ ...props, ref, object: controls }} />
    </React.Fragment>
  )
})
