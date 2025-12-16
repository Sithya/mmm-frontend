'use client'
import React from 'react'
import NewsCard from '../HybridComponent/NewsCard';
import AddContentButton from '../AdminComponent/AddContentButton';
import FetchPageContent from '../AdminComponent/FetchPageContent';

const HomePageComponent = () => {
  return (
    <>
      <div className='flex'>
        <div className='ml-[90px] mb-[100px] flex flex-col gap-30'>
          <FetchPageContent />
          <AddContentButton />
          <NewsCard />
        </div>

      </div>

    </>
  )
}

export default HomePageComponent