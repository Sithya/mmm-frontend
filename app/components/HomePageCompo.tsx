'use client'
import React, { useState } from 'react'
import TextEditor from './TextEditor';

const HomePageComponent = () => {
    const [content, setContent] = useState("");
  return (
    <>
        <TextEditor initialValue={content} onChange={(val) => setContent(val)} allowMap={true} allowImage={true}/>
        {/* <h3>Preview</h3>
        <div dangerouslySetInnerHTML={{ __html: content }}></div> */}
    </>
  )
}

export default HomePageComponent