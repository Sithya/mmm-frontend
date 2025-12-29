import React from 'react'
import Banner from '../components/UserComponent/Banner'
import AttendingButton from '../components/AdminComponent/PagesButton.tsx/AttendingButton'
import ImportantDatesServer from '../components/HybridComponent/ImportanceDate/ImportantDatesServer'
import PageRenderer from '../components/AdminComponent/PageRenderer'

const AttendingPage = () => {
  return (
    <>
        <Banner />
         <div className="flex gap-20 justify-center my-10">
          <div className="max-w-7xl">
            <PageRenderer slug="attending" />
            <AttendingButton />
          </div>
    
          <div>
            <ImportantDatesServer />
          </div>
        </div>
    </>
  )
}

export default AttendingPage
