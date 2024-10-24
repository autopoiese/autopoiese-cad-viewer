'use client'

import { createContext, useContext, useRef } from 'react'
import { Events, ReactThreeFiber, extend, useThree } from '@react-three/fiber'
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei'

const ThreeContext = createContext({})

export function Three({ children }) {
  const ref = useRef()

  return (
    <ThreeContext.Provider value={ref}>
      {children}
    </ThreeContext.Provider>
  )
}