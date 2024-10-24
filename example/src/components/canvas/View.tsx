import { forwardRef, useImperativeHandle, useRef } from 'react'
import { OrbitControls, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/components/Three'

export const View = forwardRef(({ children, orbit = true, ...props }, ref) => {
  const localRef = useRef()
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef}>
          {children}
          {orbit && <OrbitControls makeDefault />}
        </ViewImpl>
      </Three>
    </>
  )
})