"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import { apiPost } from '@/utils/api'
import ErrorAlert from '@/components/ErrorAlert'
import type { PatientResponse } from '@/types/api'

export default function PatientCondition1Page() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: 'Female',
    relationship: '',
    isDirectInput: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.birthDate || !formData.relationship) {
      alert('모든 필수 항목을 입력해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiPost<PatientResponse>(
        '/api/patients',
        {
          ...formData,
          // Calculate age from birthDate if needed, or backend handles it
          // For now, we send birth_date if type allows, or just send age as 0 if we can't calculate easily here without moment/date-fns
          // But wait, I added birth_date to type.
          birth_date: formData.birthDate
        }
      )

      console.log('환자 정보 등록 성공:', response)

      // patient_id를 세션 스토리지에 저장 (다음 페이지에서 사용)
      sessionStorage.setItem('patient_id', response.patient_id.toString())

      router.push('/patient-condition-2')
    } catch (err) {
      console.error('환자 정보 등록 실패:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDirectInput = () => {
    setFormData(prev => ({ ...prev, isDirectInput: !prev.isDirectInput, relationship: '' }))
  }

  return (
    <div className="flex flex-col h-screen bg-[#f9f7f2] overflow-hidden font-['Pretendard']">
      <ErrorAlert error={error} onClose={() => setError(null)} />

      {/* Navigation Bar with Progress */}
      <div className="flex items-center px-5 py-4 border-b border-gray-100 shrink-0">
        <button
          onClick={() => router.push('/home')}
          className="text-xl text-[#18D4C6] bg-transparent border-none cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 mx-5">
          <div className="w-full h-1 bg-transparent rounded-sm flex gap-1">
            <div className="flex-1 h-full bg-[#18D4C6] rounded-sm"></div>
            <div className="flex-1 h-full bg-[#18D4C6] rounded-sm"></div>
            <div className="flex-1 h-full bg-gray-200 rounded-sm"></div>
            <div className="flex-1 h-full bg-gray-200 rounded-sm"></div>
            <div className="flex-1 h-full bg-gray-200 rounded-sm"></div>
          </div>
        </div>
        <div className="w-8"></div> {/* Spacer to balance the header since Skip is removed */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-8">
        <div className="mb-10">
          <h2 className="text-[28px] text-black mb-2">도움이 필요해요</h2>
          <p className="text-[15px] text-black">케어 대상자의 기본 정보를 입력해주세요</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              이름 <span className="text-[#F2643B]">*</span>
            </label>
            <input
              name="name"
              type="text"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base text-black bg-white"
              placeholder="예: 김영희"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              생년월일 <span className="text-[#F2643B]">*</span>
            </label>
            <input
              name="birthDate"
              type="date"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base text-black bg-white"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              성별 <span className="text-[#F2643B]">*</span>
            </label>
            <div className="flex gap-2">
              <div
                className={`flex-1 px-4 py-4 border-2 rounded-xl text-center cursor-pointer transition-all ${formData.gender === 'Female'
                  ? 'border-[#18D4C6] bg-blue-50'
                  : 'border-gray-200 bg-white'
                  } text-black`}
                onClick={() => setFormData({ ...formData, gender: 'Female' })}
              >
                여성
              </div>
              <div
                className={`flex-1 px-4 py-4 border-2 rounded-xl text-center cursor-pointer transition-all ${formData.gender === 'Male'
                  ? 'border-[#18D4C6] bg-blue-50'
                  : 'border-gray-200 bg-white'
                  } text-black`}
                onClick={() => setFormData({ ...formData, gender: 'Male' })}
              >
                남성
              </div>
            </div>
          </div>

          {/* Relationship */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-black">
                보호자와 관계 <span className="text-[#F2643B]">*</span>
              </label>
              <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDirectInput}>
                <span className="text-xs text-gray-500">직접 입력</span>
                <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.isDirectInput ? 'bg-[#18D4C6]' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${formData.isDirectInput ? 'left-[22px]' : 'left-1'}`}></div>
                </div>
              </div>
            </div>

            {formData.isDirectInput ? (
              <input
                name="relationship"
                type="text"
                className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base text-black bg-white"
                placeholder="관계를 입력해주세요"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                required
              />
            ) : (
              <div className="relative">
                <select
                  name="relationship"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base text-black bg-white appearance-none pr-10"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  required
                >
                  <option value="">선택해주세요</option>
                  <option value="어머니">어머니</option>
                  <option value="아버지">아버지</option>
                  <option value="배우자">배우자</option>
                  <option value="조부모">조부모</option>
                  <option value="기타">기타</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          <div className="mt-8 pb-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-[18px] bg-[#18D4C6] text-white border-none rounded-xl text-[17px] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '등록 중...' : '다음'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
