import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

export default function Page() {
  return (
    <>
      <div className='mx-auto flex min-h-screen w-full flex-col flex-wrap items-center'>
        <div className='relative h-[60vh] w-full'>
          <Scene />
        </div>
      </div>
    </>
  )
}