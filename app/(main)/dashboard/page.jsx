import React from 'react'
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
const IndustryInsights = async () => {
   const {isOnboarded} =await getUserOnboardingStatus();
    if(!isOnboarded){
      redirect('/onboarding');
    }
  return (
    <div>
      
    </div>
  )
}

export default IndustryInsights
