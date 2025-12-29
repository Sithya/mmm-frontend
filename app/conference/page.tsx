import React from 'react'
import Banner from '../components/UserComponent/Banner'
import ConfernceButton from '../components/AdminComponent/PagesButton.tsx/ConferenceButton'
import ImportantDatesServer from '../components/HybridComponent/ImportanceDate/ImportantDatesServer'
import PageRenderer from '../components/AdminComponent/PageRenderer'


const ConferencePage = () => {
  return (
    <>
      <Banner />

      <div className="flex gap-20 justify-center my-10">
          <div className="max-w-7xl">
            <PageRenderer slug="conference" />
            <ConfernceButton />
          </div>

          <div>
            <ImportantDatesServer />
          </div>
        </div>
    </>
  )
}


export default ConferencePage