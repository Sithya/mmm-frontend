import React from 'react'
import AdminFaq from '../components/AdminComponent/Admin_faq'
import RegistrationFAQ from '../components/RegistrationFAQ'

const RegisterPage = () => {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center space-y-4">
       {/* <AdminFaq/> */}
       <RegistrationFAQ/>
      </div>
    </div>
    </>
  )
}

export default RegisterPage