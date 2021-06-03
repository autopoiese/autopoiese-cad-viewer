import * as React from 'react'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import create, { SetState } from 'zustand'
import {
  isOrthographicCamera,
  isPerspectiveCamera
} from '../utils/cameraHelpers'
import { useCameraControls, CameraControlsRef } from '../CameraControls'
import { sides } from '../constants'
import ReactDOM from 'react-dom'

type UseViewerArgs = {
  orthographicCamera?: THREE.OrthographicCamera
  perspectiveCamera?: THREE.PerspectiveCamera
}

type UseViewer = (
  args?: UseViewerArgs
) => {
  controls
}

// const viewStore = create((set,get) => ({
//   _controls: null
//   controls: (controls?) =>
// }))

const controls = create((set, get) => {})

export const useViewer: UseViewer = (props) => {
  const set = useThree(({ set }) => set)
  const setDefaultCamera = (camera) => set({ camera })
  const camera = useThree(({ camera }) => camera)
  const gl = useThree(({ gl }) => gl)
  const { perspectiveCamera, orthographicCamera } = React.useMemo(() => {
    if (isOrthographicCamera(camera)) {
      return {
        orthographicCamera: camera,
        perspectiveCamera:
          props?.perspectiveCamera || new THREE.PerspectiveCamera()
      }
    } else if (isPerspectiveCamera(camera)) {
      return {
        orthographicCamera:
          props?.orthographicCamera || new THREE.OrthographicCamera(0, 0, 0, 0),
        perspectiveCamera: camera
      }
    }
  }, [])

  const controls = useCameraControls({ camera })

  // const controls = React.useMemo(() => {
  //   const cameraControls = new CameraControls(camera, gl.domElement)
  //   cameraControls.enabled = true
  //   return cameraControls
  // }, [
  //   (camera as THREE.OrthographicCamera).isOrthographicCamera,
  //   (camera as THREE.PerspectiveCamera).isPerspectiveCamera,
  //   gl.domElement
  // ])

  return {
    controls
  }
}

export const ControlButtons: React.FC<{
  controls: CameraControlsRef
}> = ({ controls }) => {
  return (
    <div {...{ style: { position: 'fixed', right: 0, top: 0 } }}>
      <button {...{ onClick: () => (controls.enabled = !controls.enabled) }}>
        {controls.enabled ? 'disable' : 'enable'}
      </button>
      <button>iso</button>
      {sides.map((side) => (
        <button>{side}</button>
      ))}
      <details>
        <summary>focalLength</summary>
        <input {...{ type: 'range', min: 8, max: 400, value: 50 }} />
      </details>
    </div>
  )
}

export const Viewer = React.forwardRef<HTMLElement>((props, ref) => {
  const [el] = React.useState(() => document.createElement('div'))
  const target = useThree(({ gl }) => gl.domElement.parentNode)
  const controls = useViewer()
  React.useEffect(() => {
    target.appendChild(el)
    return () => {
      if (target) target.removeChild(el)
      ReactDOM.unmountComponentAtNode(el)
    }
  }, [target])

  React.useLayoutEffect(() => {
    ReactDOM.render(
      <div {...{ ref, ...props }}>
        <ControlButtons {...{ controls }} />
      </div>,
      el
    )
  })
  console.log(el)
  return null
})
