"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { background, firstPrimary } from '../colors'
import { apiPost } from '@/lib/api'
import ErrorAlert from '@/components/ErrorAlert'
import type { MatchingRequest, MatchingResponse } from '@/types/api'

export default function Screen6Requirements() {
  const router = useRouter()
  const [careType, setCareType] = useState('nursing-aide')
  const [timeSlots, setTimeSlots] = useState<string[]>(['morning', 'afternoon'])
  const [gender, setGender] = useState<'Male' | 'Female' | 'any'>('any')
  const [experience, setExperience] = useState('5plus')
  const [skills, setSkills] = useState<string[]>(['dementia', 'diabetes'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const toggleTimeSlot = (slot: string) => {
    setTimeSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    )
  }

  const toggleSkill = (skill: string) => {
    setSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handleSubmit = async () => {
    const patientId = sessionStorage.getItem('patient_id')
    if (!patientId) {
      alert('환자 정보를 찾을 수 없습니다. 처음부터 다시 시작해주세요.')
      router.push('/patient-condition-1')
      return
    }

    if (timeSlots.length === 0) {
      alert('희망 시간을 최소 1개 이상 선택해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const payload: MatchingRequest = {
        patient_id: parseInt(patientId),
        requirements: {
          care_type: careType,
          time_slots: timeSlots,
          gender: gender,
          experience: experience,
          skills: skills
        }
      }

      const response = await apiPost<MatchingResponse>(
        '/api/matching',
        payload
      )

      console.log('매칭 요청 성공:', response)

      // 매칭 결과를 세션 스토리지에 저장
      sessionStorage.setItem('matching_results', JSON.stringify(response))

      router.push('/matching')
    } catch (err) {
      console.error('매칭 요청 실패:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const styles = {
    container: {
      width: '100%',
      height: '100vh',
      background: background,
      display: 'flex',
      flexDirection: 'column' as const
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
    navTitle: {
      flex: 1,
      textAlign: 'center' as const,
      fontWeight: 600,
      fontSize: '17px'
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
    section: {
      marginBottom: '30px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#333',
      marginBottom: '15px'
    },
    typeOptions: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px'
    },
    typeOption: {
      padding: '15px',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    typeOptionSelected: {
      borderColor: firstPrimary,
      background: '#f0f4ff'
    },
    optionLabel: {
      fontSize: '15px',
      fontWeight: 600,
      color: '#333',
      marginBottom: '4px'
    },
    optionDesc: {
      fontSize: '13px',
      color: '#666'
    },
    timeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px'
    },
    timeCheckbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    timeCheckboxChecked: {
      borderColor: firstPrimary,
      background: '#f0f4ff'
    },
    checkboxIcon: {
      width: '20px',
      height: '20px',
      border: '2px solid #e0e0e0',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px'
    },
    checkboxIconChecked: {
      background: firstPrimary,
      borderColor: firstPrimary,
      color: 'white'
    },
    timeLabel: {
      flex: 1,
      fontSize: '14px',
      color: '#333'
    },
    preferenceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      marginBottom: '15px'
    },
    preferenceBtn: {
      padding: '10px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      textAlign: 'center' as const,
      fontSize: '13px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: 'white'
    },
    preferenceBtnSelected: {
      borderColor: firstPrimary,
      background: '#f0f4ff',
      color: firstPrimary
    },
    skillList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '10px'
    },
    skillItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px',
      background: '#f9fafb',
      borderRadius: '10px'
    },
    skillCheckbox: {
      width: '22px',
      height: '22px',
      accentColor: firstPrimary
    },
    skillLabel: {
      flex: 1,
      fontSize: '14px',
      color: '#333'
    },
    budgetSection: {
      background: '#f9fafb',
      padding: '20px',
      borderRadius: '15px'
    },
    budgetValue: {
      textAlign: 'center' as const,
      fontSize: '32px',
      fontWeight: 700,
      color: firstPrimary,
      margin: '15px 0'
    },
    budgetSlider: {
      width: '100%',
      height: '6px',
      WebkitAppearance: 'none' as const,
      appearance: 'none' as const,
      background: '#e0e0e0',
      borderRadius: '3px',
      outline: 'none'
    },
    budgetInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px',
      fontSize: '12px',
      color: '#999'
    },
    averageInfo: {
      textAlign: 'center' as const,
      fontSize: '13px',
      color: '#666',
      marginTop: '10px'
    },
    bottomBar: {
      padding: '20px 0',
      marginTop: '10px',
      paddingBottom: '100px'
    },
    findButton: {
      width: '100%',
      padding: '18px',
      background: firstPrimary,
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '17px',
      fontWeight: 600,
      cursor: 'pointer',
      opacity: 1
    },
    findButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  }

  return (
    <div style={styles.container}>
      <ErrorAlert error={error} onClose={() => setError(null)} />

      <div style={styles.navBar}>
        <button style={styles.backBtn} onClick={() => router.push('/patient-condition-3')}>←</button>
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div style={styles.progressSegmentFilled}></div>
            <div style={styles.progressSegmentFilled}></div>
            <div style={styles.progressSegmentFilled}></div>
            <div style={styles.progressSegmentFilled}></div>
            <div style={styles.progressSegmentFilled}></div>
          </div>
        </div>
        <div style={{fontSize: '14px', color: '#000', cursor: 'pointer'}}>건너뛰기</div>
      </div>

      <div style={styles.content}>
        <div style={styles.headerText}>
          <h2 style={styles.h2}>어떤 분을 찾으시나요?</h2>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>돌봄 유형</div>
          <div style={styles.typeOptions}>
            <div
              style={{...styles.typeOption, ...(careType === 'nursing-aide' ? styles.typeOptionSelected : {})}}
              onClick={() => setCareType('nursing-aide')}
            >
              <div style={styles.optionLabel}>요양보호사</div>
              <div style={styles.optionDesc}>식사, 목욕, 이동 등 일상 돌봄</div>
            </div>
            <div
              style={{...styles.typeOption, ...(careType === 'nursing-assistant' ? styles.typeOptionSelected : {})}}
              onClick={() => setCareType('nursing-assistant')}
            >
              <div style={styles.optionLabel}>간호조무사</div>
              <div style={styles.optionDesc}>기본 의료 보조 업무</div>
            </div>
            <div
              style={{...styles.typeOption, ...(careType === 'nurse' ? styles.typeOptionSelected : {})}}
              onClick={() => setCareType('nurse')}
            >
              <div style={styles.optionLabel}>간호사</div>
              <div style={styles.optionDesc}>전문 의료 서비스</div>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>희망 시간</div>
          <div style={styles.timeGrid}>
            {[
              { id: 'morning', label: '오전', time: '09:00-12:00' },
              { id: 'afternoon', label: '오후', time: '12:00-18:00' },
              { id: 'evening', label: '저녁', time: '18:00-22:00' },
              { id: 'night', label: '야간', time: '22:00-09:00' }
            ].map(slot => (
              <div
                key={slot.id}
                style={{
                  ...styles.timeCheckbox,
                  ...(timeSlots.includes(slot.id) ? styles.timeCheckboxChecked : {})
                }}
                onClick={() => toggleTimeSlot(slot.id)}
              >
                <div style={{
                  ...styles.checkboxIcon,
                  ...(timeSlots.includes(slot.id) ? styles.checkboxIconChecked : {})
                }}>
                  {timeSlots.includes(slot.id) ? '✓' : ''}
                </div>
                <div style={styles.timeLabel}>
                  <div>{slot.label}</div>
                  <span style={{fontSize: '11px', color: '#999'}}>{slot.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>선호 조건 (선택)</div>

          <div style={{marginBottom: '15px'}}>
            <div style={{fontSize: '13px', color: '#666', marginBottom: '8px'}}>성별</div>
            <div style={styles.preferenceGrid}>
              {[
                { id: 'any' as const, label: '무관' },
                { id: 'Male' as const, label: '남성' },
                { id: 'Female' as const, label: '여성' }
              ].map(g => (
                <button
                  key={g.id}
                  style={{
                    ...styles.preferenceBtn,
                    ...(gender === g.id ? styles.preferenceBtnSelected : {})
                  }}
                  onClick={() => setGender(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{marginBottom: '15px'}}>
            <div style={{fontSize: '13px', color: '#666', marginBottom: '8px'}}>경력</div>
            <div style={styles.preferenceGrid}>
              {[
                { id: 'less1', label: '1년 미만' },
                { id: '1-3', label: '1-3년' },
                { id: '3-5', label: '3-5년' },
                { id: '5plus', label: '5년 이상' }
              ].map(exp => (
                <button
                  key={exp.id}
                  style={{
                    ...styles.preferenceBtn,
                    ...(experience === exp.id ? styles.preferenceBtnSelected : {})
                  }}
                  onClick={() => setExperience(exp.id)}
                >
                  {exp.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{fontSize: '13px', color: '#666', marginBottom: '8px'}}>필요 기술</div>
            <div style={styles.skillList}>
              {[
                { id: 'dementia', label: '치매 환자 케어' },
                { id: 'diabetes', label: '당뇨 환자 케어' },
                { id: 'bedsore', label: '욕창 관리' },
                { id: 'suction', label: '석션 가능' }
              ].map(skill => (
                <label key={skill.id} style={styles.skillItem}>
                  <input
                    type="checkbox"
                    style={styles.skillCheckbox}
                    checked={skills.includes(skill.id)}
                    onChange={() => toggleSkill(skill.id)}
                  />
                  <span style={styles.skillLabel}>{skill.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <button
            style={{
              ...styles.findButton,
              ...(loading ? styles.findButtonDisabled : {})
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '매칭 중...' : '매칭 찾기'}
          </button>
        </div>
      </div>
    </div>
  )
}
