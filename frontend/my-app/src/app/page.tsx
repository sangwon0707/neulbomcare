import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Pill, ShieldCheck, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <section className="relative w-full py-12 px-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-b-[2rem] overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-start space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 leading-tight">
            데이터로 선택하는 <br />
            <span className="text-primary">안심 간병, 늘봄케어</span>
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed max-w-[300px]">
            AI가 분석한 최적의 간병인을 3분 만에 매칭해드립니다.
            가족은 안심하고, 환자는 편안한 케어를 경험하세요.
          </p>
          <div className="pt-4 w-full">
            <Button asChild size="lg" className="w-full rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-bold h-12">
              <Link href="/matching">
                간병인 찾기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Menu */}
      <section className="px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-3 gap-4">
          <Link href="/matching" className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 rounded-full mb-2">
              <ShieldCheck className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-gray-700">AI 매칭</span>
          </Link>
          <Link href="/schedule" className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-3 bg-green-50 rounded-full mb-2">
              <Calendar className="h-6 w-6 text-green-500" />
            </div>
            <span className="text-xs font-medium text-gray-700">일정 관리</span>
          </Link>
          <Link href="/medication" className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-3 bg-orange-50 rounded-full mb-2">
              <Pill className="h-6 w-6 text-orange-500" />
            </div>
            <span className="text-xs font-medium text-gray-700">복약 관리</span>
          </Link>
        </div>
      </section>


    </div >
  )
}
