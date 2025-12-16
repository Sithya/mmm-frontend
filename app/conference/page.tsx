// "use client"
import React from 'react'
import Banner from '../components/UserComponent/Banner'
import FetchPageContent from '../components/AdminComponent/FetchPageContent'
import AddContentButton from '../components/AdminComponent/AddContentButton'

const ConferencePage = () => {
  return (
    <>
      <Banner />
      <FetchPageContent />
      {/* <AddContentButton /> */}
    </>
  )
}

export default ConferencePage