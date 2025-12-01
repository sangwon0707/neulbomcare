"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Calendar, ChevronDown } from "lucide-react"
import { cn } from "@/utils/cn"

export default function PatientCondition1Page() {
  const router = useRouter()
  const [gender, setGender] = useState<"female" | "male" | null>(null)
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
            <div className="h-1 flex-1 bg-[#18d4c6] rounded-full" />
            <div className="h-1 flex-1 bg-gray-200 rounded-full" />
            <div className="h-1 flex-1 bg-gray-200 rounded-full" />
            <div className="h-1 flex-1 bg-gray-200 rounded-full" />
          </div>
        </div>

        <div className="h-px bg-gray-100 -mx-4" />
      </header>

      <main className="flex-1 px-8 pt-6 pb-32 overflow-y-auto">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-[#353535] mb-2">도움이 필요해요</h1>
          <p className="text-base font-bold text-[#908d8d]">환자의 기본 정보를 입력해주세요.</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-black ml-1">이름<span className="text-[#ff8e8e]">*</span></label>
            <input
              type="text"
              placeholder="예:김영희"
              className="w-full h-12 px-5 rounded-[10px] border border-[#828282] text-sm placeholder:text-[#828282] focus:outline-none focus:border-[#18d4c6]"
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-black ml-1">생년월일<span className="text-[#ff8e8e]">*</span></label>
            <div className="relative">
              <input
                type="text"
                placeholder="연도-월-일"
                className="w-full h-12 px-5 rounded-[10px] border border-[#828282] text-sm placeholder:text-[#828282] focus:outline-none focus:border-[#18d4c6]"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-800 pointer-events-none" />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-black ml-1">성별<span className="text-[#ff8e8e]">*</span></label>
            <div className="flex gap-2">
              <button
                onClick={() => setGender("female")}
                className={cn(
                  "flex-1 h-12 rounded-[10px] border text-sm font-bold transition-colors",
                  gender === "female"
                    ? "bg-[#e8fffd] border-[#18d4c6] text-[#353535]"
                    : "bg-white border-[#828282] text-[#646464]"
                )}
              >
                여성
              </button>
              <button
                onClick={() => setGender("male")}
                className={cn(
                  "flex-1 h-12 rounded-[10px] border text-sm font-bold transition-colors",
                  gender === "male"
                    ? "bg-[#e8fffd] border-[#18d4c6] text-[#353535]"
                    : "bg-white border-[#828282] text-[#646464]"
                )}
              >
                남성
              </button>
            </div>
          </div>

          {/* Relationship */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-bold text-black">보호자와의 관계<span className="text-[#ff8e8e]">*</span></label>
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
              <select className="w-full h-12 px-5 rounded-[10px] border border-[#828282] text-sm text-[#353535] appearance-none bg-white focus:outline-none focus:border-[#18d4c6]">
                <option value="" disabled selected>선택해주세요</option>
                <option value="family">가족</option>
                <option value="friend">지인</option>
                <option value="other">기타</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white px-8 pb-8 pt-4 space-y-3">
        <button
          onClick={() => router.push('/patient-condition-2')}
          className="w-full h-14 bg-[#18d4c6] rounded-[10px] flex items-center justify-center shadow-[1px_1px_2px_rgba(125,140,139,0.5)] hover:bg-[#15bkb0] transition-colors"
        >
          <span className="text-lg font-bold text-white">저장</span>
        </button>

        <button
          onClick={() => router.back()}
          className="w-full h-14 bg-white rounded-[10px] border border-gray-100 flex items-center justify-center shadow-[0px_1px_4px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg font-bold text-[#828282]">취소</span>
        </button>
      </footer>
    </div>
  )
}
