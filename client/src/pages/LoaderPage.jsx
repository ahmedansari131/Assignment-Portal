import React from 'react'
import { Loader } from '../components'

const LoaderPage = () => {
  return (
    <div className='absolute w-screen h-screen bg-gray-900 flex justify-center items-center'> 
      <Loader />
    </div>
  )
}

export default LoaderPage
