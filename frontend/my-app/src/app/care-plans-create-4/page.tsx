"use client"

import { useRouter } from 'next/navigation'
import { background, firstPrimary, secondPrimary } from '../colors'

export default function Screen11AIValidation() {
  const router = useRouter()

  const styles = {
    container: {
      minHeight: '100vh',
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
      fontSize: '17px',
      color: 'black'
    },
    header: {
      padding: '20px',
      background: background
    },
    h2: {
      fontSize: '20px',
      marginBottom: '5px',
      color: 'black'
    },
    p: {
      fontSize: '14px',
      color: 'black'
    },
    summaryCard: {
      background: 'white',
      color: 'black',
      padding: '20px',
      margin: '0 20px 20px',
      borderRadius: '15px'
    },
    summaryCardH3: {
      fontSize: '16px',
      marginBottom: '15px',
      color: 'black'
    },
    summaryStats: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '15px'
    },
    statItem: {
      fontSize: '13px',
      color: 'black'
    },
    statNumber: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: 'black'
    },
    trustScore: {
      background: 'rgba(255,255,255,0.2)',
      padding: '12px',
      borderRadius: '8px',
      textAlign: 'center' as const
    },
    trustScoreScore: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: 'black'
    },
    trustScoreLabel: {
      fontSize: '12px',
      opacity: 0.9,
      color: 'black'
    },
    content: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '0 20px 20px'
    },
    feedbackCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '15px',
      marginBottom: '15px',
      borderLeft: `4px solid ${secondPrimary}`,
      color: 'black'
    },
    feedbackCardWarning: {
      borderLeftColor: secondPrimary
    },
    feedbackCardReject: {
      borderLeftColor: secondPrimary
    },
    feedbackHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px',
      fontWeight: 600,
      fontSize: '15px',
      color: 'black'
    },
    section: {
      marginBottom: '12px'
    },
    sectionTitle: {
      fontSize: '13px',
      fontWeight: 600,
      color: 'black',
      marginBottom: '6px'
    },
    sectionContent: {
      background: '#f9f9f9',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '13px',
      lineHeight: 1.5,
      color: 'black'
    },
    validationBox: {
      background: '#fce7f3',
      border: `1px solid ${secondPrimary}`,
      padding: '10px',
      borderRadius: '8px',
      fontSize: '13px',
      lineHeight: 1.5,
      marginTop: '8px',
      color: 'black'
    },
    validationBoxWarning: {
      background: '#fce7f3',
      borderColor: secondPrimary
    },
    validationBoxError: {
      background: '#fce7f3',
      borderColor: secondPrimary
    },
    validationTitle: {
      fontWeight: 600,
      marginBottom: '5px',
      color: 'black'
    },
    suggestion: {
      background: '#e0e7ff',
      padding: '10px',
      borderRadius: '8px',
      marginTop: '8px',
      fontSize: '13px',
      color: 'black'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
      marginTop: '12px'
    },
    actionBtn: {
      flex: 1,
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      background: 'white',
      fontSize: '13px',
      cursor: 'pointer',
      fontWeight: 500,
      color: 'black'
    },
    actionBtnPrimary: {
      background: firstPrimary,
      color: 'white',
      borderColor: firstPrimary
    },
    bottomBar: {
      padding: '15px 20px',
      background: background,
      borderTop: '1px solid #f0f0f0',
      display: 'flex',
      gap: '10px'
    },
    btn: {
      flex: 1,
      padding: '15px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '15px'
    },
    btnOutline: {
      background: 'white',
      color: firstPrimary,
      border: `2px solid ${firstPrimary}`
    },
    btnPrimary: {
      background: firstPrimary,
      color: 'white'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.navBar}>
        <button style={styles.backBtn} onClick={() => router.push('/caregiver-review')}>‹</button>
        <div style={styles.navTitle}>검증 결과</div>
        <div style={{width: '20px'}}></div>
      </div>

      <div style={styles.header}>
        <h2 style={styles.h2}>간병인 의견이 도착했어요</h2>
        <p style={styles.p}>AI가 검증한 결과를 확인하세요</p>
      </div>

      <div style={styles.summaryCard}>
        <h3 style={styles.summaryCardH3}>📊 검토 결과 요약</h3>
        <div style={styles.summaryStats}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>9건</div>
            <div>수용 권장 ✅</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>2건</div>
            <div>부분 수용 ⚠️</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>1건</div>
            <div>거부 권장 ❌</div>
          </div>
        </div>
        <div style={styles.trustScore}>
          <div style={styles.trustScoreScore}>92/100</div>
          <div style={styles.trustScoreLabel}>신뢰도 점수 (의학적 근거 및 현장 경험 기반)</div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.feedbackCard}>
          <div style={styles.feedbackHeader}>
            <span>✅</span>
            <span>수용 권장</span>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>[원래 일정]</div>
            <div style={styles.sectionContent}>
              08:00 약 복용 확인<br />
              아스피린 100mg, 메트포민 500mg
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>[간병인 의견]</div>
            <div style={styles.sectionContent}>
              "약 복용은 식사 후 30분 뒤에 하는 것이 더 좋습니다. 메트포민은 공복에 먹으면 속이 불편할 수 있습니다."
            </div>
          </div>

          <div style={styles.validationBox}>
            <div style={styles.validationTitle}>✓ 의학적으로 타당함</div>
            <div>MSD 매뉴얼에 따르면, 메트포민은 위장 부작용을 줄이기 위해 식사 중이나 직후에 복용하는 것이 권장됩니다.</div>
          </div>

          <div style={styles.suggestion}>
            <strong>[조정 제안]</strong><br />
            08:30으로 변경 (식사 30분 후)
          </div>

          <div style={styles.actionButtons}>
            <button style={{...styles.actionBtn, ...styles.actionBtnPrimary}}>수용함</button>
            <button style={styles.actionBtn}>거부함</button>
          </div>
        </div>

        <div style={{...styles.feedbackCard, ...styles.feedbackCardWarning}}>
          <div style={styles.feedbackHeader}>
            <span>⚠️</span>
            <span>부분 수용 권장</span>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>[간병인 의견]</div>
            <div style={styles.sectionContent}>
              "오전에 활동이 너무 집중되어 있어요. 환자분이 쉽게 피로해하실 수 있으니 휴식 시간을 2시간으로 늘리세요."
            </div>
          </div>

          <div style={{...styles.validationBox, ...styles.validationBoxWarning}}>
            <div style={styles.validationTitle}>✓ 휴식 필요성은 타당함</div>
            <div>⚠️ 2시간은 과도함</div>
            <div style={{marginTop: '8px'}}>78세 경도 치매 환자의 경우, 적절한 인지 자극이 필요합니다. 과도한 휴식은 오히려 인지 기능 저하를 유발할 수 있습니다.</div>
          </div>

          <div style={styles.suggestion}>
            <strong>[AI 대안 제안]</strong><br />
            휴식 시간 1시간 + 가벼운 인지 활동 (퍼즐, 이야기 나누기 등) 30분 추가
          </div>

          <div style={styles.actionButtons}>
            <button style={{...styles.actionBtn, ...styles.actionBtnPrimary}}>AI 제안 수용</button>
            <button style={styles.actionBtn}>간병인 제안 수용</button>
            <button style={styles.actionBtn}>직접 수정</button>
          </div>
        </div>

        <div style={{...styles.feedbackCard, ...styles.feedbackCardReject}}>
          <div style={styles.feedbackHeader}>
            <span>❌</span>
            <span>거부 권장</span>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>[간병인 의견]</div>
            <div style={styles.sectionContent}>
              "혈압약은 저녁에 복용하는 게 더 효과적입니다."
            </div>
          </div>

          <div style={{...styles.validationBox, ...styles.validationBoxError}}>
            <div style={styles.validationTitle}>✗ 의학적 근거 불충분</div>
            <div>환자가 복용 중인 암로디핀은 하루 한 번 아침 복용이 표준입니다. 야간 저혈압 위험을 피하기 위해 저녁 복용은 권장되지 않습니다.</div>
            <div style={{marginTop: '8px', fontWeight: 600}}>⚠️ 의사와 상담 후 변경을 권장합니다.</div>
          </div>

          <div style={styles.actionButtons}>
            <button style={styles.actionBtn}>그래도 변경</button>
            <button style={{...styles.actionBtn, ...styles.actionBtnPrimary}}>원안 유지</button>
          </div>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <button style={{...styles.btn, ...styles.btnOutline}}>간병인과 대화</button>
        <button style={{...styles.btn, ...styles.btnPrimary}}>선택 항목 적용</button>
      </div>
    </div>
  )
}