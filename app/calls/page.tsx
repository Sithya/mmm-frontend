import React from 'react'
import Banner from '../components/UserComponent/Banner'
import CallButton from '../components/AdminComponent/PagesButton.tsx/CallButton'
import ImportantDatesServer from '../components/HybridComponent/ImportanceDate/ImportantDatesServer'
import PageRenderer from '../components/AdminComponent/PageRenderer'

const CallPage = () => {
  return (
    <>
      <Banner />


      <div className="flex justify-center px-4 sm:px-6 mb-16">
        <div className="flex flex-col lg:flex-row">

          <div className="w-full lg:w-5/6 flex flex-col gap-6">
            <PageRenderer slug="calls" />
            <CallButton />
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

export default CallPage

