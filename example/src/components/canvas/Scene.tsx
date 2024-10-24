import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { r3f } from '@/helpers/global'

export default function Scene({ ...props }) {
  return (
    <Canvas {...props}>
      <r3f.Out />
      <Preload all />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  )
}