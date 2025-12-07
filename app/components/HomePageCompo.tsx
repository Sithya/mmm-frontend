'use client'
import React, { useState } from 'react'
import TextEditor from './TextEditor';
import ImportantDates from './ImportantDates';
import NewsCard from './NewsCard';
import Link from 'next/link';

const HomePageComponent = () => {
  const [content, setContent] = useState("");
  return (
    <>
      <div className='flex'>

        <div className='ml-[90px]'>
          <TextEditor initialValue={content} onChange={(val) => setContent(val)} allowMap={true} allowImage={true} />

          {/* Preview content */}
          {/* <div dangerouslySetInnerHTML={{ __html: content }}></div> */}
          <div className="max-w-5xl mt-[80px]">
            <NewsCard />
          </div>

          
        </div>

        <div className=''>
          <ImportantDates isAdmin={false} />
        </div>


      </div>
      
    </>
  )
}

export default HomePageComponent