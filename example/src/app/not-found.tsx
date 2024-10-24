export default function NotFound() {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <h2 className='text-2xl font-bold'>Page Not Found</h2>
      <p className='mt-2 text-gray-600'>Could not find requested resource</p>
    </div>
  )
}