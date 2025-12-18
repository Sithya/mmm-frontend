import React from 'react'
import Banner from '../components/UserComponent/Banner'
import FetchPageContent from '../components/AdminComponent/FetchPageContent'
import CallButton from '../components/AdminComponent/PagesButton.tsx/CallButton'
import ImportantDatesServer from '../components/HybridComponent/ImportanceDate/ImportantDatesServer'

const CallPage = () => {
  return (
    <>
        <Banner />
        <div className='flex my-10 mx-[90px]'> 
          <div className='max-w-5xl'>
          <FetchPageContent />
          <CallButton />
          </div>
          <ImportantDatesServer />
        </div>
    </>
  )
}

export default CallPage