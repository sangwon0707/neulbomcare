"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Calendar, ChevronRight } from "lucide-react"

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)

    const handleNext = () => {
        if (step === 1) {
            setStep(2)
        } else {
            // 온보딩 완료 플래그 저장
            localStorage.setItem('onboarded', 'true')
            router.push("/personality-test")
        }
    }

    const handleSkip = () => {
        // 온보딩 완료 플래그 저장
        localStorage.setItem('onboarded', 'true')
        router.push("/personality-test")
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#f9f7f2] relative overflow-hidden max-w-[430px] mx-auto font-['Pretendard']">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-20%] w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] bg-pink-100/40 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col flex-1 px-6 pt-20 pb-10">
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                                    <Sparkles className="w-12 h-12 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                                    쉬운 간병 경험을 <br />
                                    시작해보세요
                                </h1>
                                <p className="text-gray-500 leading-relaxed">
                                    늘봄케어와 함께라면 <br />
                                    복잡한 간병 업무도 쉬워집니다.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                                    <Calendar className="w-12 h-12 text-purple-500" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                                    간병 일정이 필요하신가요? <br />
                                    지금 생성해봐요!
                                </h1>
                                <p className="text-gray-500 leading-relaxed">
                                    맞춤형 일정을 생성하고 <br />
                                    체계적으로 관리할 수 있습니다.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Buttons */}
                <div className="space-y-3 mt-8">
                    <Button
                        onClick={handleNext}
                        className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
                    >
                        {step === 1 ? "다음" : "시작하기"} <ChevronRight className="ml-1 w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleSkip}
                        className="w-full text-gray-400 hover:text-gray-600 hover:bg-transparent"
                    >
                        건너뛰기
                    </Button>
                </div>
            </div>
        </div>
    )
}
