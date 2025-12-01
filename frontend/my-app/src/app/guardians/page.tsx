"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, User, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/utils/cn"

export default function GuardiansPage() {
  const router = useRouter()
  const [isDirectInput, setIsDirectInput] = useState(false)

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
            <div className="h-1 flex-1 bg-gray-200 rounded-full" />
            <div className="h-1 flex-1 bg-gray-200 rounded-full" />
            <div className="h-1 flex-1 bg-gray-200 rounded-full" />
            <div className="h-1 flex-1 bg-gray-200 rounded-full" />
          </div>
        </div>

        <div className="h-px bg-gray-100 -mx-4" />
      </header>

      <main className="flex-1 px-8 pt-6 pb-24 overflow-y-auto">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-[#353535] mb-2">환자의 버팀목</h1>
          <p className="text-base font-bold text-[#828282]">보호자분의 기본 정보를 입력해 주세요.</p>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-[75px] h-[75px] rounded-full border border-[#18d4c6] flex items-center justify-center mb-3">
            <User className="w-8 h-8 text-[#18d4c6]" />
          </div>
          <span className="text-xs font-bold text-[#828282]">프로필 사진 추가(선택)</span>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-black ml-1">이름<span className="text-[#ff8e8e]">*</span></label>
            <input
              type="text"
              placeholder="예:박지은"
              className="w-full h-12 px-5 rounded-[10px] border border-[#828282] text-sm placeholder:text-[#828282] focus:outline-none focus:border-[#18d4c6]"
            />
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-black ml-1">연락처<span className="text-[#ff8e8e]">*</span></label>
            <input
              type="tel"
              placeholder="예:010-1234-5678"
              className="w-full h-12 px-5 rounded-[10px] border border-[#828282] text-sm placeholder:text-[#828282] focus:outline-none focus:border-[#18d4c6]"
            />
          </div>

          {/* Relationship */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-bold text-black">환자와의 관계<span className="text-[#ff8e8e]">*</span></label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#828282]">직접 입력</span>
                <button
                  onClick={() => setIsDirectInput(!isDirectInput)}
                  className={cn(
                    "w-[27px] h-[14px] rounded-full transition-colors relative",
                    isDirectInput ? "bg-[#18d4c6]" : "bg-[#d9d9d9]"
                  )}
                >
                  <div className={cn(
                    "absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all shadow-sm",
                    isDirectInput ? "left-[15px]" : "left-0.5"
                  )} />
                </button>
              </div>
            </div>

            <div className="relative">
              {isDirectInput ? (
                <input
                  type="text"
                  placeholder="관계를 입력해주세요"
                  className="w-full h-12 px-5 rounded-[10px] border border-[#828282] text-sm placeholder:text-[#828282] focus:outline-none focus:border-[#18d4c6]"
                />
              ) : (
                <>
                  <select className="w-full h-12 px-5 rounded-[10px] border border-[#828282] text-sm text-[#353535] appearance-none bg-white focus:outline-none focus:border-[#18d4c6]">
                    <option value="" disabled selected>선택해주세요</option>
                    <option value="family">가족</option>
                    <option value="friend">지인</option>
                    <option value="other">기타</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-black ml-1">주소<span className="text-[#ff8e8e]">*</span></label>
            <input
              type="text"
              placeholder="예:서울특별시 서초구 반포대로"
              className="w-full h-12 px-5 rounded-[10px] border border-[#828282] text-sm placeholder:text-[#828282] focus:outline-none focus:border-[#18d4c6]"
            />
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white px-8 pb-8 pt-2">
        <div className="text-center mb-3">
          <span className="text-xs text-[#828282]">본인이신 경우, 입력하지 말고 다음을 눌러주세요.</span>
        </div>
        <button
          onClick={() => router.push('/patient-condition-1')}
          className="w-full h-14 bg-[#18d4c6] rounded-[10px] flex items-center justify-center gap-1 shadow-[1px_1px_2px_rgba(125,140,139,0.5)] hover:bg-[#15bkb0] transition-colors"
        >
          <span className="text-lg font-bold text-white">다음</span>
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </footer>
    </div>
  )
}
