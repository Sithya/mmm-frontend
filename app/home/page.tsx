import React, { useState } from 'react'
import HomePageComponent from '../components/UserComponent/HomePageCompo'
import Banner from '../components/UserComponent/Banner'
import ImportantDatesServer from '../components/ImportanceDate/ImportantDatesServer'

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