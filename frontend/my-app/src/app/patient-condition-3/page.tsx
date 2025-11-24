"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { background, firstPrimary, secondPrimary } from '../colors'

export default function Screen4Medication() {
  const router = useRouter()
  const [medications, setMedications] = useState(['아스피린 100mg', '메트포민 500mg', '암로디핀 5mg'])
  const [currentMed, setCurrentMed] = useState('')
  const [notes, setNotes] = useState('')

  const addMedication = () => {
    if (currentMed.trim()) {
      setMedications([...medications, currentMed.trim()])
      setCurrentMed('')
    }
  }

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const styles = {
    container: {
      height: '100vh',
      background: background,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden' as const
    },
    navBar: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px 20px',
      borderBottom: '1px solid #f0f0f0'
    },
    backBtn: {
      fontSize: '20px',
      cursor: 'pointer',
      color: firstPrimary,
      background: 'none',
      border: 'none'
    },
    progress: {
      flex: 1,
      margin: '0 20px'
    },
    progressBar: {
      width: '100%',
      height: '4px',
      background: 'transparent',
      borderRadius: '2px',
      display: 'flex',
      gap: '4px'
    },
    progressSegment: {
      flex: 1,
      height: '100%',
      background: '#e0e0e0',
      borderRadius: '2px'
    },
    progressSegmentFilled: {
      flex: 1,
      height: '100%',
      background: firstPrimary,
      borderRadius: '2px'
    },
    content: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '30px 20px'
    },
    headerText: {
      marginBottom: '30px'
    },
    h2: {
      fontSize: '26px',
      color: '#333',
      marginBottom: '8px'
    },
    p: {
      fontSize: '14px',
      color: '#666'
    },
    inputMethods: {
      background: '#f9fafb',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '25px'
    },
    inputMethod: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '15px',
      background: 'white',
      borderRadius: '12px',
      marginBottom: '12px',
      cursor: 'pointer',
      border: '2px solid transparent',
      transition: 'all 0.2s'
    },
    methodIcon: {
      fontSize: '32px',
      minWidth: '40px'
    },
    methodText: {
      flex: 1
    },
    methodTitle: {
      fontSize: '15px',
      fontWeight: 600,
      color: '#333',
      marginBottom: '3px'
    },
    methodDesc: {
      fontSize: '12px',
      color: '#666'
    },
    methodBadge: {
      background: firstPrimary,
      color: 'white',
      fontSize: '11px',
      padding: '4px 8px',
      borderRadius: '12px',
      fontWeight: 600
    },
    textInputSection: {
      marginBottom: '25px'
    },
    inputLabel: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#333',
      marginBottom: '10px'
    },
    medicationInput: {
      width: '100%',
      padding: '15px',
      border: '2px dashed #e0e0e0',
      borderRadius: '12px',
      fontSize: '15px',
      fontFamily: 'inherit',
      boxSizing: 'border-box' as const
    },
    medicationChips: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '8px',
      marginBottom: '25px'
    },
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: '#e0e7ff',
      color: '#4c1d95',
      padding: '8px 12px',
      borderRadius: '20px',
      fontSize: '14px'
    },
    chipRemove: {
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold'
    },
    notesSection: {
      marginBottom: '20px'
    },
    notesLabel: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#333',
      marginBottom: '8px'
    },
    notesTextarea: {
      width: '100%',
      minHeight: '100px',
      padding: '15px',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical' as const,
      boxSizing: 'border-box' as const
    },
    exampleText: {
      fontSize: '12px',
      color: '#999',
      marginTop: '5px'
    },
    bottomBar: {
      padding: '20px',
      background: background,
      borderTop: '1px solid #f0f0f0'
    },
    nextButton: {
      width: '100%',
      padding: '18px',
      background: firstPrimary,
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '17px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.navBar}>
        <button style={styles.backBtn} onClick={() => router.push('/patient-condition-2')}>‹</button>
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div style={styles.progressSegmentFilled}></div>
            <div style={styles.progressSegmentFilled}></div>
            <div style={styles.progressSegmentFilled}></div>
            <div style={styles.progressSegmentFilled}></div>
            <div style={styles.progressSegment}></div>
          </div>
        </div>
        <div style={{fontSize: '14px', color: '#000', cursor: 'pointer'}}>건너뛰기</div>
      </div>

      <div style={styles.content}>
        <div style={styles.headerText}>
          <h2 style={styles.h2}>복용 중인 약이 있나요?</h2>
          <p style={styles.p}>정확한 복약 관리를 위해 필요합니다</p>
        </div>

        <div style={styles.inputMethods}>
          <div style={styles.inputMethod}>
            <div style={styles.methodIcon}>📸</div>
            <div style={styles.methodText}>
              <div style={styles.methodTitle}>처방전 사진 촬영</div>
              <div style={styles.methodDesc}>AI가 자동으로 약물 정보 인식</div>
            </div>
            <div style={styles.methodBadge}>추천</div>
          </div>
          <div style={styles.inputMethod}>
            <div style={styles.methodIcon}>✏️</div>
            <div style={styles.methodText}>
              <div style={styles.methodTitle}>약 이름 직접 입력</div>
              <div style={styles.methodDesc}>자동완성 지원</div>
            </div>
          </div>
          <div style={styles.inputMethod}>
            <div style={styles.methodIcon}>📊</div>
            <div style={styles.methodText}>
              <div style={styles.methodTitle}>약봉지 바코드 스캔</div>
              <div style={styles.methodDesc}>빠른 등록</div>
            </div>
          </div>
        </div>

        <div style={styles.textInputSection}>
          <div style={styles.inputLabel}>약물 목록</div>
          <input
            type="text"
            style={styles.medicationInput}
            placeholder="약 이름을 입력하세요 (예: 아스피린, 메트포민...)"
            value={currentMed}
            onChange={(e) => setCurrentMed(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addMedication()}
          />
        </div>

        <div style={styles.medicationChips}>
          {medications.map((med, index) => (
            <div key={index} style={styles.chip}>
              <span>{med}</span>
              <span style={styles.chipRemove} onClick={() => removeMedication(index)}>×</span>
            </div>
          ))}
        </div>

        <div style={styles.notesSection}>
          <div style={styles.notesLabel}>특별히 주의해야 할 사항이 있나요? (선택)</div>
          <textarea
            style={styles.notesTextarea}
            placeholder="예: 낙상 위험 있음, 당 섭취 제한, 특정 음식 알레르기 등"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div style={styles.exampleText}>
            이 정보는 간병인과 AI 케어 플랜에 반영됩니다
          </div>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <button style={styles.nextButton} onClick={() => router.push('/team')}>다음</button>
      </div>
    </div>
  )
}