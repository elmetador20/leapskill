// app/(main)/dashboard/page.jsx
import React from 'react'
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import { getIndustryInsights } from '@/actions/dashboard';
import DashboardView from './_components/dashboard-view';

const IndustryInsights = async () => {
  try {
    const { isOnboarded } = await getUserOnboardingStatus();
    
    if (!isOnboarded) {
      redirect('/onboarding');
    }

    const insights = await getIndustryInsights();
    
    return (
      <div className='container mx-auto'>
        <DashboardView insights={insights}/>
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    
    // If user hasn't completed onboarding, redirect
    if (error.message === "User has not completed onboarding") {
      redirect('/onboarding');
    }
    
    // For other errors, show error page or redirect to onboarding
    redirect('/onboarding');
  }
}

export default IndustryInsights