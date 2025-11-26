"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { apiPut } from '@/lib/api'
import ErrorAlert from '@/components/ErrorAlert'
import type { HealthStatusUpdateRequest, DiseaseItem, HealthConditionResponse } from '@/types/api'

const diseasesOptions: (DiseaseItem & { icon: string })[] = [
  { id: 'dementia', name: '치매/인지장애', icon: '🧠' },
  { id: 'stroke', name: '뇌졸중/중풍', icon: '⚡' },
  { id: 'cancer', name: '암', icon: '🎗️' },
  { id: 'diabetes', name: '당뇨병', icon: '🍬' },
  { id: 'hypertension', name: '고혈압', icon: '❤️' },
  { id: 'parkinsons', name: '파킨슨병', icon: '🤝' },
  { id: 'arthritis', name: '관절염', icon: '🦴' },
  { id: 'other', name: '기타', icon: '➕' }
]

const mobilityOptions = [
  { id: 'independent', icon: '🚶', label: '혼자 걸을 수 있음', desc: '보조 없이 독립 보행 가능' },
  { id: 'assistive-device', icon: '🦯', label: '보조 기구 필요', desc: '지팡이, 워커 등 사용' },
  { id: 'wheelchair', icon: '♿', label: '휠체어 사용', desc: '휠체어로 이동' },
  { id: 'bedridden', icon: '🛏️', label: '침상 생활', desc: '거동 불가, 침대에서만 생활' }
]

export default function PatientCondition2Page() {
  const router = useRouter()
  const [selectedDiseases, setSelectedDiseases] = useState<DiseaseItem[]>([])
  const [selectedMobility, setSelectedMobility] = useState<string>('')
  const [otherDisease, setOtherDisease] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const toggleDisease = (disease: DiseaseItem) => {
    setSelectedDiseases((prev) =>
      prev.some(d => d.id === disease.id)
        ? prev.filter((d) => d.id !== disease.id)
        : [...prev, { id: disease.id, name: disease.name }]
    )
  }

  const isDiseaseSelected = (id: string) => {
    return selectedDiseases.some(d => d.id === id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const patientId = sessionStorage.getItem('patient_id')
    if (!patientId) {
      alert('환자 정보를 먼저 등록해주세요.')
      router.push('/patient-condition-1')
      return
    }

    if (selectedDiseases.length === 0 || !selectedMobility) {
      alert('질병 정보와 거동 상태를 모두 선택해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const payload: HealthStatusUpdateRequest = {
        selectedDiseases: selectedDiseases,
        mobility_status: selectedMobility
      }

      await apiPut<HealthConditionResponse>(`/api/patients/${patientId}/health-status`, payload)

      console.log('건강 상태 업데이트 성공')
      router.push('/patient-condition-3')
    } catch (err) {
      console.error('건강 상태 업데이트 실패:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#f9f7f2] overflow-hidden font-['Pretendard']">
      <ErrorAlert error={error} onClose={() => setError(null)} />

      <div className="flex items-center px-5 py-4 border-b border-gray-100 shrink-0">
        <button
          onClick={() => router.push('/patient-condition-1')}
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

        <form onSubmit={handleSubmit}>
          <div className="mb-9">
            <div className="text-[16px] font-semibold text-gray-800 mb-3">주요 질병을 선택해주세요</div>
            <div className="text-[13px] text-gray-600 mb-4">중복 선택 가능</div>

            <div className="grid grid-cols-2 gap-2">
              {diseasesOptions.map(disease => (
                <div
                  key={disease.id}
                  className={`p-4 border-2 rounded-xl text-center cursor-pointer transition-all ${
                    isDiseaseSelected(disease.id)
                      ? 'border-[#18D4C6] bg-blue-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => toggleDisease(disease)}
                >
                  <div className="text-4xl mb-2">{disease.icon}</div>
                  <div className="text-[14px] font-medium text-gray-800">{disease.name}</div>
                </div>
              ))}
            </div>

            {isDiseaseSelected('other') && (
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
                  <div className="text-2xl shrink-0 mt-1">{option.icon}</div>
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
              type="submit"
              disabled={loading}
              className="w-full px-5 py-[18px] bg-[#18D4C6] text-white border-none rounded-xl text-[17px] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '저장 중...' : '다음'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
