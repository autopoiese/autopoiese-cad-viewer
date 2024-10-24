'use client'

export default function Error({ error, reset }) {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <h2 className='text-2xl font-bold'>Something went wrong!</h2>
      <button
        className='mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}