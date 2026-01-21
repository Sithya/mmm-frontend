import React from 'react'
import Banner from '../components/UserComponent/Banner'
import ConfernceButton from '../components/AdminComponent/PagesButton.tsx/ConferenceButton'
import ImportantDatesServer from '../components/HybridComponent/ImportanceDate/ImportantDatesServer'
import PageRenderer from '../components/AdminComponent/PageRenderer'

const ConferencePage = () => {
  return (
    <>
      <Banner />


      <div className="flex justify-center px-4 sm:px-6 mb-16">
        <div className="flex flex-col lg:flex-row gap-2">

          <div className="w-full lg:w-5/6 flex flex-col gap-6">
            <PageRenderer slug="conference" />
            <ConfernceButton />
          </div>

          <div className="lg:w-1/3 justify-center lg:justify-end">
            <div className="self-start">
              <ImportantDatesServer />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConferencePage
