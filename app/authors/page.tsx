import React from 'react'
import Banner from '../components/UserComponent/Banner'
import AuthorButton from '../components/AdminComponent/PagesButton.tsx/AuthourButton'
import ImportantDatesServer from '../components/HybridComponent/ImportanceDate/ImportantDatesServer'
import PageRenderer from '../components/AdminComponent/PageRenderer'

const AuthorPage = () => {
  return (
    <>
       <Banner />
        <div className="flex gap-20 justify-center my-10">
          <div className="max-w-7xl">
            <PageRenderer slug="authors" />
            <AuthorButton />
          </div>

          <div>
            <ImportantDatesServer />
          </div>
        </div>
    </>
  )
}

export default AuthorPage