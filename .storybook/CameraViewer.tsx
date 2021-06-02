import * as React from 'react'
import * as THREE from 'three'
import { useThree, useFrame, createPortal } from '@react-three/fiber'
import { OrbitControls } from 'three-stdlib'
import { Html } from '@react-three/drei'

const useCameraHelperPanel = ({ element }) => {
  const mainCamera = useThree(({ camera }) => camera)
  const gl = useThree(({ gl }) => gl)
  const size = useThree(({ size }) => size)
  const scene = useThree(({ scene }) => scene)
  const virtualCamera = React.useMemo(
    () => new THREE.OrthographicCamera(0, 0, 0, 0, -10000, 10000),
    []
  )
  React.useMemo(() => {
    applySizeToCamera(virtualCamera, {
      width: size.width,
      height: size.height / 2
    })
    virtualCamera.updateProjectionMatrix()
  }, [virtualCamera, size])

  const cameraHelper = React.useMemo(() => new THREE.CameraHelper(mainCamera), [
    mainCamera
  ])

  const v3 = new THREE.Vector3()
  const box3 = new THREE.Box3().setFromObject(cameraHelper)
  box3.getCenter(v3)
  const { min, max } = box3
  const virtualScene = React.useMemo(() => {
    const virtualScene = new THREE.Scene().copy(scene)
    const center = new THREE.Vector3()
    const box = new THREE.Box3().setFromObject(cameraHelper)
    virtualCamera.position.set(8000, 0, 0)
    box.getCenter(center)
    virtualCamera.lookAt(center)
    virtualScene.add(cameraHelper)

    const minDis = Math.sqrt(min.x ** 2 + min.y ** 2 + min.z ** 2)
    const maxDis = Math.sqrt(max.x ** 2 + max.y ** 2 + max.z ** 2)
    const radius = minDis > maxDis ? minDis : maxDis
    const aspect = size.width / (size.height / 2)
    virtualCamera.zoom =
      aspect > 1 ? size.height / 2 / (radius * 2) : size.width / (radius * 2)
    virtualCamera.lookAt(v3)
    virtualCamera.updateProjectionMatrix()
    return virtualScene
  }, [mainCamera])

  const controls = React.useMemo(
    () => element.current && new OrbitControls(virtualCamera, element.current),
    [virtualCamera, element.current]
  )

  controls && ((controls.enableZoom = true), (controls.target = v3))

  useFrame(({ gl, size }) => {
    //  camera.lookAt(v3.x, v3.y, v3.z)
    cameraHelper.update()
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
    gl.render(virtualScene, virtualCamera)
  }, 2)
}

export const CameraViewer = () => {
  const size = useThree(({ size }) => size)
  const element = React.useRef<HTMLDivElement>()
  useCameraHelperPanel({ element })
  return (
    <Html
      {...{
        ref: element,
        fullscreen: true,
        transform: false,
        style: { height: size.height / 2 }
      }}
    />
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
