import React from 'react'
import Banner from '../components/UserComponent/Banner'
import FetchPageContent from '../components/AdminComponent/FetchPageContent'
import AttendingButton from '../components/AdminComponent/PagesButton.tsx/AttendingButton'
import ImportantDates from '../components/HybridComponent/ImportanceDate/ImportantDates'
import ImportantDatesServer from '../components/HybridComponent/ImportanceDate/ImportantDatesServer'

const AttendingPage = () => {
  return (
    <>
        <Banner />
        <div className='flex my-10 mx-[90px]'> 
          <div className='max-w-5xl'>
          <FetchPageContent />
          <AttendingButton />
          </div>
          <ImportantDatesServer />
        </div>
    </>
  )
}

export default AttendingPage