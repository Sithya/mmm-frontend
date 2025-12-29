import React from 'react'
import Banner from '../components/UserComponent/Banner'
import CallButton from '../components/AdminComponent/PagesButton.tsx/CallButton'
import ImportantDatesServer from '../components/HybridComponent/ImportanceDate/ImportantDatesServer'
import PageRenderer from '../components/AdminComponent/PageRenderer'

const CallPage = () => {
  return (
    <>
        <Banner />
        <div className="flex gap-20 justify-center my-10">
          <div className="max-w-7xl">
            <PageRenderer slug="calls" />
            <CallButton />
          </div>

          <div>
            <ImportantDatesServer />
          </div>
        </div>
    </>
  )
}

export default CallPage

