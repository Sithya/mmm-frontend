import React from 'react'
import HomePageComponent from '../components/UserComponent/HomePageCompo'
import Banner from '../components/UserComponent/Banner'
import ImportantDatesServer from '../components/HybridComponent/ImportanceDate/ImportantDatesServer'
import PageRenderer from '../components/AdminComponent/PageRenderer'

const HomePage = () => {
  return (
    <>
      <Banner />

      <div className="text-center text-purple-900 text-3xl sm:text-4xl font-bold my-10 px-4 sm:px-0">
        WELCOME TO MMM2027
      </div>

      <div className="flex justify-center px-4 sm:px-6 mb-16">
        <div className="flex flex-col lg:flex-row">

          <div className="w-full lg:w-5/6 flex flex-col gap-6">
            <PageRenderer slug="home" />
            <HomePageComponent />
          </div>

          <div className="lg:w-1/3 flex justify-center lg:justify-end">
            <div className="self-start">
              <ImportantDatesServer />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage
