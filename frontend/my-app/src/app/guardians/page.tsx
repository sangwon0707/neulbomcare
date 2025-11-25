'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { background, firstPrimary, secondPrimary } from '../colors'

export default function Screen2PatientInfo() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'female',
    relationship: '',
    address: ''
  })

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
      borderBottom: '1px solid #f0f0f0',
      flexShrink: 0
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
      marginBottom: '40px'
    },
    h2: {
      fontSize: '28px',
      color: '#000',
      marginBottom: '10px'
    },
    p: {
      fontSize: '15px',
      color: '#000'
    },
    avatarUpload: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      marginBottom: '30px'
    },
    avatarCircle: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '48px',
      marginBottom: '15px',
      cursor: 'pointer',
      border: `3px dashed ${firstPrimary}`
    },
    formGroup: {
      marginBottom: '20px'
    },
    formLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 600,
      color: '#000',
      marginBottom: '8px'
    },
    required: {
      color: secondPrimary
    },
    formInput: {
      width: '100%',
      padding: '15px',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '16px',
      fontFamily: 'inherit',
      boxSizing: 'border-box' as const,
      color: '#000'
    },
    radioGroup: {
      display: 'flex',
      gap: '10px'
    },
    radioOption: {
      flex: 1,
      padding: '15px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#e0e0e0',
      borderRadius: '12px',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: '#000'
    },
    radioOptionSelected: {
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: firstPrimary,
      background: '#f0f4ff'
    },
    selectWrapper: {
      position: 'relative' as const
    },
    select: {
      width: '100%',
      padding: '15px',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '16px',
      fontFamily: 'inherit',
      appearance: 'none' as const,
      background: 'white',
      boxSizing: 'border-box' as const,
      color: '#000'
    },
    bottomBar: {
      padding: '20px 0',
      marginTop: '20px'
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
        <button style={styles.backBtn} onClick={() => router.push('/')}>‹</button>
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div style={styles.progressSegmentFilled}></div>
            <div style={styles.progressSegment}></div>
            <div style={styles.progressSegment}></div>
            <div style={styles.progressSegment}></div>
            <div style={styles.progressSegment}></div>
          </div>
        </div>
        <div style={{fontSize: '14px', color: '#000', cursor: 'pointer'}}>건너뛰기</div>
      </div>

      <div style={styles.content}>
        <div style={styles.headerText}>
          <h2 style={styles.h2}>케어 대상자의 버팀목</h2>
          <p style={styles.p}>보호자분의 기본 정보를 입력해주세요</p>
        </div>

        <div style={styles.avatarUpload}>
          <div style={styles.avatarCircle}>👤</div>
          <div style={{fontSize: '13px', color: '#000', cursor: 'pointer'}}>프로필 사진 추가 (선택)</div>
        </div>

        <form>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>
              이름 <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              style={styles.formInput}
              placeholder="예: 김영희"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>
              나이 <span style={styles.required}>*</span>
            </label>
            <input
              type="number"
              style={styles.formInput}
              placeholder="예: 40"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              required
            />
          </div>

        <div style={styles.formGroup}>
            <label style={styles.formLabel}>
              주소 <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              style={styles.formInput}
              placeholder="예: 서울특별시 서초구 반포대로 222"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
          </div>



        </form>

        <div style={styles.bottomBar}>
          <button style={styles.nextButton} onClick={() => router.push('/patient-condition-1')}>다음</button>
        </div>
      </div>
    </div>
  )
}