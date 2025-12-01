"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Sun, Moon, Sunset, Sunrise, CheckSquare, Square, Check } from "lucide-react"
import { cn } from "@/utils/cn"

export default function CaregiverFinderPage() {
  const router = useRouter()

  // State
  const [careType, setCareType] = useState<"caregiver" | "general" | null>(null)
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [genderPreference, setGenderPreference] = useState<"any" | "male" | "female">("any")
  const [experiencePreference, setExperiencePreference] = useState<string>("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  // Toggle functions
  const toggleTime = (time: string) => {
    setSelectedTimes(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    )
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white px-4 pt-4 pb-2">
        <div className="flex items-center mb-2">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-[#828282]"
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
            <div className="h-1 flex-1 bg-[#18d4c6] rounded-full" />
          </div>
        </div>

        <div className="text-center mb-3">
          <span className="text-xs text-[#828282]">마지막이에요, 다 왔어요!</span>
        </div>

        <div className="h-px bg-gray-100 -mx-4" />
      </header>

      <main className="flex-1 px-8 pt-6 pb-32 overflow-y-auto">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-[#353535]">어떤 분을 찾으시나요?</h1>
        </div>

        {/* Care Type */}
        <div className="mb-9">
          <h2 className="text-lg font-bold text-black mb-2 ml-1">돌봄 유형</h2>
          <div className="space-y-2">
            <button
              onClick={() => setCareType("caregiver")}
              className={cn(
                "w-full text-left p-5 rounded-[10px] border transition-all shadow-sm",
                careType === "caregiver"
                  ? "bg-[#e8fffd] border-[#18d4c6]"
                  : "bg-white border-[#828282]"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn("text-lg font-bold", careType === "caregiver" ? "text-[#353535]" : "text-[#646464]")}>요양보호사</span>
              </div>
              <span className={cn("text-xs", careType === "caregiver" ? "text-[#353535]" : "text-[#646464]")}>국가 공인 자격증 보유, 재가 방문 요양 전문</span>
            </button>

            <button
              onClick={() => setCareType("general")}
              className={cn(
                "w-full text-left p-5 rounded-[10px] border transition-all shadow-sm",
                careType === "general"
                  ? "bg-[#e8fffd] border-[#18d4c6]"
                  : "bg-white border-[#828282]"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn("text-lg font-bold", careType === "general" ? "text-[#353535]" : "text-[#646464]")}>일반보호사</span>
              </div>
              <span className={cn("text-xs", careType === "general" ? "text-[#353535]" : "text-[#646464]")}>민간 간병 자격 보유, 병원 동행 및 입원 간병</span>
            </button>
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-9">
          <div className="flex items-center gap-2 mb-2 ml-1">
            <h2 className="text-lg font-bold text-black">희망 시간</h2>
            <span className="text-xs text-[#828282]">중복 선택 가능</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "morning", label: "오전", time: "09:00 ~ 12:00", icon: Sunrise },
              { id: "afternoon", label: "오후", time: "12:00 ~ 18:00", icon: Sun },
              { id: "evening", label: "저녁", time: "18:00 ~ 22:00", icon: Sunset },
              { id: "night", label: "야간", time: "22:00 ~ 09:00", icon: Moon },
            ].map((item) => {
              const isSelected = selectedTimes.includes(item.id)
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => toggleTime(item.id)}
                  className={cn(
                    "flex items-center p-3 rounded-lg border transition-all shadow-sm text-left",
                    isSelected
                      ? "bg-[#e8fffd] border-[#18d4c6]"
                      : "bg-white border-[#828282]"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 mr-3 flex items-center justify-center rounded-[2px] border",
                    isSelected ? "bg-[#18d4c6] border-[#18d4c6]" : "bg-white border-[#828282]"
                  )}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <div className={cn("text-sm font-bold mb-0.5", isSelected ? "text-[#353535]" : "text-[#828282]")}>{item.label}</div>
                    <div className={cn("text-xs", isSelected ? "text-[#353535]" : "text-[#828282]")}>{item.time}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-9">
          <h2 className="text-lg font-bold text-black mb-2 ml-1">선호 조건(선택)</h2>

          {/* Gender */}
          <div className="mb-4">
            <span className="text-xs text-[#828282] ml-1 mb-1 block">성별</span>
            <div className="flex gap-2">
              {["any", "male", "female"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderPreference(g as any)}
                  className={cn(
                    "flex-1 py-3 rounded-md border text-sm font-bold transition-all",
                    genderPreference === g
                      ? "bg-[#e8fffd] border-[#18d4c6] text-[#353535] shadow-sm"
                      : "bg-white border-[#828282] text-[#646464]"
                  )}
                >
                  {g === "any" ? "무관" : g === "male" ? "남성" : "여성"}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <span className="text-xs text-[#828282] ml-1 mb-1 block">경력</span>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {["1년 미만", "1-3년", "3-5년"].map((exp) => (
                <button
                  key={exp}
                  onClick={() => setExperiencePreference(exp)}
                  className={cn(
                    "py-3 rounded-md border text-sm font-bold transition-all",
                    experiencePreference === exp
                      ? "bg-[#e8fffd] border-[#18d4c6] text-[#353535] shadow-sm"
                      : "bg-white border-[#828282] text-[#646464]"
                  )}
                >
                  {exp}
                </button>
              ))}
            </div>
            <button
              onClick={() => setExperiencePreference("5년 이상")}
              className={cn(
                "w-full py-3 rounded-md border text-sm font-bold transition-all text-left px-6",
                experiencePreference === "5년 이상"
                  ? "bg-[#e8fffd] border-[#18d4c6] text-[#353535] shadow-sm"
                  : "bg-white border-[#828282] text-[#646464]"
              )}
            >
              5년 이상
            </button>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <span className="text-xs text-[#828282] ml-1 mb-2 block">필요 기술</span>
          <div className="space-y-2">
            {[
              "치매 환자 케어",
              "당뇨 환자 케어",
              "욕창 관리",
              "석션 가능"
            ].map((skill) => {
              const isSelected = selectedSkills.includes(skill)
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={cn(
                    "w-full flex items-center py-3 px-4 rounded-[10px] border transition-all shadow-sm",
                    isSelected
                      ? "bg-[#e8fffd] border-[#18d4c6]"
                      : "bg-white border-[#828282]"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 mr-3 flex items-center justify-center rounded-[2px] border",
                    isSelected ? "bg-[#18d4c6] border-[#18d4c6]" : "bg-white border-[#828282]"
                  )}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={cn("text-sm font-bold", isSelected ? "text-[#353535]" : "text-[#646464]")}>
                    {skill}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white px-8 pb-8 pt-4">
        <button
          onClick={() => router.push('/caregiver-result-loading')} // Final step, go to home or dashboard
          className="w-full h-14 bg-[#18d4c6] rounded-[10px] flex items-center justify-center shadow-[0px_2px_8px_rgba(188,188,188,0.8)] hover:bg-[#15bkb0] transition-colors"
        >
          <span className="text-lg font-bold text-white">매칭 시작하기</span>
        </button>
      </footer>
    </div>
  )
}
