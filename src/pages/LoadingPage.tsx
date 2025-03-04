import { LoadingSpinner } from '@/components/spinner'
const LoadingPage = () => {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'>
        <div className='flex flex-row justify-center items-center'><LoadingSpinner/> Loading...</div>
    </div>
  )
}

export default LoadingPage