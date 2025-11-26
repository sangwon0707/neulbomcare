"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'

export default function PatientCondition2Page() {
  const router = useRouter()
  const navigate = (path: string) => router.push(path)
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>(['dementia', 'diabetes', 'hypertension'])
  const [selectedMobility, setSelectedMobility] = useState('assistive-device')
  const [otherDisease, setOtherDisease] = useState('')

  const diseases = [
    { id: 'dementia', icon: '🧠', name: '치매/인지장애' },
    { id: 'stroke', icon: '⚡', name: '뇌졸중/중풍' },
    { id: 'cancer', icon: '🎗️', name: '암' },
    { id: 'diabetes', icon: '🍬', name: '당뇨병' },
    { id: 'hypertension', icon: '❤️', name: '고혈압' },
    { id: 'parkinsons', icon: '🤝', name: '파킨슨병' },
    { id: 'arthritis', icon: '🦴', name: '관절염' },
    { id: 'other', icon: '➕', name: '기타' }
  ]

  const mobilityOptions = [
    { id: 'independent', icon: '🚶', label: '혼자 걸을 수 있음', desc: '보조 없이 독립 보행 가능' },
    { id: 'assistive-device', icon: '🦯', label: '보조 기구 필요', desc: '지팡이, 워커 등 사용' },
    { id: 'wheelchair', icon: '♿', label: '휠체어 사용', desc: '휠체어로 이동' },
    { id: 'bedridden', icon: '🛏️', label: '침상 생활', desc: '거동 불가, 침대에서만 생활' }
  ]

  const toggleDisease = (id: string) => {
    setSelectedDiseases(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#f9f7f2] overflow-hidden font-['Pretendard']">
      <div className="flex items-center px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <button
          onClick={() => navigate('/patient-condition-1')}
          className="text-[#18D4C6] bg-transparent border-none cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 mx-5">
          <div className="w-full h-1 bg-transparent rounded-sm flex gap-1">
            <div className="flex-1 h-full bg-[#18D4C6] rounded-sm"></div>
            <div className="flex-1 h-full bg-[#18D4C6] rounded-sm"></div>
            <div className="flex-1 h-full bg-[#18D4C6] rounded-sm"></div>
            <div className="flex-1 h-full bg-gray-200 rounded-sm"></div>
            <div className="flex-1 h-full bg-gray-200 rounded-sm"></div>
          </div>
        </div>
        <div className="text-sm text-black cursor-pointer">건너뛰기</div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-8">
        <div className="mb-8">
          <h2 className="text-[26px] text-gray-800 mb-2">건강 상태를 알려주세요</h2>
          <p className="text-[14px] text-gray-600">더 정확한 간병 계획을 위해 필요합니다</p>
        </div>

        <div className="mb-9">
          <div className="text-[16px] font-semibold text-gray-800 mb-3">주요 질병을 선택해주세요</div>
          <div className="text-[13px] text-gray-600 mb-4">중복 선택 가능</div>

          <div className="grid grid-cols-2 gap-2">
            {diseases.map(disease => (
              <div
                key={disease.id}
                className={`p-4 border-2 rounded-xl text-center cursor-pointer transition-all ${
                  selectedDiseases.includes(disease.id)
                    ? 'border-[#18D4C6] bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => toggleDisease(disease.id)}
              >
                <div className="text-4xl mb-2">{disease.icon}</div>
                <div className="text-[14px] font-medium text-gray-800">{disease.name}</div>
              </div>
            ))}
          </div>

          {selectedDiseases.includes('other') && (
            <div className="mt-3">
              <input
                type="text"
                className="w-full px-3 py-3 border border-gray-200 rounded-lg text-sm text-black bg-white"
                placeholder="기타 질병명을 입력하세요"
                value={otherDisease}
                onChange={(e) => setOtherDisease(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="text-[16px] font-semibold text-gray-800 mb-4">스스로 움직이실 수 있나요?</div>

          <div className="space-y-3">
            {mobilityOptions.map(option => (
              <div
                key={option.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                  selectedMobility === option.id
                    ? 'border-[#18D4C6] bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedMobility(option.id)}
              >
                <div className="text-2xl flex-shrink-0 mt-1">{option.icon}</div>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold text-gray-800 mb-1">{option.label}</div>
                  <div className="text-[12px] text-gray-600">{option.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pb-3">
          <button
            onClick={() => navigate('/patient-condition-3')}
            className="w-full px-5 py-[18px] bg-[#18D4C6] text-white border-none rounded-xl text-[17px] font-semibold cursor-pointer"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  )
}
