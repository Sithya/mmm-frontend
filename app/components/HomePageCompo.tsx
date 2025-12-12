'use client'
import React, { useState } from 'react'
import TextEditor from './TextEditor';
import NewsCard from './NewsCard';
import Link from 'next/link';

const HomePageComponent = () => {
  const [content, setContent] = useState("");
  return (
    <>
      <div className='flex'>

        <div className='ml-[90px] mb-[100px] flex flex-col gap-30'>
          {/* <TextEditor initialValue={content} onChange={(val) => setContent(val)} allowMap={true} allowImage={true} /> */}

          {/* Preview content */}
          {/* <div dangerouslySetInnerHTML={{ __html: content }}></div> */}
          {/* <div className="max-w-5xl mt-[80px]">
            <NewsCard />
          </div> */}

          <Link href="/admin/create-content">
            <div className='w-[68vw] max-w-5xl h-16 flex items-center justify-center  border mr-7 border-purple-300 rounded-xl shadow-sm hover:shadow-md 
              cursor-pointer transition-all duration-300 text-purple-900 font-semibold text-lg mt-30'> + Create Content</div>
          </Link>
          {/* <NewsCard > </NewsCard> */}
        </div>

      </div>
      
    </>
  )
}

export default HomePageComponent