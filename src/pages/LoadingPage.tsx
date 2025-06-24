const LoadingPage = () => {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'>
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
    <div className="relative">
      <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-amber-400 animate-spin animate-reverse"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full bg-indigo-600 animate-pulse"></div>
      </div>
    </div>
  </div>
    </div>
  )
}

export default LoadingPage