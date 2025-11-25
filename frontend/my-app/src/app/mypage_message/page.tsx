'use client'

import { useState } from 'react'
import Mypage2 from '@/components/pages/Mypage2'
import Mypage3 from '@/components/pages/Mypage3'
import Mypage4 from '@/components/pages/Mypage4'
import { background, firstPrimary } from '@/app/colors'

export default function MyPagePage() {
  const [activeTab, setActiveTab] = useState('messages')

  const handleNavigation = (route: string) => {
    // Handle any navigation needs
  }

  return (
    <>
      {activeTab === 'messages' && (
        <Mypage2 onNavigate={handleNavigation} />
      )}
      {activeTab === 'health' && (
        <Mypage3 onNavigate={handleNavigation} />
      )}
      {activeTab === 'schedule' && (
        <Mypage4 onNavigate={handleNavigation} />
      )}
    </>
  )
}
