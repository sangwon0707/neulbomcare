"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { background, firstPrimary, secondPrimary } from '../colors'

export default function Screen3HealthStatus() {
  const router = useRouter()
  const navigate = (path: string) => router.push(path)
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>(['dementia', 'diabetes', 'hypertension'])
  const [selectedMobility, setSelectedMobility] = useState('assistive-device')
  const [otherDisease, setOtherDisease] = useState('')

  const diseases = [
    { id: 'dementia', icon: '🧠', name: '치매/인지장애' },
    { id: 'stroke', icon: '⚡', name: '뇌졸중/중풍' },
    { id: 'cancer', icon: '🎗️', name: '암' },
    { id: 'diabetes', icon: '🍬', name: '당뇨병' },
    { id: 'hypertension', icon: '❤️', name: '고혈압' },
    { id: 'parkinsons', icon: '🤝', name: '파킨슨병' },
    { id: 'arthritis', icon: '🦴', name: '관절염' },
    { id: 'other', icon: '➕', name: '기타' }
  ]

  const mobilityOptions = [
    { id: 'independent', icon: '🚶', label: '혼자 걸을 수 있음', desc: '보조 없이 독립 보행 가능' },
    { id: 'assistive-device', icon: '🦯', label: '보조 기구 필요', desc: '지팡이, 워커 등 사용' },
    { id: 'wheelchair', icon: '♿', label: '휠체어 사용', desc: '휠체어로 이동' },
    { id: 'bedridden', icon: '🛏️', label: '침상 생활', desc: '거동 불가, 침대에서만 생활' }
  ]

  const toggleDisease = (id: string) => {
    setSelectedDiseases(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  const styles = {
    container: {
      width: '100%',
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
    section: {
      marginBottom: '35px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#333',
      marginBottom: '12px'
    },
    sectionSubtitle: {
      fontSize: '13px',
      color: '#666',
      marginBottom: '15px'
    },
    diseaseGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px'
    },
    diseaseCard: {
      padding: '15px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#e0e0e0',
      borderRadius: '12px',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    diseaseCardSelected: {
      borderColor: firstPrimary,
      background: '#f0f4ff'
    },
    diseaseIcon: {
      fontSize: '32px',
      marginBottom: '8px'
    },
    diseaseName: {
      fontSize: '14px',
      color: '#333',
      fontWeight: 500
    },
    otherInput: {
      marginTop: '10px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '14px',
      boxSizing: 'border-box' as const
    },
    mobilityOptions: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px'
    },
    mobilityOption: {
      padding: '15px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#e0e0e0',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    mobilityOptionSelected: {
      borderColor: firstPrimary,
      background: '#f0f4ff'
    },
    mobilityIcon: {
      fontSize: '24px',
      minWidth: '30px'
    },
    mobilityText: {
      flex: 1
    },
    mobilityLabel: {
      fontSize: '15px',
      fontWeight: 600,
      color: '#333',
      marginBottom: '3px'
    },
    mobilityDesc: {
      fontSize: '12px',
      color: '#666'
    },
    bottomBar: {
      padding: '20px 0',
      marginTop: '10px',
      paddingBottom: '100px'
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
        <button style={styles.backBtn} onClick={() => navigate('/patient-condition-1')}>‹</button>
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div style={styles.progressSegmentFilled}></div>
            <div style={styles.progressSegmentFilled}></div>
            <div style={styles.progressSegmentFilled}></div>
            <div style={styles.progressSegment}></div>
            <div style={styles.progressSegment}></div>
          </div>
        </div>
        <div style={{fontSize: '14px', color: '#000', cursor: 'pointer'}}>건너뛰기</div>
      </div>

      <div style={styles.content}>
        <div style={styles.headerText}>
          <h2 style={styles.h2}>건강 상태를 알려주세요</h2>
          <p style={styles.p}>더 정확한 간병 계획을 위해 필요합니다</p>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>주요 질병을 선택해주세요</div>
          <div style={styles.sectionSubtitle}>중복 선택 가능</div>

          <div style={styles.diseaseGrid}>
            {diseases.map(disease => (
              <div
                key={disease.id}
                style={{
                  ...styles.diseaseCard,
                  ...(selectedDiseases.includes(disease.id) ? styles.diseaseCardSelected : {})
                }}
                onClick={() => toggleDisease(disease.id)}
              >
                <div style={styles.diseaseIcon}>{disease.icon}</div>
                <div style={styles.diseaseName}>{disease.name}</div>
              </div>
            ))}
          </div>

          {selectedDiseases.includes('other') && (
            <div style={styles.otherInput}>
              <input
                type="text"
                style={styles.input}
                placeholder="기타 질병명을 입력하세요"
                value={otherDisease}
                onChange={(e) => setOtherDisease(e.target.value)}
              />
            </div>
          )}
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>스스로 움직이실 수 있나요?</div>

          <div style={styles.mobilityOptions}>
            {mobilityOptions.map(option => (
              <div
                key={option.id}
                style={{
                  ...styles.mobilityOption,
                  ...(selectedMobility === option.id ? styles.mobilityOptionSelected : {})
                }}
                onClick={() => setSelectedMobility(option.id)}
              >
                <div style={styles.mobilityIcon}>{option.icon}</div>
                <div style={styles.mobilityText}>
                  <div style={styles.mobilityLabel}>{option.label}</div>
                  <div style={styles.mobilityDesc}>{option.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.bottomBar}>
          <button style={styles.nextButton} onClick={() => navigate('/patient-condition-3')}>다음</button>
        </div>
      </div>
    </div>
  )
}