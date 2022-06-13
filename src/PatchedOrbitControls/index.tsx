import * as React from 'react'
import { OrbitControls as OrbitControlsImpl } from './OrbitControls'
import { useThree, useFrame, ReactThreeFiber, extend } from '@react-three/fiber'

extend({ PatchedOrbitControls: OrbitControlsImpl })

export type OrbitControlsProps = ReactThreeFiber.Overwrite<
  ReactThreeFiber.Object3DNode<
    typeof OrbitControlsImpl,
    typeof OrbitControlsImpl
  >,
  {
    target?: ReactThreeFiber.Vector3
    camera?: THREE.Camera
    regress?: boolean
    enableDampening?: boolean
  }
>

export const PatchedOrbitControls = React.forwardRef<
  typeof OrbitControlsImpl,
  OrbitControlsProps
>(({ camera, regress, enableDampening = true, ...restProps }, ref) => {
  const invalidate = useThree(({ invalidate }) => invalidate)
  const defaultCamera = useThree(({ camera }) => camera)
  const gl = useThree(({ gl }) => gl)
  const performance = useThree(({ performance }) => performance)
  const explCamera = camera || defaultCamera
  const controls = React.useRef() // React.useMemo(
  //   () => new OrbitControlsImpl(explCamera, gl.domElement),
  //   [explCamera, gl.domElement]
  // )

  useFrame(() => controls.current?.update())

  React.useEffect(() => {
    const callback = () => {
      invalidate()
      if (regress) performance.regress()
    }

    // controls.connect(gl.domElement)
    controls.current?.addEventListener('change', callback)
    return () => {
      controls.current?.removeEventListener('change', callback)
      controls.current?.dispose()
    }
  }, [regress, controls.current, invalidate])

  return (
    <patchedOrbitControls
      {...{
        ref,
        args: [explCamera, gl.domElement],
        zoomToCursor: true,
        // object: controls,
        enableDampening,
        ...restProps
      }}
    />
  )
})

// // export const OrbitControls = React.forwardRef((props, ref) => {
// //   const { camera, gl, invalidate } = useThree()
// //   const controls: React.Ref<typeof OrbitControlsImpl> = React.useRef(null)
// //   useFrame(() => controls.current?.update())
// //   React.useLayoutEffect(() => {
// //     controls?.current?.addEventListener?.('change', invalidate)
// //     return () => controls?.current?.removeEventListener?.('change', invalidate)
// //   }, [controls, invalidate])
// //   return (
// //     <orbitControls
// //       {...{
// //         ...props,
// //         ref: mergeRefs([ref, controls]),
// //         // args: [camera, gl.domElement],
// //         // enableDamping: true,
// //         zoomToCursor: true
// //       }}
// //     />
// //   )
// // })
