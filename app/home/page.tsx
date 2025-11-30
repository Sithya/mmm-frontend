import React, { useState } from 'react'
import HomePageComponent from '../components/HomePageCompo'

const HomePage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          MMM2027 Application
        </h1>
        <p className="text-lg text-gray-600">Welcome to the MMM2027 Frontend</p>
        <div className="mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
            Get Started
          </button>
        </div>
        <HomePageComponent />
      </div>
    </main>
  )
}

export default HomePage