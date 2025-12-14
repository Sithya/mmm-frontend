import React, { useState } from 'react'
import HomePageComponent from '../components/HomePage/HomePageCompo'
import Banner from '../components/Banner'
import ImportantDatesServer from '../components/ImportanceDate/ImportantDatesServer'
import HomePageServer from '../components/HomePage/HomePageServer'

const HomePage = () => {
  return (
    <>
    <div className="">
      <Banner />
      <div className='text-center text-purple-900 text-4xl font-bold mt-9 mb-10'>WELCOME TO MMM2027</div>
      <div className="flex">
        <HomePageComponent />
        <ImportantDatesServer />
      </div>
    </div>
    </>
  )
}

export default HomePage