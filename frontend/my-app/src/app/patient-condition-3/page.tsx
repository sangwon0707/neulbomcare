"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'

export default function PatientCondition3Page() {
  const router = useRouter()
  const [medications, setMedications] = useState(['아스피린 100mg', '메트포민 500mg', '암로디핀 5mg'])
  const [currentMed, setCurrentMed] = useState('')
  const [notes, setNotes] = useState('')

  const addMedication = () => {
    if (currentMed.trim()) {
      setMedications([...medications, currentMed.trim()])
      setCurrentMed('')
    }
  }

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f7f2] overflow-hidden font-['Pretendard']">
      <div className="flex items-center px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <button
          onClick={() => router.push('/patient-condition-2')}
          className="text-[#18D4C6] bg-transparent border-none cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 mx-5">
          <div className="w-full h-1 bg-transparent rounded-sm flex gap-1">
            <div className="flex-1 h-full bg-[#18D4C6] rounded-sm"></div>
            <div className="flex-1 h-full bg-[#18D4C6] rounded-sm"></div>
            <div className="flex-1 h-full bg-[#18D4C6] rounded-sm"></div>
            <div className="flex-1 h-full bg-[#18D4C6] rounded-sm"></div>
            <div className="flex-1 h-full bg-gray-200 rounded-sm"></div>
          </div>
        </div>
        <div className="text-sm text-black cursor-pointer">건너뛰기</div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-8">
        <div className="mb-8">
          <h2 className="text-[26px] text-gray-800 mb-2">복용 중인 약이 있나요?</h2>
          <p className="text-[14px] text-gray-600">정확한 복약 관리를 위해 필요합니다</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-4 p-4 bg-white rounded-xl mb-3 cursor-pointer hover:bg-gray-50 transition-all">
            <div className="text-4xl flex-shrink-0">📸</div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-gray-800 mb-1">처방전 사진 촬영</div>
              <div className="text-[12px] text-gray-600">AI가 자동으로 약물 정보 인식</div>
            </div>
            <div className="bg-[#18D4C6] text-white text-[11px] px-2 py-1 rounded-full font-semibold flex-shrink-0">추천</div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white rounded-xl mb-3 cursor-pointer hover:bg-gray-50 transition-all">
            <div className="text-4xl flex-shrink-0">✏️</div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-gray-800 mb-1">약 이름 직접 입력</div>
              <div className="text-[12px] text-gray-600">자동완성 지원</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
            <div className="text-4xl flex-shrink-0">📊</div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-gray-800 mb-1">약봉지 바코드 스캔</div>
              <div className="text-[12px] text-gray-600">빠른 등록</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-[14px] font-semibold text-gray-800 mb-3">약물 목록</div>
          <input
            type="text"
            className="w-full px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl text-[15px] text-black bg-white"
            placeholder="약 이름을 입력하세요 (예: 아스피린, 메트포민...)"
            value={currentMed}
            onChange={(e) => setCurrentMed(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addMedication()}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {medications.map((med, index) => (
            <div key={index} className="inline-flex items-center gap-2 bg-purple-100 text-purple-900 px-3 py-2 rounded-full text-[14px]">
              <span>{med}</span>
              <span
                className="cursor-pointer font-bold text-lg leading-none"
                onClick={() => removeMedication(index)}
              >
                ×
              </span>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="text-[14px] font-semibold text-gray-800 mb-2">특별히 주의해야 할 사항이 있나요? (선택)</div>
          <textarea
            className="w-full min-h-[100px] px-4 py-4 border border-gray-200 rounded-xl text-[14px] text-black bg-white resize-vertical"
            placeholder="예: 낙상 위험 있음, 당 섭취 제한, 특정 음식 알레르기 등"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="text-[12px] text-gray-500 mt-2">
            이 정보는 간병인과 AI 케어 플랜에 반영됩니다
          </div>
        </div>

        <div className="mt-8 pb-3">
          <button
            onClick={() => router.push('/caregiver-finder')}
            className="w-full px-5 py-[18px] bg-[#18D4C6] text-white border-none rounded-xl text-[17px] font-semibold cursor-pointer"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  )
}
