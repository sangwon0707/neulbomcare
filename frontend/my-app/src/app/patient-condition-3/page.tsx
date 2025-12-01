"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Camera } from "lucide-react"
import { cn } from "@/utils/cn"

export default function PatientCondition3Page() {
  const router = useRouter()
  const [medicationList, setMedicationList] = useState("")
  const [allergyFood, setAllergyFood] = useState("")
  const [restrictedFood, setRestrictedFood] = useState("")

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white px-4 pt-4 pb-2">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-gray-600"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 flex gap-2 ml-4 mr-2">
            <div className="h-1 flex-1 bg-[#18d4c6] rounded-full" />
            <div className="h-1 flex-1 bg-[#18d4c6] rounded-full" />
            <div className="h-1 flex-1 bg-[#18d4c6] rounded-full" />
            <div className="h-1 flex-1 bg-[#18d4c6] rounded-full" />
            <div className="h-1 flex-1 bg-gray-200 rounded-full" />
          </div>
        </div>

        <div className="h-px bg-gray-100 -mx-4" />
      </header>

      <main className="flex-1 px-8 pt-6 pb-32 overflow-y-auto">
        {/* Medication Section */}
        <div className="mb-12">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#353535] mb-2">복용 중인 약이 있나요?</h1>
            <p className="text-base font-bold text-[#828282]">정확한 복약 관리를 위해 필요합니다.</p>
          </div>

          {/* Camera Button */}
          <div className="flex flex-col items-center mb-4">
            <button className="w-[200px] h-[150px] border-2 border-[#18d4c6] rounded-[10px] flex flex-col items-center justify-center gap-3 bg-white shadow-sm hover:bg-[#e8fffd] transition-colors">
              <div className="w-16 h-12 flex items-center justify-center relative">
                <Image
                  src="/assets/camera.svg"
                  alt="Camera"
                  width={64}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="w-[160px] h-9 bg-[#18d4c6] rounded flex items-center justify-center">
                <span className="text-sm font-bold text-white">약봉지 사진 촬영</span>
              </div>
            </button>
            <p className="text-xs text-[#828282] mt-3">구겨지면 인식이 잘 안될 수 있습니다.</p>
          </div>

          {/* Medication List Input */}
          <div className="space-y-2">
            <label className="text-lg font-bold text-[#353535]">약물 목록</label>
            <input
              type="text"
              value={medicationList}
              onChange={(e) => setMedicationList(e.target.value)}
              placeholder="약 이름을 입력하세요 (예:아스피린, 메트포민...)"
              className="w-full h-12 px-5 rounded-[10px] border border-[#828282] text-sm placeholder:text-[#828282] focus:outline-none focus:border-[#18d4c6]"
            />
          </div>
        </div>

        {/* Dietary Section */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-[28px] font-bold text-[#353535] mb-2">식이 정보 (선택사항)</h2>
            <p className="text-base font-bold text-[#828282]">알러지나 식이 제한이 있으면 입력해주세요</p>
          </div>

          {/* Allergy Input */}
          <div className="space-y-2 mb-8">
            <label className="text-lg font-bold text-[#353535]">알러지 음식</label>
            <input
              type="text"
              value={allergyFood}
              onChange={(e) => setAllergyFood(e.target.value)}
              placeholder="알러지 음식을 입력하세요 (예: 땅콩, 갑각류, 우유...)"
              className="w-full h-12 px-5 rounded-[10px] border border-[#828282] text-sm placeholder:text-[#828282] focus:outline-none focus:border-[#18d4c6]"
            />
          </div>

          {/* Restricted Food Input */}
          <div className="space-y-2">
            <label className="text-lg font-bold text-[#353535]">식이 제한 음식</label>
            <input
              type="text"
              value={restrictedFood}
              onChange={(e) => setRestrictedFood(e.target.value)}
              placeholder="피해야 할 음식을 입력하세요 (예: 짠 음식, 고지방 음식)"
              className="w-full h-12 px-5 rounded-[10px] border border-[#828282] text-sm placeholder:text-[#828282] focus:outline-none focus:border-[#18d4c6]"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white px-8 pb-8 pt-4">
        <button
          onClick={() => router.push('/caregiver-finder')} // Assuming next step
          className="w-full h-14 bg-[#18d4c6] rounded-[10px] flex items-center justify-center gap-1 shadow-[1px_1px_2px_rgba(125,140,139,0.5)] hover:bg-[#15bkb0] transition-colors"
        >
          <span className="text-lg font-bold text-white">다음</span>
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </footer>
    </div>
  )
}
