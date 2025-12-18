import React from 'react'
import Banner from '../components/UserComponent/Banner'
import FetchPageContent from '../components/AdminComponent/FetchPageContent'
import ConfernceButton from '../components/AdminComponent/PagesButton.tsx/ConferenceButton'
import ImportantDatesServer from '../components/HybridComponent/ImportanceDate/ImportantDatesServer'
import AdminKeynote from '../components/AdminComponent/admin_keynote'


const ConferencePage = () => {
  return (
    <>
        <Banner />
        <div className='flex my-10 mx-[90px]'> 
          <div className='max-w-5xl'>
          <FetchPageContent />
          <ConfernceButton />
          <AdminKeynote/>
          </div>
          <ImportantDatesServer />
        </div>
    </>
  )
}

export default ConferencePage