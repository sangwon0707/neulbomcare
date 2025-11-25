'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { User, Phone, MapPin } from 'lucide-react'

export default function GuardiansPage() {
  const router = useRouter()
  const [guardianData, setGuardianData] = useState({
    name: '',
    relationship: '',
    phone: '',
    address: ''
  })

  const handleChange = (field: string, value: string) => {
    setGuardianData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    if (guardianData.name && guardianData.relationship && guardianData.phone && guardianData.address) {
      router.push('/patient-condition')
    } else {
      alert('모든 항목을 입력해주세요.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="px-6 py-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            보호자 정보
          </h1>
          <p className="text-sm text-gray-500">
            간병인을 모실 보호자의 정보를 입력해주세요.
          </p>
        </div>

        <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
          <div className="h-2 bg-primary w-full" />
          <CardContent className="p-6">
            <form className="space-y-6">
              {/* 보호자 이름 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">보호자 이름</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="김영수"
                    value={guardianData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* 환자와의 관계 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">환자와의 관계</label>
                <select
                  value={guardianData.relationship}
                  onChange={(e) => handleChange('relationship', e.target.value)}
                  className="w-full px-4 h-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white focus:border-primary transition-colors"
                >
                  <option value="">선택해주세요</option>
                  <option value="spouse">배우자</option>
                  <option value="child">자녀</option>
                  <option value="parent">부모</option>
                  <option value="sibling">형제자매</option>
                  <option value="grandchild">손자/손녀</option>
                  <option value="other">기타</option>
                </select>
              </div>

              {/* 연락처 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">연락처</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="010-1234-5678"
                    value={guardianData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* 주소 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">주소</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="서울시 강남구 테헤란로 123"
                    value={guardianData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* 버튼들 */}
              <div className="space-y-3 pt-4">
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20"
                >
                  다음 단계
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full h-12 rounded-xl border-gray-200 text-gray-700"
                >
                  이전
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
