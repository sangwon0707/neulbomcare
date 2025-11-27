'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CarePlanCreate1 from '@/components/pages/CarePlanCreate1'
import CarePlanCreate2 from '@/components/pages/CarePlanCreate2'
import CarePlanCreate3 from '@/components/pages/CarePlanCreate3'
import CarePlanCreate4 from '@/components/pages/CarePlanCreate4'

export default function CarePlanCreatePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step data can be added here as needed
  })

  const handleDataChange = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }))
  }

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // All steps completed, navigate to dashboard
      router.push('/dashboard')
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <>
      {step === 1 && (
        <CarePlanCreate1
          onNext={handleNextStep}
        />
      )}
      {step === 2 && (
        <CarePlanCreate2
          onNext={handleNextStep}
          onPrev={handlePrevStep}
          initialData={formData}
          onDataChange={handleDataChange}
        />
      )}
      {step === 3 && (
        <CarePlanCreate3
          onNext={handleNextStep}
          onPrev={handlePrevStep}
          initialData={formData}
          onDataChange={handleDataChange}
        />
      )}
      {step === 4 && (
        <CarePlanCreate4
          onNext={handleNextStep}
          onPrev={handlePrevStep}
          initialData={formData}
          onDataChange={handleDataChange}
        />
      )}
    </>
  )
}
