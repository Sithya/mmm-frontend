'use client'
import React from 'react'
import NewsCard from '../HybridComponent/NewsCard';
import AddContentButton from '../AdminComponent/AddContentButton';
import FetchPageContent from '../AdminComponent/FetchPageContent';
import PageRenderer from '../AdminComponent/PageRenderer';

const HomePageComponent = () => {
  return (
    <>
        <div className='felx justify-center'>
          <AddContentButton />
      </div>

    </>
  )
}

export default HomePageComponent