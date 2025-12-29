import React, { useState } from 'react'
import HomePageComponent from '../components/UserComponent/HomePageCompo'
import Banner from '../components/UserComponent/Banner'
import ImportantDatesServer from '../components/HybridComponent/ImportanceDate/ImportantDatesServer'
import PageRenderer from '../components/AdminComponent/PageRenderer'

const HomePage = () => {
  return (
    <>
      <Banner />

      <div className="text-center text-purple-900 text-4xl font-bold my-10">
        WELCOME TO MMM2027
      </div>

        <div className="flex gap-20 justify-center my-10">
          <div className="max-w-7xl">
            <PageRenderer slug="home" />
            <HomePageComponent />
          </div>

          <div>
            <ImportantDatesServer />
          </div>
        </div>

    </>
  )
}


export default HomePage