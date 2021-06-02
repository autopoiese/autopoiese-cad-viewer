import * as React from 'react'
import * as THREE from 'three'
import { Canvas, Props, extend, useThree, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'

export const Setup = React.forwardRef<
  HTMLCanvasElement,
  Props & { controls?: boolean | 'experimental'; stats?: boolean }
>(({ children, controls, stats = true, ...props }, ref) => {
  const canvasRef = React.useRef<HTMLCanvasElement>()
  React.useImperativeHandle(ref, () => canvasRef.current, [canvasRef])

  return (
    <Canvas
      {...{
        ...props,
        style: {
          width: '100vw',
          height: '100vh',
          backgroundColor: '#fff',
          ...props?.style
        },
        onCreated: (canvasContext) => {
          canvasRef.current = canvasContext.gl.domElement
          props.onCreated?.(canvasContext)
        }
      }}
    >
      {children}
      {controls && <OrbitControls />}
      {stats && <Stats />}
    </Canvas>
  )
})
