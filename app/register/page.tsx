"use client";
import React, { useState } from 'react'
import AdminFaq from '../components/AdminComponent/Admin_faq'
import RegistrationFAQ from '../components/RegistrationFAQ'
import { RegistrationType } from '@/types';
import HeroBanner from '../components/UserComponent/HeroBanner';
import RegistrationTypeSelector from '../components/UserComponent/RegistrationTypeSelector';
import RegistrationForm from '../components/UserComponent/RegistrationForm';
import { useAuth } from '../components/AuthProvider';

const RegisterPage = () => {

  const [registrationType, setRegistrationType] = useState<RegistrationType>("standard");

  const { user } = useAuth();
  const isAdmin = user?.is_admin === true;

  return (
    <>
      <HeroBanner
        title="Register for MMM2027"
        subtitle="Secure your spot at the 33rd International Conference on Multimedia Modeling"
        imageUrl="https://upload.wikimedia.org/wikipedia/commons/f/f5/Buddhist_monks_in_front_of_the_Angkor_Wat.jpg"
      />

      <div className="pb-24 pt-12 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
      <RegistrationTypeSelector
        value={registrationType}
        onChange={setRegistrationType}
      />

      
      <RegistrationForm
        registration_type={registrationType}
      />
      </div>

      <div className="text-center space-y-4">
          {isAdmin ? (
            <AdminFaq/> 
          ) : (
            <RegistrationFAQ/>
          )}
        </div>
      
    </>
  )
}

export default RegisterPage