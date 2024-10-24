'use client'

import { useRef } from 'react'

export function Layout({ children }) {
  const ref = useRef()

  return (
    <div
      ref={ref}
      className='absolute top-0 left-0 z-10 h-screen w-screen overflow-hidden bg-zinc-900 text-gray-50'
    >
      {children}
    </div>
  )
}