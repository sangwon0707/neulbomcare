'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function PatientCondition1Page() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'female',
    relationship: ''
  })

  const handleNext = () => {
    if (formData.name && formData.age && formData.relationship) {
      router.push('/patient-condition-2')
    } else {
      alert('필수 항목을 입력해주세요.')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#f9f7f2] overflow-hidden font-['Pretendard']">
      {/* Navigation Bar with Progress */}
      <div className="flex items-center px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <button
          onClick={() => router.push('/guardians')}
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
        <div className="text-sm text-black cursor-pointer">건너뛰기</div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-8">
        <div className="mb-10">
          <h2 className="text-[28px] text-black mb-2">도움이 필요해요</h2>
          <p className="text-[15px] text-black">케어 대상자의 기본 정보를 입력해주세요</p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              이름 <span className="text-[#F2643B]">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base text-black bg-white"
              placeholder="예: 김영희"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              나이 <span className="text-[#F2643B]">*</span>
            </label>
            <input
              type="number"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base text-black bg-white"
              placeholder="예: 78"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
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
                className={`flex-1 px-4 py-4 border-2 rounded-xl text-center cursor-pointer transition-all ${
                  formData.gender === 'female'
                    ? 'border-[#18D4C6] bg-blue-50'
                    : 'border-gray-200 bg-white'
                } text-black`}
                onClick={() => setFormData({...formData, gender: 'female'})}
              >
                여성
              </div>
              <div
                className={`flex-1 px-4 py-4 border-2 rounded-xl text-center cursor-pointer transition-all ${
                  formData.gender === 'male'
                    ? 'border-[#18D4C6] bg-blue-50'
                    : 'border-gray-200 bg-white'
                } text-black`}
                onClick={() => setFormData({...formData, gender: 'male'})}
              >
                남성
              </div>
            </div>
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              보호자와 관계 <span className="text-[#F2643B]">*</span>
            </label>
            <select
              className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base text-black bg-white appearance-none"
              value={formData.relationship}
              onChange={(e) => setFormData({...formData, relationship: e.target.value})}
              required
            >
              <option value="">선택해주세요</option>
              <option value="mother">어머니</option>
              <option value="father">아버지</option>
              <option value="spouse">배우자</option>
              <option value="grandparent">조부모</option>
              <option value="other">기타</option>
            </select>
          </div>
        </form>

        {/* Next Button */}
        <div className="mt-8 pb-3">
          <button
            onClick={handleNext}
            className="w-full px-5 py-[18px] bg-[#18D4C6] text-white border-none rounded-xl text-[17px] font-semibold cursor-pointer"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  )
}
