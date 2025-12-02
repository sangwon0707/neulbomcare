"use client"

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ChevronLeft, Bell, Calendar, Heart } from 'lucide-react'
import { apiGet, apiPost } from '@/utils/api'

// 백엔드 CareReportResponse 스키마에 맞는 인터페이스
interface CareReport {
  report_id: number
  patient_id: number
  report_type: 'daily' | 'weekly'
  start_date: string
  end_date: string
  medication_completion_rate: number | null
  meal_completion_rate: number | null
  health_status_summary: string | null
  improvement_suggestions: string | null
  created_at: string
}

// 백엔드 MealPlanResponse 스키마에 맞는 인터페이스
interface MealPlan {
  plan_id: number
  patient_id: number
  meal_date: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  menu_name: string
  ingredients: string | null
  nutrition_info: {
    calories?: number
    protein_g?: number
    carbs_g?: number
    fat_g?: number
    sodium_mg?: number
    fiber_g?: number
  } | null
  cooking_tips: string | null
  created_at: string
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

// /api/patients/me 응답 인터페이스
interface PatientsResponse {
  patients: Array<{
    patient_id: number
    name: string
    age: number
    gender: string
  }>
  latest_patient: {
    patient_id: number
    name: string
  }
  total: number
}

export default function CareReportPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"daily" | "meal">("daily")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [careReport, setCareReport] = useState<CareReport | null>(null)
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [patient, setPatient] = useState<Patient | null>(null)
  const [patientId, setPatientId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 사용자 정보 및 환자 ID 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          setError('로그인이 필요합니다')
          setLoading(false)
          return
        }

        // 1. 먼저 sessionStorage에서 patient_id 확인
        const storedPatientId = sessionStorage.getItem('patient_id')
        if (storedPatientId) {
          setPatientId(parseInt(storedPatientId))
          return
        }

        // 2. /api/patients/me API로 환자 목록 가져오기
        try {
          const patientsData = await apiGet<PatientsResponse>('/api/patients/me')
          if (patientsData?.latest_patient?.patient_id) {
            setPatientId(patientsData.latest_patient.patient_id)
            // sessionStorage에 저장해두기
            sessionStorage.setItem('patient_id', patientsData.latest_patient.patient_id.toString())
            return
          }
        } catch (err) {
          console.error('환자 목록 조회 오류:', err)
        }

        // 3. 환자를 찾을 수 없는 경우
        setError('등록된 환자가 없습니다. 환자 정보를 먼저 등록해주세요.')
        setLoading(false)
      } catch (err) {
        console.error('사용자 정보 조회 오류:', err)
        setError('사용자 정보를 불러오는 중 오류가 발생했습니다')
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  // 케어 리포트 데이터 가져오기
  useEffect(() => {
    const fetchCareReport = async () => {
      if (!patientId) return

      try {
        setLoading(true)
        setError(null)

        // 케어 리포트 목록에서 해당 날짜의 리포트 찾기
        try {
          const reports = await apiGet<CareReport[]>('/care/care_reports')
          // 선택된 날짜에 해당하는 리포트 찾기
          const matchingReport = reports.find(r =>
            r.start_date <= selectedDate && r.end_date >= selectedDate
          )
          setCareReport(matchingReport || null)
        } catch (err) {
          console.error('케어 리포트 조회 오류:', err)
        }

        // 환자 정보 가져오기
        try {
          const patientData = await apiGet<Patient>(`/api/patients/${patientId}`)
          setPatient(patientData)
        } catch (err) {
          console.error('환자 정보 조회 오류:', err)
        }

        // 해당 날짜의 식단 가져오기
        try {
          const meals = await apiGet<MealPlan[]>(
            `/api/meal-plans/patients/${patientId}/meals?start_date=${selectedDate}&end_date=${selectedDate}`
          )
          setMealPlans(meals)
        } catch (err) {
          console.error('식단 조회 오류:', err)
        }

      } catch (err) {
        console.error('데이터 조회 오류:', err)
        setError('데이터를 불러오는 중 오류가 발생했습니다')
      } finally {
        setLoading(false)
      }
    }

    fetchCareReport()
  }, [patientId, selectedDate])

  // PDF 내보내기
  const handleExportPDF = async () => {
    if (!patientId) {
      alert('환자 정보를 찾을 수 없습니다')
      return
    }

    try {
      const data = await apiPost<{ download_url: string }>(
        `/api/care-reports/generate-pdf/${patientId}`,
        {
          start_date: selectedDate,
          end_date: selectedDate,
          report_type: 'daily'
        }
      )
      window.open(data.download_url, '_blank')
    } catch (err) {
      console.error('PDF 생성 오류:', err)
      alert('PDF 생성 중 오류가 발생했습니다')
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  // 식사 타입 한글 변환
  const getMealTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      breakfast: '아침 (08:00)',
      lunch: '점심 (12:00)',
      dinner: '저녁 (18:00)',
      snack: '간식'
    }
    return labels[type] || type
  }

  // 식사 타입 정렬 순서
  const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack']

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white">
        <button className="p-2 -ml-2" onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">오늘의 케어 리포트</h1>
        <button className="p-2 -mr-2">
          <Bell className="w-6 h-6 text-gray-700" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto pb-24">
        {/* Date Picker */}
        <div className="flex justify-end">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent outline-none"
            />
            <Calendar className="w-4 h-4" />
          </div>
        </div>

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
            {/* Main Report Card */}
            <div className="bg-white rounded-2xl p-5 border-2" style={{ borderColor: "#E8FFFD" }}>
              <p className="text-sm text-gray-500 mb-1">{formatDate(selectedDate)}</p>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {patient?.name || '환자'}님 케어 리포트
              </h2>
              <div className="border-t border-gray-200 mb-3"></div>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5" style={{ color: "#18D4C6" }} fill="#18D4C6" />
                <span className="font-semibold text-gray-700">전반적인 상태</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {careReport?.health_status_summary ||
                  `오늘 ${patient?.name || '환자'} 어머니는 전반적으로 양호한 상태를 보이셨습니다.`}
              </p>
            </div>

            {/* Tab Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("daily")}
                className="flex-1 py-3 rounded-xl font-medium transition-colors shadow-md"
                style={
                  activeTab === "daily"
                    ? { backgroundColor: "#18D4C6", color: "white" }
                    : { backgroundColor: "white", color: "#6B7280", border: "1px solid #E5E7EB" }
                }
              >
                일간 리포트
              </button>
              <button
                onClick={() => setActiveTab("meal")}
                className="flex-1 py-3 rounded-xl font-medium transition-colors shadow-md"
                style={
                  activeTab === "meal"
                    ? { backgroundColor: "#18D4C6", color: "white" }
                    : { backgroundColor: "white", color: "#6B7280", border: "1px solid #E5E7EB" }
                }
              >
                추천 식단
              </button>
            </div>

            {/* Daily Report Content */}
            {activeTab === "daily" && (
              <>
                {/* Today's Data Section */}
                <div className="bg-white rounded-2xl p-5 border-2" style={{ borderColor: "#E8FFFD" }}>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">오늘의 데이터</h3>
                  <div className="border-t border-gray-200 mb-4"></div>

                  <div className="space-y-4">
                    {/* Progress Bars */}
                    <div className="pt-2 space-y-3">
                      <ProgressItem
                        label="약물 복용률"
                        value={careReport?.medication_completion_rate ?? 0}
                      />
                      <ProgressItem
                        label="식사 섭취율"
                        value={careReport?.meal_completion_rate ?? 0}
                      />
                    </div>
                  </div>
                </div>

                {/* Improvement Suggestions Section */}
                {careReport?.improvement_suggestions && (
                  <div className="bg-white rounded-2xl p-5 border-2" style={{ borderColor: "#E8FFFD" }}>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">개선 제안</h3>
                    <div className="border-t border-gray-200 mb-4"></div>
                    <ul className="space-y-4">
                      {careReport.improvement_suggestions.split('\n').filter(Boolean).map((suggestion, idx) => (
                        <SuggestionItem key={idx} number={idx + 1} text={suggestion} />
                      ))}
                    </ul>
                  </div>
                )}

                {!careReport && (
                  <div className="bg-white rounded-2xl p-5 border-2 text-center" style={{ borderColor: "#E8FFFD" }}>
                    <p className="text-gray-500">해당 날짜의 케어 리포트가 없습니다.</p>
                  </div>
                )}
              </>
            )}

            {/* Meal Plan Content */}
            {activeTab === "meal" && (
              <>
                {mealPlans.length > 0 ? (
                  <>
                    {mealPlans
                      .sort((a, b) => mealTypeOrder.indexOf(a.meal_type) - mealTypeOrder.indexOf(b.meal_type))
                      .map((meal) => (
                        <MealCard
                          key={meal.plan_id}
                          mealType={getMealTypeLabel(meal.meal_type)}
                          menuName={meal.menu_name}
                          ingredients={meal.ingredients || ''}
                          nutrition={{
                            calories: meal.nutrition_info?.calories ?? 0,
                            protein: meal.nutrition_info?.protein_g ?? 0,
                            carbs: meal.nutrition_info?.carbs_g ?? 0,
                            fat: meal.nutrition_info?.fat_g ?? 0
                          }}
                          tips={meal.cooking_tips || ''}
                        />
                      ))
                    }

                    {/* Daily Nutrition Summary */}
                    <div className="bg-white rounded-2xl p-5 border-2" style={{ borderColor: "#E8FFFD" }}>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">오늘의 영양 정보</h3>
                      <div className="border-t border-gray-200 mb-4"></div>

                      <div className="space-y-3">
                        <NutritionBar
                          label="총 칼로리"
                          value={mealPlans.reduce((sum, m) => sum + (m.nutrition_info?.calories ?? 0), 0)}
                          unit="kcal"
                          max={1500}
                          color="#18D4C6"
                        />
                        <NutritionBar
                          label="단백질"
                          value={mealPlans.reduce((sum, m) => sum + (m.nutrition_info?.protein_g ?? 0), 0)}
                          unit="g"
                          max={70}
                          color="#18D4C6"
                        />
                        <NutritionBar
                          label="탄수화물"
                          value={mealPlans.reduce((sum, m) => sum + (m.nutrition_info?.carbs_g ?? 0), 0)}
                          unit="g"
                          max={220}
                          color="#18D4C6"
                        />
                        <NutritionBar
                          label="지방"
                          value={mealPlans.reduce((sum, m) => sum + (m.nutrition_info?.fat_g ?? 0), 0)}
                          unit="g"
                          max={40}
                          color="#18D4C6"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-2xl p-5 border-2 text-center" style={{ borderColor: "#E8FFFD" }}>
                    <p className="text-gray-500">해당 날짜의 식단 정보가 없습니다.</p>
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <p className="text-center text-sm text-gray-500">이 보고서를 가족 구성원에게 카카오톡으로 전송합니다.</p>
              <button
                className="w-full py-4 text-white font-semibold rounded-xl transition-colors hover:opacity-90 shadow-md"
                style={{ backgroundColor: "#18D4C6" }}
              >
                가족에게 공유하기
              </button>
              <button
                onClick={handleExportPDF}
                className="w-full py-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-md"
              >
                PDF 내보내기
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function ProgressItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-900">{value}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: "#18D4C6" }} />
      </div>
    </div>
  )
}

function SuggestionItem({ number, text }: { number: number; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: "#18D4C6" }}
      >
        {number}
      </span>
      <span className="text-sm text-gray-700 leading-relaxed">{text}</span>
    </li>
  )
}

function MealCard({
  mealType,
  menuName,
  ingredients,
  nutrition,
  tips,
}: {
  mealType: string
  menuName: string
  ingredients: string
  nutrition: { calories: number; protein: number; carbs: number; fat: number }
  tips: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border-2" style={{ borderColor: "#E8FFFD" }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🍽️</span>
        <h3 className="text-lg font-bold text-gray-900">{mealType}</h3>
      </div>
      <div className="border-t border-gray-200 mb-4"></div>

      <div className="space-y-3">
        {/* Menu Name */}
        <div>
          <p className="text-sm text-gray-500 mb-1">메뉴</p>
          <p className="text-base font-semibold text-gray-900">{menuName}</p>
        </div>

        {/* Ingredients */}
        {ingredients && (
          <div>
            <p className="text-sm text-gray-500 mb-1">재료</p>
            <p className="text-sm text-gray-700">{ingredients}</p>
          </div>
        )}

        {/* Nutrition */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-500 mb-2">영양 정보</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">열량:</span>{" "}
              <span className="font-semibold">{nutrition.calories}kcal</span>
            </div>
            <div>
              <span className="text-gray-600">단백질:</span>{" "}
              <span className="font-semibold">{nutrition.protein}g</span>
            </div>
            <div>
              <span className="text-gray-600">탄수화물:</span>{" "}
              <span className="font-semibold">{nutrition.carbs}g</span>
            </div>
            <div>
              <span className="text-gray-600">지방:</span> <span className="font-semibold">{nutrition.fat}g</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        {tips && (
          <div
            className="rounded-lg p-3 border-l-4"
            style={{ backgroundColor: "#E8FFFD", borderColor: "#18D4C6" }}
          >
            <p className="text-sm font-medium" style={{ color: "#18D4C6" }}>
              💡 조리 팁
            </p>
            <p className="text-sm text-gray-700 mt-1">{tips}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function NutritionBar({
  label,
  value,
  unit,
  max,
  color,
}: {
  label: string
  value: number
  unit: string
  max: number
  color: string
}) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {Math.round(value)}
          {unit} / {max}
          {unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="h-2 rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}
