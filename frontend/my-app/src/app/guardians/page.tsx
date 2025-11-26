'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { apiPost } from '@/lib/api'
import ErrorAlert from '@/components/ErrorAlert'
import type { GuardianCreateRequest, GuardianResponse } from '@/types/api'

export default function GuardiansPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<GuardianCreateRequest>({
    name: '',
    phone: '',
    address: '',
    relationship: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone || !formData.address || !formData.relationship) {
      alert('모든 필수 항목을 입력해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiPost<GuardianResponse>(
        '/api/guardians',
        formData
      )

      console.log('보호자 정보 등록 성공:', response)

      // guardian_id를 세션 스토리지에 저장
      sessionStorage.setItem('guardian_id', response.guardian_id.toString())

      router.push('/patient-condition-1')
    } catch (err) {
      console.error('보호자 정보 등록 실패:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#f9f7f2] overflow-hidden font-['Pretendard']">
      <ErrorAlert error={error} onClose={() => setError(null)} />

      {/* Navigation Bar with Progress */}
      <div className="flex items-center px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <button
          onClick={() => router.push('/')}
          className="text-xl text-[#18D4C6] bg-transparent border-none cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 mx-5">
          <div className="w-full h-1 bg-transparent rounded-sm flex gap-1">
            <div className="flex-1 h-full bg-[#18D4C6] rounded-sm"></div>
            <div className="flex-1 h-full bg-gray-200 rounded-sm"></div>
            <div className="flex-1 h-full bg-gray-200 rounded-sm"></div>
            <div className="flex-1 h-full bg-gray-200 rounded-sm"></div>
            <div className="flex-1 h-full bg-gray-200 rounded-sm"></div>
          </div>
        </div>
        <div className="text-sm text-black cursor-pointer">건너뛰기</div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-8">
        <div className="mb-10">
          <h2 className="text-[28px] text-black mb-2">케어 대상자의 버팀목</h2>
          <p className="text-[15px] text-black">보호자분의 기본 정보를 입력해주세요</p>
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-[100px] h-[100px] rounded-full bg-[#f9f7f2] flex items-center justify-center text-5xl mb-4 cursor-pointer border-[3px] border-dashed border-[#18D4C6]">
            👤
          </div>
          <div className="text-[13px] text-black cursor-pointer">프로필 사진 추가 (선택)</div>
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
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              연락처 <span className="text-[#F2643B]">*</span>
            </label>
            <input
              name="phone"
              type="tel"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base text-black bg-white"
              placeholder="예: 010-1234-5678"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              환자와의 관계 <span className="text-[#F2643B]">*</span>
            </label>
            <select
              name="relationship"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base text-black bg-white appearance-none"
              value={formData.relationship}
              onChange={(e) => setFormData({...formData, relationship: e.target.value})}
              required
            >
              <option value="">선택해주세요</option>
              <option value="배우자">배우자</option>
              <option value="자녀">자녀</option>
              <option value="부모">부모</option>
              <option value="형제자매">형제자매</option>
              <option value="손자/손녀">손자/손녀</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              주소 <span className="text-[#F2643B]">*</span>
            </label>
            <input
              name="address"
              type="text"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base text-black bg-white"
              placeholder="예: 서울특별시 서초구 반포대로 222"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
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
