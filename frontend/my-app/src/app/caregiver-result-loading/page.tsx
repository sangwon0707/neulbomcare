"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

export default function CaregiverResultLoadingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') || '/caregiver-result-list'
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 30) // 3 seconds total

    const timer = setTimeout(() => {
      router.push(nextPath)
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [router, nextPath])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-8">
      {/* Logo */}
      <div className="mb-12">
        <Image
          src="/assets/logo.png"
          alt="Neulbom Care"
          width={120}
          height={120}
          className="object-contain"
          priority
        />
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-[240px] h-1.5 bg-gray-100 rounded-full overflow-hidden mb-10">
        <div
          className="h-full bg-[#18d4c6] transition-all duration-100 ease-linear rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <style>{`
        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }
      `}</style>

      {/* Text */}
      <div className="text-center">
        <h2 className="text-[22px] font-bold text-[#353535] mb-4 leading-tight">
          AI가 딱 맞는 간병인을<br />
          찾고 있어요!
        </h2>
        <p className="text-sm text-[#828282] font-medium">
          곧 완료됩니다
          <span className="inline-block after:content-['.'] after:animate-[dots_1.5s_infinite]"></span>
        </p>
      </div>
    </div>
  )
}