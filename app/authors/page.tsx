import React from 'react'
import Banner from '../components/UserComponent/Banner'
import FetchPageContent from '../components/AdminComponent/FetchPageContent'
import AuthorButton from '../components/AdminComponent/PagesButton.tsx/AuthourButton'
import ImportantDatesServer from '../components/HybridComponent/ImportanceDate/ImportantDatesServer'

const AuthorPage = () => {
  return (
    <>
       <Banner />
        <div className='flex my-10 mx-[90px]'> 
          <div className='max-w-5xl'>
          <FetchPageContent />
          <AuthorButton />
          </div>
          <ImportantDatesServer />
        </div>
    </>
  )
}

export default AuthorPage