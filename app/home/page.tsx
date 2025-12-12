import React, { useState } from 'react'
import HomePageComponent from '../components/HomePageCompo'
import Banner from '../components/Banner'
import ImportantDatesServer from '../components/ImportanceDate/ImportantDatesServer'

const HomePage = () => {
  return (
    <>
    <div className="">
      <Banner />
      <div className="text-center p-6 flex">
        <HomePageComponent />
        <ImportantDatesServer />
      </div>
    </div>
    </>
  )
}

export default HomePage