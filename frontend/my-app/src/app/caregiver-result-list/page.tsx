"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Bell, ChevronRight, Star, MapPin, Car, Award } from "lucide-react"
import { cn } from "@/utils/cn"
import { apiGet } from "@/utils/api"

// 백엔드 matching/results-enhanced API 응답 인터페이스
interface CaregiverMatch {
  matching_id: number
  caregiver_id: number
  caregiver_name: string
  grade: string
  match_score: number
  experience_years: number
  specialties: string[]
  hourly_rate: number
  avg_rating: number
  profile_image_url: string
}

// 백엔드 profiles/caregivers/{id} API 응답 인터페이스
interface CaregiverDetail {
  caregiver_id: number
  user_id: number
  experience_years: number
  certifications: string | null
  specialties: string[] | null
  service_region: string | null
  has_vehicle: boolean
  hourly_rate: number | null
  avg_rating: number
  total_reviews: number
  created_at: string
  updated_at: string
}

// 환자 정보 인터페이스
interface Patient {
  patient_id: number
  name: string
}

// 사용자 정보 인터페이스
interface UserInfo {
  user_id: number
  patient_id?: number
  name: string
}

export default function CaregiverResultListPage() {
  const router = useRouter()
  const [caregivers, setCaregivers] = useState<CaregiverMatch[]>([])
  const [caregiverDetails, setCaregiverDetails] = useState<Record<number, CaregiverDetail>>({})
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})
  const [loadingDetails, setLoadingDetails] = useState<Record<number, boolean>>({})
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 사용자 정보에서 patient_id 가져오기
        try {
          const userData = await apiGet<UserInfo>('/auth/me')
          if (userData?.patient_id) {
            const patientData = await apiGet<Patient>(`/api/patients/${userData.patient_id}`)
            setPatient(patientData)
          }
        } catch (err) {
          console.error('환자 정보 조회 오류:', err)
        }

        // 매칭 결과 가져오기 (최대 10명)
        try {
          const matchResults = await apiGet<CaregiverMatch[]>('/api/matching/results-enhanced')
          setCaregivers(matchResults.slice(0, 10))
        } catch (err) {
          console.error('매칭 결과 조회 오류:', err)
          setError('매칭 결과를 불러오는 중 오류가 발생했습니다')
        }

      } catch (err) {
        console.error('데이터 조회 오류:', err)
        setError('데이터를 불러오는 중 오류가 발생했습니다')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 간병인 상세 정보 가져오기
  const fetchCaregiverDetail = async (caregiverId: number) => {
    if (caregiverDetails[caregiverId]) {
      return caregiverDetails[caregiverId]
    }

    setLoadingDetails(prev => ({ ...prev, [caregiverId]: true }))

    try {
      const detail = await apiGet<CaregiverDetail>(`/api/profiles/caregivers/${caregiverId}`)
      setCaregiverDetails(prev => ({ ...prev, [caregiverId]: detail }))
      return detail
    } catch (err) {
      console.error('간병인 상세 정보 조회 오류:', err)
      return null
    } finally {
      setLoadingDetails(prev => ({ ...prev, [caregiverId]: false }))
    }
  }

  // 카드 뒤집기 토글
  const handleFlipCard = async (caregiverId: number) => {
    // 뒤집히지 않은 상태에서 뒤집을 때 상세 정보 로드
    if (!flippedCards[caregiverId]) {
      await fetchCaregiverDetail(caregiverId)
    }

    setFlippedCards(prev => ({
      ...prev,
      [caregiverId]: !prev[caregiverId]
    }))
  }

  // 시간당 요금 포맷
  const formatPrice = (price: number) => {
    return price.toLocaleString()
  }

  // 태그 생성
  const getTags = (caregiver: CaregiverMatch) => {
    const tags = [caregiver.grade]
    if (caregiver.experience_years > 0) {
      tags.push(`경력 ${caregiver.experience_years}년`)
    }
    return tags
  }

  // 전문 분야 텍스트
  const getSpecialtiesText = (specialties: string[] | null) => {
    if (!specialties || specialties.length === 0) return '전문 분야 정보 없음'
    return specialties.join(' / ')
  }

  // 간병인 선택 핸들러
  const handleSelectCaregiver = (caregiver: CaregiverMatch) => {
    const detail = caregiverDetails[caregiver.caregiver_id]

    // sessionStorage에 선택한 간병인 정보 저장
    const selectedData = {
      caregiver_id: caregiver.caregiver_id,
      caregiver_name: caregiver.caregiver_name,
      grade: caregiver.grade,
      match_score: caregiver.match_score,
      experience_years: detail?.experience_years || caregiver.experience_years,
      specialties: detail?.specialties || caregiver.specialties,
      hourly_rate: detail?.hourly_rate || caregiver.hourly_rate,
      avg_rating: detail?.avg_rating || caregiver.avg_rating,
      total_reviews: detail?.total_reviews || 0,
      profile_image_url: caregiver.profile_image_url,
      certifications: detail?.certifications || null,
      service_region: detail?.service_region || null,
      has_vehicle: detail?.has_vehicle || false
    }

    sessionStorage.setItem('selectedCaregiver', JSON.stringify(selectedData))
    router.push('/mypage-mycaregiver')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white px-4 h-[60px] flex items-center justify-between border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 text-gray-600"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-[#353535]">추천 간병인</h1>
        <button className="p-2 -mr-2 text-gray-600">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 px-6 pt-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18D4C6]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-2xl p-5 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {/* Title Section */}
            <div className="mb-6">
              <h2 className="text-[28px] font-bold text-[#353535] mb-1 leading-tight">
                {patient?.name || '환자'}님에게 적합한 간병인
              </h2>
              <p className="text-base font-bold text-[#828282]">
                {caregivers.length}명의 전문가를 찾았습니다.
              </p>
            </div>

            {/* Caregiver Cards */}
            <div className="space-y-6">
              {caregivers.map((caregiver, index) => {
                const isFlipped = flippedCards[caregiver.caregiver_id]
                const detail = caregiverDetails[caregiver.caregiver_id]
                const isLoadingDetail = loadingDetails[caregiver.caregiver_id]
                const isBest = index === 0

                return (
                  <div
                    key={caregiver.caregiver_id}
                    className="relative"
                    style={{ perspective: '1000px' }}
                  >
                    <div
                      className={cn(
                        "relative w-full transition-transform duration-500",
                        isFlipped && "transform-style-preserve-3d"
                      )}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                      }}
                    >
                      {/* Front Side - 기본 정보 */}
                      <div
                        className={cn(
                          "rounded-[10px] border border-[#18d4c6] bg-white overflow-hidden shadow-[1px_3px_3px_rgba(74,73,73,0.25)]",
                          isFlipped && "invisible"
                        )}
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="p-4 bg-[#FFFFFFB0]">
                          {/* Tags */}
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {getTags(caregiver).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="bg-[#18d4c6] text-white text-sm font-bold px-3.5 py-[9px] rounded-[5px]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Profile Info */}
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-[62px] h-[62px] rounded-full bg-gray-200 flex items-center justify-center border border-gray-100 overflow-hidden">
                              {caregiver.profile_image_url ? (
                                <img
                                  src={caregiver.profile_image_url}
                                  alt={caregiver.caregiver_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-2xl text-gray-400">👤</span>
                              )}
                            </div>
                            <div className="flex flex-col flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xl font-bold text-[#353535]">{caregiver.caregiver_name}</span>
                                <div className="flex items-center gap-0.5">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span className="text-sm text-gray-600">{caregiver.avg_rating.toFixed(1)}</span>
                                </div>
                              </div>
                              <span className="text-sm text-[#828282] mb-1">
                                {getSpecialtiesText(caregiver.specialties)}
                              </span>
                              <span className="text-sm font-bold text-[#353535]">
                                {formatPrice(caregiver.hourly_rate)}원/시간
                              </span>
                            </div>
                          </div>

                          {/* Match Score & Link */}
                          <div className="flex items-center justify-between mb-3">
                            <button className="flex items-center gap-1 text-[#828282]">
                              <ChevronRight className="w-4 h-4" />
                              <span className="text-xs">매칭 근거 확인하기</span>
                            </button>
                            <span className={cn(
                              "font-bold text-lg",
                              caregiver.match_score >= 90 ? "text-[#FF7E7E]" : "text-[#828282]"
                            )}>
                              {caregiver.match_score}% 매칭
                            </span>
                          </div>

                          {/* Divider */}
                          <div className="h-px bg-gray-200 mb-4" />

                          {/* Buttons */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleFlipCard(caregiver.caregiver_id)}
                              className="flex-1 py-4 bg-[#F2F2F2] border border-[#828282] rounded-md text-[#828282] text-base font-bold"
                            >
                              프로필 보기
                            </button>
                            <button
                              onClick={() => handleSelectCaregiver(caregiver)}
                              className={cn(
                                "flex-1 py-4 border rounded-md text-base font-bold",
                                isBest
                                  ? "bg-[#18d4c6] border-[#18d4c6] text-white"
                                  : "bg-[#E8FFFD] border-[#18d4c6] text-[#828282]"
                              )}
                            >
                              선택하기
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Back Side - 상세 정보 */}
                      <div
                        className={cn(
                          "absolute top-0 left-0 w-full rounded-[10px] border border-[#18d4c6] bg-white overflow-hidden shadow-[1px_3px_3px_rgba(74,73,73,0.25)]",
                          !isFlipped && "invisible"
                        )}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        <div className="p-4 bg-[#E8FFFD]">
                          {isLoadingDetail ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#18D4C6]"></div>
                            </div>
                          ) : (
                            <>
                              {/* Header with name */}
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-[#353535]">
                                  {caregiver.caregiver_name} 상세 프로필
                                </h3>
                                <div className="flex items-center gap-1">
                                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                  <span className="font-bold text-[#353535]">{caregiver.avg_rating.toFixed(1)}</span>
                                  <span className="text-sm text-[#828282]">
                                    ({detail?.total_reviews || 0}개 리뷰)
                                  </span>
                                </div>
                              </div>

                              {/* Detail Info */}
                              <div className="space-y-3 mb-4">
                                {/* 경력 */}
                                <div className="flex items-center gap-2">
                                  <Award className="w-5 h-5 text-[#18d4c6]" />
                                  <span className="text-sm text-[#353535]">
                                    <strong>경력:</strong> {detail?.experience_years || caregiver.experience_years}년
                                  </span>
                                </div>

                                {/* 자격증 */}
                                {detail?.certifications && (
                                  <div className="flex items-start gap-2">
                                    <Award className="w-5 h-5 text-[#18d4c6] mt-0.5" />
                                    <span className="text-sm text-[#353535]">
                                      <strong>자격증:</strong> {detail.certifications}
                                    </span>
                                  </div>
                                )}

                                {/* 전문 분야 */}
                                <div className="flex items-start gap-2">
                                  <Award className="w-5 h-5 text-[#18d4c6] mt-0.5" />
                                  <div className="flex-1">
                                    <span className="text-sm text-[#353535]">
                                      <strong>전문 분야:</strong>
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {(detail?.specialties || caregiver.specialties || []).map((specialty, idx) => (
                                        <span
                                          key={idx}
                                          className="bg-white text-[#18d4c6] text-xs px-2 py-1 rounded border border-[#18d4c6]"
                                        >
                                          {specialty}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* 서비스 지역 */}
                                {detail?.service_region && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-[#18d4c6]" />
                                    <span className="text-sm text-[#353535]">
                                      <strong>서비스 지역:</strong> {detail.service_region}
                                    </span>
                                  </div>
                                )}

                                {/* 차량 보유 */}
                                <div className="flex items-center gap-2">
                                  <Car className="w-5 h-5 text-[#18d4c6]" />
                                  <span className="text-sm text-[#353535]">
                                    <strong>차량 보유:</strong> {detail?.has_vehicle ? '있음' : '없음'}
                                  </span>
                                </div>

                                {/* 시간당 요금 */}
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 text-[#18d4c6] text-center font-bold">₩</span>
                                  <span className="text-sm text-[#353535]">
                                    <strong>시간당 요금:</strong> {formatPrice(detail?.hourly_rate || caregiver.hourly_rate)}원
                                  </span>
                                </div>
                              </div>

                              {/* Divider */}
                              <div className="h-px bg-[#18d4c6] opacity-30 mb-4" />

                              {/* Buttons */}
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleFlipCard(caregiver.caregiver_id)}
                                  className="flex-1 py-4 bg-white border border-[#828282] rounded-md text-[#828282] text-base font-bold"
                                >
                                  뒤로 가기
                                </button>
                                <button
                                  onClick={() => handleSelectCaregiver(caregiver)}
                                  className="flex-1 py-4 bg-[#18d4c6] border-[#18d4c6] border rounded-md text-white text-base font-bold"
                                >
                                  선택하기
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {caregivers.length === 0 && !loading && (
              <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <p className="text-gray-500">추천 간병인이 없습니다.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
