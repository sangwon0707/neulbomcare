"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { apiPost } from '@/lib/api'
import ErrorAlert from '@/components/ErrorAlert'
import type { MedicationsCreateRequest, MedicationResponse } from '@/types/api'

export default function PatientCondition3Page() {
  const router = useRouter()
  const [currentMed, setCurrentMed] = useState('')
  const [medicine_names, setMedicineNames] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleAddMedication = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return
    if (currentMed.trim()) {
      setMedicineNames([...medicine_names, currentMed.trim()])
      setCurrentMed('')
    }
  }

  const handleRemoveMedication = (index: number) => {
    setMedicineNames(medicine_names.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const patientId = sessionStorage.getItem('patient_id')
    if (!patientId) {
      alert('환자 정보를 먼저 등록해주세요.')
      router.push('/patient-condition-1')
      return
    }

    // 약물이 없어도 진행 가능하도록 수정 (선택 사항)
    setLoading(true)
    setError(null)

    try {
      if (medicine_names.length > 0) {
        const payload: MedicationsCreateRequest = {
          medicine_names: medicine_names
        }

        const response = await apiPost<MedicationResponse>(
          `/api/patients/${patientId}/medications`,
          payload
        )

        console.log('약물 정보 등록 성공:', response)
      }

      router.push('/caregiver-finder')
    } catch (err) {
      console.error('약물 정보 등록 실패:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f7f2] overflow-hidden font-['Pretendard']">
      <ErrorAlert error={error} onClose={() => setError(null)} />

      <div className="flex items-center px-5 py-4 border-b border-gray-100 shrink-0">
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

        <form onSubmit={handleSubmit}>
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl mb-3 cursor-pointer hover:bg-gray-50 transition-all">
              <div className="text-4xl shrink-0">📸</div>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-gray-800 mb-1">처방전 사진 촬영</div>
                <div className="text-[12px] text-gray-600">AI가 자동으로 약물 정보 인식</div>
              </div>
              <div className="bg-[#18D4C6] text-white text-[11px] px-2 py-1 rounded-full font-semibold shrink-0">추천</div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl mb-3 cursor-pointer hover:bg-gray-50 transition-all">
              <div className="text-4xl shrink-0">✏️</div>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-gray-800 mb-1">약 이름 직접 입력</div>
                <div className="text-[12px] text-gray-600">자동완성 지원</div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
              <div className="text-4xl shrink-0">📊</div>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-gray-800 mb-1">약봉지 바코드 스캔</div>
                <div className="text-[12px] text-gray-600">빠른 등록</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-[14px] font-semibold text-gray-800 mb-3">약물 목록</div>
            <input
              name="currentMed"
              type="text"
              className="w-full px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl text-[15px] text-black bg-white"
              placeholder="약 이름을 입력하세요 (예: 아스피린, 메트포민...)"
              value={currentMed}
              onChange={(e) => setCurrentMed(e.target.value)}
              onKeyDown={handleAddMedication}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {medicine_names.map((med, index) => (
              <div key={index} className="inline-flex items-center gap-2 bg-purple-100 text-purple-900 px-3 py-2 rounded-full text-[14px]">
                <span>{med}</span>
                <span
                  className="cursor-pointer font-bold text-lg leading-none"
                  onClick={() => handleRemoveMedication(index)}
                >
                  ×
                </span>
              </div>
            ))}
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
