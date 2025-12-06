'use client'
import React, { useState } from 'react'
import TextEditor from './TextEditor';
import ImportantDates from './ImportantDates';

const HomePageComponent = () => {
  const [content, setContent] = useState("");
  return (
    <div className='flex'>

      <div className='ml-[90px]'>
          <TextEditor initialValue={content} onChange={(val) => setContent(val)} allowMap={true} allowImage={true}/>

          {/* Preview content */}
          {/* <div dangerouslySetInnerHTML={{ __html: content }}></div> */}
      </div>

      <div className='sticky'>
        <ImportantDates />
      </div>
    </div>
  )
}

export default HomePageComponent