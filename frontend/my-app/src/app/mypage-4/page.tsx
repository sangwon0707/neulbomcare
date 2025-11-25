"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { background, firstPrimary, secondPrimary } from '../colors'

export default function Screen14Checklist() {
  const router = useRouter()
  const [memo, setMemo] = useState('오늘 기분이 좋아 보이심.\n손주 이야기에 미소 지으심.')

  const styles = {
    header: {
      background: background,
      color: 'black',
      padding: '20px'
    },
    patientInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    },
    patientName: {
      fontSize: '18px',
      fontWeight: 600
    },
    emergencyBtn: {
      background: secondPrimary,
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    dateInfo: {
      fontSize: '14px',
      opacity: 0.9
    },
    alertCard: {
      background: 'rgba(208, 0, 111, 0.15)',
      borderLeft: `4px solid ${secondPrimary}`,
      padding: '12px',
      borderRadius: '8px',
      marginTop: '12px'
    },
    alertCardH4: {
      fontSize: '14px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    alertList: {
      fontSize: '12px',
      lineHeight: 1.6,
      marginLeft: '15px'
    },
    content: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '20px',
      background: background
    },
    currentActivity: {
      background: 'white',
      color: 'black',
      padding: '20px',
      borderRadius: '15px',
      marginBottom: '20px'
    },
    currentTime: {
      fontSize: '14px',
      opacity: 0.9,
      marginBottom: '5px'
    },
    activityTitle: {
      fontSize: '20px',
      fontWeight: 600,
      marginBottom: '15px'
    },
    activityDetails: {
      background: 'rgba(255,255,255,0.2)',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '13px',
      marginBottom: '12px'
    },
    activityDetailsH5: {
      marginBottom: '5px',
      fontSize: '12px',
      opacity: 0.9
    },
    checklist: {
      marginTop: '12px'
    },
    checklistItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
      fontSize: '13px'
    },
    checklistCheckbox: {
      width: '18px',
      height: '18px',
      accentColor: 'white'
    },
    memoSection: {
      background: 'white',
      padding: '12px',
      borderRadius: '8px',
      marginTop: '12px'
    },
    memoSectionH5: {
      fontSize: '13px',
      color: '#333',
      marginBottom: '8px'
    },
    memoInput: {
      width: '100%',
      padding: '10px',
      border: '1px solid rgba(0,0,0,0.1)',
      borderRadius: '6px',
      fontSize: '13px',
      resize: 'vertical' as const,
      minHeight: '60px',
      fontFamily: 'inherit',
      boxSizing: 'border-box' as const
    },
    voiceBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
      background: 'white',
      color: '#f5576c',
      padding: '10px',
      borderRadius: '8px',
      border: 'none',
      marginTop: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '13px',
      width: '100%'
    },
    mediaButtons: {
      display: 'flex',
      gap: '8px',
      marginTop: '8px'
    },
    mediaBtn: {
      flex: 1,
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid rgba(0,0,0,0.1)',
      background: 'white',
      fontSize: '13px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
      marginTop: '15px'
    },
    actionBtn: {
      flex: 1,
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '14px'
    },
    btnSkip: {
      background: background,
      color: 'black'
    },
    btnComplete: {
      background: firstPrimary,
      color: 'white'
    },
    sectionTitle: {
      fontSize: '12px',
      fontWeight: 600,
      color: '#999',
      textTransform: 'uppercase' as const,
      marginBottom: '12px',
      marginTop: '20px'
    },
    completedActivity: {
      background: 'white',
      padding: '15px',
      borderRadius: '12px',
      marginBottom: '12px',
      borderLeft: `3px solid ${secondPrimary}`
    },
    activityHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px'
    },
    activityTime: {
      fontWeight: 600,
      color: '#333'
    },
    completedBadge: {
      background: '#d1fae5',
      color: '#065f46',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 600
    },
    activityNote: {
      fontSize: '13px',
      color: '#666',
      marginTop: '5px'
    },
    upcomingActivity: {
      background: 'white',
      padding: '15px',
      borderRadius: '12px',
      marginBottom: '12px',
      borderLeft: '3px solid #e0e0e0'
    },
    upcomingBadge: {
      background: '#f3f4f6',
      color: '#6b7280',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 600
    },
    bottomNav: {
      display: 'flex',
      background: background,
      borderTop: '1px solid #f0f0f0',
      padding: '10px 0'
    },
    navItem: {
      flex: 1,
      textAlign: 'center' as const,
      padding: '5px',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      color: '#999'
    },
    navItemActive: {
      color: firstPrimary
    },
    navIcon: {
      fontSize: '24px',
      marginBottom: '3px'
    },
    navLabel: {
      fontSize: '11px'
    }
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    overflow: 'hidden'
  }

  return (
    <div style={containerStyle}>
      <div style={styles.header}>
        <div style={styles.patientInfo}>
          <div style={styles.patientName}>김영희 어머니 (78세)</div>
          <button style={styles.emergencyBtn}>🚨 긴급</button>
        </div>
        <div style={styles.dateInfo}>2025년 11월 12일 화요일</div>

        <div style={styles.alertCard}>
          <h4 style={styles.alertCardH4}>🔴 오늘의 주의사항</h4>
          <ul style={styles.alertList}>
            <li>혈압 측정 필수 (오전/오후 2회)</li>
            <li>낙상 위험: 화장실 이동 시 보조</li>
            <li>당 섭취 제한: 간식 주의</li>
            <li>신규 처방약: 오메프라졸 20mg (점심 후)</li>
          </ul>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.currentActivity}>
          <div style={styles.currentTime}>⏰ 지금 (14:45)</div>
          <div style={styles.activityTitle}>15:00 말벗/여가활동 [30분]</div>

          <div style={styles.activityDetails}>
            <h5 style={styles.activityDetailsH5}>활동 세부사항</h5>
            • 오늘의 대화 주제: 옛날 이야기<br />
            • 준비물: 옛날 사진 앨범<br />
            • 주의: 부정적 기억 회상 시 전환
          </div>

          <div style={styles.checklist}>
            <div style={styles.checklistItem}>
              <input type="checkbox" style={styles.checklistCheckbox} />
              <span>편안한 자세로 앉히기</span>
            </div>
            <div style={styles.checklistItem}>
              <input type="checkbox" style={styles.checklistCheckbox} defaultChecked />
              <span>대화 시작 (개방형 질문 활용)</span>
            </div>
            <div style={styles.checklistItem}>
              <input type="checkbox" style={styles.checklistCheckbox} />
              <span>반응 관찰 및 기록</span>
            </div>
          </div>

          <div style={styles.memoSection}>
            <h5 style={styles.memoSectionH5}>메모 입력</h5>
            <textarea
              style={styles.memoInput}
              placeholder="오늘 관찰한 내용을 기록해주세요..."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
            <button style={styles.voiceBtn}>🎤 음성 메모 (최대 1분)</button>
            <div style={styles.mediaButtons}>
              <button style={styles.mediaBtn}>📸 사진 추가</button>
              <button style={styles.mediaBtn}>🎥 영상 추가</button>
            </div>
          </div>

          <div style={styles.actionButtons}>
            <button style={{...styles.actionBtn, ...styles.btnSkip}}>건너뛰기</button>
            <button style={{...styles.actionBtn, ...styles.btnComplete}}>완료</button>
          </div>
        </div>

        <div style={styles.sectionTitle}>✅ 완료된 활동</div>

        <div style={styles.completedActivity}>
          <div style={styles.activityHeader}>
            <div style={styles.activityTime}>12:00 점심 식사 준비</div>
            <span style={styles.completedBadge}>완료됨</span>
          </div>
          <div style={styles.activityNote}>
            완료 시간: 12:38<br />
            메모: "식사량 80% 완료"<br />
            📸 사진 1장
          </div>
        </div>

        <div style={styles.completedActivity}>
          <div style={styles.activityHeader}>
            <div style={styles.activityTime}>08:00 약 복용 확인</div>
            <span style={styles.completedBadge}>완료됨</span>
          </div>
          <div style={styles.activityNote}>
            완료 시간: 08:35<br />
            메모: "모든 약 복용 확인"<br />
            ⚠️ 혈압: 135/82 (약간 높음)
          </div>
        </div>

        <div style={styles.sectionTitle}>📅 예정 활동</div>

        <div style={styles.upcomingActivity}>
          <div style={styles.activityHeader}>
            <div style={styles.activityTime}>17:00 혈압 측정</div>
            <span style={styles.upcomingBadge}>예정</span>
          </div>
          <div style={styles.activityNote}>예상 소요: 10분</div>
        </div>

        <div style={styles.upcomingActivity}>
          <div style={styles.activityHeader}>
            <div style={styles.activityTime}>18:00 저녁 식사 준비</div>
            <span style={styles.upcomingBadge}>예정</span>
          </div>
          <div style={styles.activityNote}>예상 소요: 40분</div>
        </div>
      </div>

      <div style={styles.bottomNav}>
        <button style={{...styles.navItem, ...styles.navItemActive}}>
          <div style={styles.navIcon}>📋</div>
          <div style={styles.navLabel}>오늘 일정</div>
        </button>
        <button style={styles.navItem}>
          <div style={styles.navIcon}>👤</div>
          <div style={styles.navLabel}>환자 정보</div>
        </button>
        <button style={styles.navItem} onClick={() => router.push('/messages')}>
          <div style={styles.navIcon}>💬</div>
          <div style={styles.navLabel}>메시지</div>
        </button>
        <button style={styles.navItem} onClick={() => router.push('/report')}>
          <div style={styles.navIcon}>📊</div>
          <div style={styles.navLabel}>리포트</div>
        </button>
      </div>
    </div>
  )
}