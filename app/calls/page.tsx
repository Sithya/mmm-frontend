import React from 'react'
import Banner from '../components/UserComponent/Banner'
import FetchPageContent from '../components/AdminComponent/FetchPageContent'
import CallButton from '../components/AdminComponent/PagesButton.tsx/CallButton'

const CallPage = () => {
  return (
    <>
      <Banner />
      <FetchPageContent />
      <CallButton />
    </>
  )
}

export default CallPage