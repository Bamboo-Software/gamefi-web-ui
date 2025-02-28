import { LoadingSpinner } from "./spinner"

const LoadingComponent = () => {
  return (
    <div className="flex flex-row h-screen w-full justify-center items-center">
        <LoadingSpinner />
        <h1>Loading ...</h1>
    </div>
  )
}

export default LoadingComponent