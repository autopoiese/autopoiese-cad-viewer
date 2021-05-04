import * as React from 'react'
import * as THREE from 'three'
import { Canvas, useThree, createPortal, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Octahedron,
  Html,
  PositionalAudio
} from '@react-three/drei'
import CameraControls from 'camera-controls'
CameraControls.install({ THREE })

export function Setup({
  children,
  cameraFov = 75,
  cameraPosition = new THREE.Vector3(-5, 5, 5),
  controls = true,
  lights = true,
  object = (
    <Octahedron>
      <meshNormalMaterial />
    </Octahedron>
  ),
  ...restProps
}) {
  return (
    <Canvas
      shadows
      camera={{ position: cameraPosition, fov: cameraFov }}
      dpr={window.devicePixelRatio}
      {...{
        ...restProps
        // style: {
        //   width: '100%',
        //   height: '100vh',
        //   backgroundColor: 'rgba(0,0,0,0.5)',
        //   ...restProps.style
        // }
      }}
    >
      {object}
      {children}
      {lights && (
        <>
          <ambientLight intensity={0.8} />
          <pointLight intensity={1} position={[0, 6, 0]} />
        </>
      )}
      {controls && <OrbitControls />}
    </Canvas>
  )
}

export const CameraHelper = () => {
  const gl = useThree(({ gl }) => gl)
  const scene = useThree(({ scene }) => scene)
  const mainCamera = useThree(({ camera }) => camera)
  const size = useThree(({ size }) => size)

  const Top = React.useRef<HTMLDivElement>()
  const Bottom = React.useRef<HTMLDivElement>()

  const cameraHelper = React.useMemo(() => {
    const cameraHelper = new THREE.CameraHelper(mainCamera)
    return cameraHelper
  }, [mainCamera])

  const virtualScene = React.useMemo(() => {
    const virtualScene = new THREE.Scene()
    scene.children.forEach(
      (child) => child instanceof THREE.Mesh && virtualScene.add(child.clone())
    )
    virtualScene.add(cameraHelper)
    return virtualScene
  }, [cameraHelper])

  const virtualCam = React.useMemo(() => {
    const virtualCam = new THREE.OrthographicCamera(0, 0, 0, 0, -10000, 10000)

    virtualCam.zoom = -10
    virtualCam.position.set(200, 0, 200)
    virtualCam.updateProjectionMatrix()
    virtualScene.add(virtualCam)
    return virtualCam
  }, [size, Top])

  React.useMemo(() => {
    virtualCam.left = size.width / -2
    virtualCam.right = size.width / 2
    virtualCam.top = size.height / 4
    virtualCam.bottom = size.height / -4
    virtualCam.updateProjectionMatrix()
  }, [virtualCam, size])

  const virtualControls = React.useRef(null)

  React.useLayoutEffect(() => {
    if (!virtualControls.current && Top.current) {
      virtualControls.current = new CameraControls(virtualCam, Top.current)
      virtualControls.current.fitToBox(cameraHelper, true)
      console.log('TADA')
    }
  }, [Top])

  useFrame(({ gl, size }) => {
    gl.autoClear = true
    gl.setViewport(0, 0, size.width, size.height / 2)
    applySizeToCamera(mainCamera, {
      width: size.width,
      height: size.height / 2
    })
    gl.render(scene, mainCamera)
    gl.autoClear = false
    gl.clearDepth()
    gl.setViewport(0, size.height / 2, size.width, size.height / 2)
    gl.render(virtualScene, virtualCam)
  }, 2)
  return (
    <>
      <Html
        {...{
          ref: Top,
          fullscreen: true,
          style: {
            position: 'fixed',
            width: '100vw',
            height: '50vh',
            zIndex: 500
          }
        }}
      />
      {
        (createPortal(
          <primitive {...{ object: cameraHelper }} />,
          virtualScene
        ) as unknown) as React.ReactElement
      }
    </>
  )
}

const applySizeToCamera = (
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera,
  size
) => {
  if (camera.type === 'OrthographicCamera') {
    camera.left = size.width / 2
    camera.right = size.width / -2
    camera.top = size.height / 2
    camera.bottom = size.height / -2
  } else {
    camera.aspect = size.width / size.height
  }
  camera.updateProjectionMatrix()
}
