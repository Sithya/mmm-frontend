import React, { useState } from 'react'
import HomePageComponent from '../components/UserComponent/HomePageCompo'
import Banner from '../components/UserComponent/Banner'
import ImportantDatesServer from '../components/HybridComponent/ImportanceDate/ImportantDatesServer'

const HomePage = () => {
  return (
    <>
    <div className="">
      <Banner />
      <div className='text-center text-purple-900 text-4xl font-bold mt-9 mb-10'>WELCOME TO MMM2027</div>
      <div className="flex justify-around px-[90px] align">
        <HomePageComponent />
        <div className=''>
        <ImportantDatesServer />
        </div>
      </div>
    </div>
    </>
  )
}

export default HomePage