'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronLeft, Bell, X, Check, Star, MapPin, Car, Award } from 'lucide-react'

interface Caregiver {
  caregiver_id?: number
  caregiver_name?: string
  name?: string
  grade?: string
  avg_rating?: number
  total_reviews?: number
  certifications?: string | null
  experience_years?: number
  specialties?: string[] | null
  hourly_rate?: number
  match_score?: number
  profile_image_url?: string
  service_region?: string | null
  has_vehicle?: boolean
}

export default function MyMatchingConfirmedPage() {
  const router = useRouter()
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null)
  const [showBanner, setShowBanner] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Retrieve selected caregiver from session storage
    const stored = sessionStorage.getItem('selectedCaregiver')
    if (stored) {
      setCaregiver(JSON.parse(stored))
    }
    setLoading(false)

    // Auto-hide banner after 5 seconds
    const timer = setTimeout(() => {
      setShowBanner(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // 시간당 요금 포맷
  const formatPrice = (price: number) => {
    return price.toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18D4C6]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white">
        <button className="p-2 -ml-2" onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">나의 간병인</h1>
        <button className="p-2 -mr-2">
          <Bell className="w-6 h-6 text-gray-700" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4 space-y-6 pb-8">
        {/* Matched Banner */}
        {showBanner && (
          <div className="rounded-xl p-4 relative" style={{ backgroundColor: "#E8FFFD" }}>
            <button
              className="absolute top-3 right-3"
              onClick={() => setShowBanner(false)}
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#18D4C6" }}
              >
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
              <div className="pt-1">
                <h2 className="text-lg font-bold text-gray-900">매칭되었습니다!</h2>
                <p className="text-sm text-gray-600">간병인과의 관계가 시작되었습니다.</p>
              </div>
            </div>
          </div>
        )}

        {/* Caregiver Profile Card */}
        {caregiver ? (
          <div className="bg-white rounded-2xl p-5 shadow-sm border-2" style={{ borderColor: "#E8FFFD" }}>
            {/* Header with photo and basic info */}
            <div className="flex gap-4 pb-4 border-b border-gray-100">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: "#E8FFFD" }}
              >
                {caregiver.profile_image_url ? (
                  <img
                    src={caregiver.profile_image_url}
                    alt={caregiver.caregiver_name || caregiver.name || '간병인'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>👨‍⚕️</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {caregiver.caregiver_name || caregiver.name || '간병인'}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-700">
                    {(caregiver.avg_rating || 4.5).toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({caregiver.total_reviews || 0}개 리뷰)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: "#18D4C6", color: "white" }}
                  >
                    {caregiver.grade || '요양보호사'}
                  </span>
                  {caregiver.experience_years && caregiver.experience_years > 0 && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: "#18D4C6", color: "white" }}
                    >
                      경력 {caregiver.experience_years}년
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Detail Info */}
            <div className="py-4 space-y-3">
              {/* Certifications */}
              {caregiver.certifications && (
                <div className="flex items-start gap-2">
                  <Award className="w-5 h-5 text-[#18d4c6] mt-0.5" />
                  <span className="text-sm text-gray-700">
                    <strong>자격증:</strong> {caregiver.certifications}
                  </span>
                </div>
              )}

              {/* Specialties */}
              {caregiver.specialties && caregiver.specialties.length > 0 && (
                <div className="flex items-start gap-2">
                  <Award className="w-5 h-5 text-[#18d4c6] mt-0.5" />
                  <div className="flex-1">
                    <span className="text-sm text-gray-700">
                      <strong>전문 분야:</strong>
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {caregiver.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ backgroundColor: "#E8FFFD", color: "#18D4C6" }}
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Service Region */}
              {caregiver.service_region && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#18d4c6]" />
                  <span className="text-sm text-gray-700">
                    <strong>서비스 지역:</strong> {caregiver.service_region}
                  </span>
                </div>
              )}

              {/* Vehicle */}
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#18d4c6]" />
                <span className="text-sm text-gray-700">
                  <strong>차량 보유:</strong> {caregiver.has_vehicle ? '있음' : '없음'}
                </span>
              </div>

              {/* Rate Info */}
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mt-4">
                <span className="text-sm text-gray-600">시간당 요금</span>
                <span className="text-lg font-bold" style={{ color: "#18D4C6" }}>
                  {caregiver.hourly_rate && caregiver.hourly_rate > 0
                    ? `${formatPrice(caregiver.hourly_rate)}원`
                    : '문의'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <p className="text-gray-500">매칭된 간병인 정보가 없습니다.</p>
            <button
              onClick={() => router.push('/caregiver-result-list')}
              className="mt-4 px-6 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: "#18D4C6" }}
            >
              간병인 찾기
            </button>
          </div>
        )}

        {/* Next Steps Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900">다음 단계</h3>
          <button
            className="w-full py-4 text-white font-semibold rounded-xl transition-colors hover:opacity-90 shadow-md"
            style={{
              backgroundColor: "#18D4C6",
            }}
            onClick={() => router.push('/care-plans-create')}
          >
            AI 맞춤 케어 일정 만들기
          </button>
          <button
            className="w-full py-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-md"
            onClick={() => router.push('/mypage-message')}
          >
            간병인과 채팅하기
          </button>
        </div>

        {/* Review Summary */}
        <div className="bg-white rounded-2xl p-5 border-2" style={{ borderColor: "#E8FFFD" }}>
          <h3 className="text-lg font-bold text-gray-900 mb-2">검토 결과 요약</h3>
          <div className="border-t border-gray-200 mb-4"></div>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <span
                className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#18D4C6" }}
              >
                1
              </span>
              <span className="text-sm text-gray-700">간병인과 채팅으로 세부사항 조율</span>
            </li>
            <li className="flex items-center gap-3">
              <span
                className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#18D4C6" }}
              >
                2
              </span>
              <span className="text-sm text-gray-700">AI가 추천하는 케어 플랜 검토</span>
            </li>
            <li className="flex items-center gap-3">
              <span
                className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#18D4C6" }}
              >
                3
              </span>
              <span className="text-sm text-gray-700">케어 시작 날짜 확정</span>
            </li>
            <li className="flex items-center gap-3">
              <span
                className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#18D4C6" }}
              >
                4
              </span>
              <span className="text-sm text-gray-700">케어 진행 상황 모니터링</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
