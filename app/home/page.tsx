import React, { useState } from 'react'
import HomePageComponent from '../components/HomePageCompo'
import Banner from '../components/Banner'

const HomePage = () => {
  return (
    <>
    <div className="min-h-screen items-center justify-center">
      <Banner />
      <div className="text-center space-y-4 p-6 ">
       
        <HomePageComponent />
        
      </div>
    </div>
    </>
  )
}

export default HomePage