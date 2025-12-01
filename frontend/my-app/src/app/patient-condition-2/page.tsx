"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/utils/cn"

export default function PatientCondition2Page() {
  const router = useRouter()
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([])
  const [movementDescription, setMovementDescription] = useState("")
  const [isOtherActive, setIsOtherActive] = useState(false)
  const [otherDiseaseText, setOtherDiseaseText] = useState("")

  const diseases = [
    {
      id: "dementia",
      label: "치매/인지장애",
      icon: "/assets/ic_dementia.svg",
      activeIcon: "/assets/ic_dementia_fill.svg"
    },
    {
      id: "stroke",
      label: "뇌졸중/중풍",
      icon: "/assets/ic_stroke.svg",
      activeIcon: "/assets/ic_stroke_fill.svg"
    },
    {
      id: "cancer",
      label: "암",
      icon: "/assets/ic_cancer.svg",
      activeIcon: "/assets/ic_cancer_fill.svg"
    },
    {
      id: "diabetes",
      label: "당뇨병",
      icon: "/assets/ic_diabetes.svg",
      activeIcon: "/assets/ic_diabetes_fill.svg"
    },
    {
      id: "hypertension",
      label: "고혈압",
      icon: "/assets/ic_hypertension.svg",
      activeIcon: "/assets/ic_hypertension_fill.svg"
    },
    {
      id: "parkinson",
      label: "파킨슨병",
      icon: "/assets/ic_parkinsons.svg",
      activeIcon: "/assets/ic_parkinsons_fill.svg"
    },
  ]

  const toggleDisease = (id: string) => {
    setSelectedDiseases(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  const handleNext = () => {
    router.push('/patient-condition-3')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white px-4 pt-4 pb-2">
        <div className="flex items-center mb-4">
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
            <div className="h-1 flex-1 bg-gray-200 rounded-full" />
            <div className="h-1 flex-1 bg-gray-200 rounded-full" />
          </div>
        </div>

        <div className="h-px bg-gray-100 -mx-4" />
      </header>

      <main className="flex-1 px-8 pt-6 pb-32 overflow-y-auto">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-[#353535] mb-2">건강 상태를 알려주세요</h1>
          <p className="text-base font-bold text-[#828282]">더 정확한 간병 계획을 위해 필요합니다.</p>
        </div>

        {/* Disease Selection Banner */}
        <div className="bg-[#18d4c6] rounded-[10px] py-3 px-4 mb-4 flex items-center justify-between">
          <span className="text-[17px] font-bold text-white">주요 질병을 선택해주세요.</span>
          <span className="text-xs font-bold text-[#f9f7f2]">중복 선택 가능</span>
        </div>

        {/* Disease Grid */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {diseases.map((disease) => {
            const isSelected = selectedDiseases.includes(disease.id)
            const isStroke = disease.id === 'stroke'

            return (
              <button
                key={disease.id}
                onClick={() => toggleDisease(disease.id)}
                className={cn(
                  "flex flex-col items-center justify-center py-6 gap-3 rounded-[10px] border transition-all shadow-sm h-[120px]",
                  isSelected
                    ? "bg-[#e8fffd] border-[#18d4c6]"
                    : "bg-white border-[#828282]"
                )}
              >
                <div className="w-12 h-12 relative flex items-center justify-center">
                  <Image
                    src={isSelected ? disease.activeIcon : disease.icon}
                    alt={disease.label}
                    width={isStroke ? 36 : 40}
                    height={isStroke ? 36 : 40}
                    className={cn(
                      "object-contain",
                      isStroke ? "w-9 h-9" : "w-10 h-10"
                    )}
                  />
                </div>
                <span className={cn(
                  "text-sm font-bold",
                  isSelected ? "text-[#353535]" : "text-[#828282]"
                )}>
                  {disease.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Other Button / Input */}
        {isOtherActive ? (
          <div className="w-full mb-9 relative">
            <input
              type="text"
              value={otherDiseaseText}
              onChange={(e) => setOtherDiseaseText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNext()
                }
              }}
              placeholder="질병명을 입력해주세요"
              className="w-full h-[54px] px-5 rounded-[10px] border border-[#18d4c6] text-sm font-bold text-[#353535] focus:outline-none bg-[#e8fffd]"
              autoFocus
            />
            <button
              onClick={() => {
                setIsOtherActive(false);
                setOtherDiseaseText("");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#828282]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsOtherActive(true)}
            className="w-full bg-white border border-[#828282] rounded-[10px] py-4 mb-9 shadow-sm hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-[#828282]">기타 (직접 입력)</span>
          </button>
        )}

        {/* Movement Question */}
        <div className="space-y-2 mb-8">
          <h2 className="text-lg font-bold text-[#353535]">스스로 움직이실 수 있나요?</h2>
          <textarea
            value={movementDescription}
            onChange={(e) => setMovementDescription(e.target.value)}
            placeholder="예:걸을 수 있으나 무릎이 많이 안 좋아서 오래 걷지 못합니다"
            className="w-full h-24 p-4 rounded-[10px] border border-[#00000033] text-xs font-bold placeholder:text-[#828282] resize-none focus:outline-none focus:border-[#18d4c6]"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white px-8 pb-8 pt-4">
        <button
          onClick={handleNext}
          className="w-full h-14 bg-[#18d4c6] rounded-[10px] flex items-center justify-center gap-1 shadow-[1px_1px_2px_rgba(125,140,139,0.5)] hover:bg-[#15bkb0] transition-colors"
        >
          <span className="text-lg font-bold text-white">다음</span>
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </footer>
    </div>
  )
}
