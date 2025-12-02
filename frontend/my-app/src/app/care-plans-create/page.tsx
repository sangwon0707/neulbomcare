'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CarePlanCreatePage() {
  const router = useRouter()

  useEffect(() => {
    // 바로 care-plans-create-1로 리다이렉트
    router.replace('/care-plans-create-1')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18D4C6]"></div>
    </div>
  )
}
