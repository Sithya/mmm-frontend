'use client'
import React, { useState } from 'react'
import Link from 'next/link';
import NewsCard from '../News/NewsCard';
import HomePageServer from './HomePageServer';

const HomePageComponent = () => {
  return (
    <>
      <div className='flex'>

        <div className='ml-[90px] mb-[100px] flex flex-col gap-30'>

          <HomePageServer />

          <Link href="/home/admin/content">
            <div className="flex justify-center">
              <div
                className="w-48 h-16 flex items-center justify-center border border-purple-300 rounded-xl shadow-sm hover:shadow-md
                  cursor-pointer transition-all duration-300 text-purple-900 font-semibold text-lg mb-10">
                + Add Content
              </div>
            </div>
          </Link>
          {/* <NewsCardServer /> */}
          <NewsCard />
          
        </div>

      </div>

    </>
  )
}

export default HomePageComponent