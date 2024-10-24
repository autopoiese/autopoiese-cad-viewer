'use client'

import { useEffect } from 'react'

export default function Template({ children }) {
  useEffect(() => {
    // Add any global effects/listeners here
  }, [])

  return <>{children}</>
}