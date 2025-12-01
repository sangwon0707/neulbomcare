"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Bell, ChevronRight, User } from "lucide-react"
import { cn } from "@/utils/cn"

export default function CaregiverResultListPage() {
  const router = useRouter()

  const caregivers = [
    {
      id: 1,
      name: "김미숙",
      tags: ["요양보호사 1급", "경력 8년"],
      description: "당뇨 및 고혈압 / 치매 관리",
      price: "25,000",
      match: 92,
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/jhndnlnk_expires_30_days.png",
      isBest: true
    },
    {
      id: 2,
      name: "이정호",
      tags: ["요양보호사 1급", "경력 6년"],
      description: "치매 관리 / 재활운동",
      price: "23,000",
      match: 88,
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/8z1w0laz_expires_30_days.png",
      isBest: false
    },
    {
      id: 3,
      name: "박은영",
      tags: ["요양보호사 1급", "경력 12년"],
      description: "당뇨 / 식사 / 투약 관리",
      price: "27,000",
      match: 85,
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dLEe2OFnnm/sjpp31lx_expires_30_days.png",
      isBest: false
    }
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white px-4 h-[60px] flex items-center justify-between border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 text-gray-600"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-[#353535]">추천 간병인</h1>
        <button className="p-2 -mr-2 text-gray-600">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 px-6 pt-8">
        {/* Title Section */}
        <div className="mb-6">
          <h2 className="text-[28px] font-bold text-[#353535] mb-1 leading-tight">
            김영희님에게 적합한 간병인
          </h2>
          <p className="text-base font-bold text-[#828282]">
            3명의 전문가를 찾았습니다.
          </p>
        </div>

        {/* Caregiver Cards */}
        <div className="space-y-6">
          {caregivers.map((caregiver) => (
            <div
              key={caregiver.id}
              className="rounded-[10px] border border-[#18d4c6] bg-white overflow-hidden shadow-[1px_3px_3px_rgba(74,73,73,0.25)]"
            >
              <div className="p-4 bg-[#FFFFFFB0]">
                {/* Tags */}
                <div className="flex gap-2 mb-3">
                  {caregiver.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#18d4c6] text-white text-sm font-bold px-3.5 py-[9px] rounded-[5px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Profile Info */}
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={caregiver.image}
                    alt={caregiver.name}
                    className="w-[62px] h-[62px] rounded-full object-cover border border-gray-100"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-xl font-bold text-[#353535]">{caregiver.name}</span>
                    </div>
                    <span className="text-sm text-[#828282] mb-1">{caregiver.description}</span>
                    <span className="text-sm font-bold text-[#353535]">{caregiver.price}/시간</span>
                  </div>
                </div>

                {/* Match Score & Link */}
                <div className="flex items-center justify-between mb-3">
                  <button className="flex items-center gap-1 text-[#828282]">
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-xs">매칭 근거 확인하기</span>
                  </button>
                  <span className={cn(
                    "font-bold text-lg",
                    caregiver.match >= 90 ? "text-[#FF7E7E]" : "text-[#828282]"
                  )}>
                    {caregiver.match}% 매칭
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 mb-4" />

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => alert("caregiver-detail 미생성")}
                    className="flex-1 py-4 bg-[#F2F2F2] border border-[#828282] rounded-md text-[#828282] text-base font-bold"
                  >
                    프로필 보기
                  </button>
                  <button
                    onClick={() => router.push('/mypage-mycaregiver')}
                    className={cn(
                      "flex-1 py-4 border rounded-md text-base font-bold",
                      caregiver.isBest
                        ? "bg-[#18d4c6] border-[#18d4c6] text-white"
                        : "bg-[#E8FFFD] border-[#18d4c6] text-[#828282]"
                    )}
                  >
                    선택하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
