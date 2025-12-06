import React, { useState } from 'react'
import HomePageComponent from '../components/HomePageCompo'
import Banner from '../components/Banner'

const HomePage = () => {
  return (
    <>
    <div className="">
      <Banner />
      <div className="text-center p-6">
       
        <HomePageComponent />
        
      </div>
    </div>
    </>
  )
}

export default HomePage