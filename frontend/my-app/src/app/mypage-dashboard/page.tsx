'use client'

import { useRouter } from 'next/navigation'
import { background, firstPrimary, secondPrimary } from '@/app/colors'

export default function MypageDashboardPage() {
  const router = useRouter()

  const styles = {
    container: {
      minHeight: 'calc(100vh - 64px - 80px)',
      background: background,
      display: 'flex',
      flexDirection: 'column' as const,
      paddingBottom: '100px'
    },
    header: {
      background: background,
      padding: '20px',
      borderBottom: '1px solid #f0f0f0'
    },
    date: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '10px'
    },
    patientInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '15px'
    },
    patientAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '25px',
      background: '#f0f4ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      flexShrink: 0
    },
    patientDetails: {
      flex: 1
    },
    patientName: {
      fontSize: '18px',
      fontWeight: 700,
      color: '#333',
      marginBottom: '4px'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 10px',
      background: '#d1fae5',
      color: '#065f46',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 600
    },
    caregiverSection: {
      padding: '15px'
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#666',
      marginBottom: '12px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    caregiverCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '15px',
      display: 'flex',
      gap: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      marginBottom: '15px',
      border: '1px solid #e0e0e0'
    },
    caregiverCardHover: {
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transform: 'translateY(-2px)'
    },
    caregiverAvatar: {
      width: '60px',
      height: '60px',
      borderRadius: '30px',
      background: '#f0f4ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      flexShrink: 0
    },
    caregiverInfo: {
      flex: 1
    },
    caregiverName: {
      fontSize: '16px',
      fontWeight: 700,
      color: '#333',
      marginBottom: '4px'
    },
    caregiverMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '6px',
      fontSize: '13px',
      color: '#666'
    },
    rating: {
      color: secondPrimary,
      fontWeight: 600
    },
    caregiverExp: {
      fontSize: '12px',
      color: '#999'
    },
    content: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '15px'
    },
    progressCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '15px',
      marginBottom: '15px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    progressCardTitle: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#333',
      marginBottom: '12px'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      background: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '10px'
    },
    progressFill: {
      height: '100%',
      background: `linear-gradient(90deg, ${firstPrimary} 0%, ${secondPrimary} 100%)`,
      width: '65%',
      borderRadius: '4px'
    },
    progressStats: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#666'
    },
    nextActivity: {
      background: '#f9fafb',
      padding: '10px 12px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '10px'
    },
    activityIcon: {
      fontSize: '20px'
    },
    activityInfo: {
      flex: 1
    },
    activityTime: {
      fontSize: '12px',
      color: '#999'
    },
    activityTitle: {
      fontSize: '13px',
      fontWeight: 600,
      color: '#333'
    },
    warningCard: {
      background: '#fce7f3',
      borderLeft: `4px solid ${secondPrimary}`,
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '15px'
    },
    warningTitle: {
      fontSize: '13px',
      fontWeight: 600,
      color: secondPrimary,
      marginBottom: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    warningContent: {
      fontSize: '12px',
      color: '#333',
      lineHeight: 1.5,
      marginBottom: '8px'
    },
    actionButtons: {
      display: 'flex',
      gap: '6px'
    },
    actionBtn: {
      padding: '6px 10px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '11px',
      cursor: 'pointer',
      fontWeight: 600
    },
    btnWarning: {
      background: secondPrimary,
      color: 'white'
    },
    btnOutline: {
      background: 'white',
      color: secondPrimary,
      border: `1px solid ${secondPrimary}`
    },
    feedCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '15px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    feedTitle: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#333',
      marginBottom: '12px'
    },
    feedItem: {
      padding: '10px 12px',
      background: '#f9fafb',
      borderRadius: '8px',
      marginBottom: '8px',
      borderLeft: `3px solid ${secondPrimary}`
    },
    feedTime: {
      fontSize: '11px',
      color: '#999',
      marginBottom: '3px'
    },
    feedContent: {
      fontSize: '13px',
      color: '#333',
      lineHeight: 1.5
    }
  }

  const handleCaregiverCardClick = () => {
    router.push('/mypage_mycaregiver')
  }

  return (
    <div style={styles.container}>
      {/* Header with Patient Info */}
      <div style={styles.header}>
        <div style={styles.date}>2025년 11월 24일 일요일</div>
        <div style={styles.patientInfo}>
          <div style={styles.patientAvatar}>👵</div>
          <div style={styles.patientDetails}>
            <h2 style={styles.patientName}>김영희 어머니</h2>
            <span style={styles.statusBadge}>양호 😊</span>
          </div>
        </div>
      </div>

      {/* Caregiver Section */}
      <div style={styles.caregiverSection}>
        <div style={styles.sectionTitle}>나의 간병인</div>
        <div
          style={styles.caregiverCard}
          onClick={handleCaregiverCardClick}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
            el.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'
            el.style.transform = 'translateY(0)'
          }}
        >
          <div style={styles.caregiverAvatar}>👩‍⚕️</div>
          <div style={styles.caregiverInfo}>
            <div style={styles.caregiverName}>김미숙</div>
            <div style={styles.caregiverMeta}>
              <span style={styles.rating}>⭐ 4.9</span>
              <span>(127건)</span>
            </div>
            <div style={styles.caregiverExp}>경력 8년</div>
          </div>
          <div style={{fontSize: '18px', display: 'flex', alignItems: 'center'}}>›</div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Progress Card */}
        <div style={styles.progressCard}>
          <h3 style={styles.progressCardTitle}>📊 오늘의 진행 상황</h3>
          <div style={styles.progressBar}>
            <div style={styles.progressFill}></div>
          </div>
          <div style={styles.progressStats}>
            <span>완료: 13개</span>
            <span>진행 중: 2개</span>
            <span>예정: 5개</span>
          </div>
          <div style={styles.nextActivity}>
            <div style={styles.activityIcon}>🎯</div>
            <div style={styles.activityInfo}>
              <div style={styles.activityTime}>다음 활동</div>
              <div style={styles.activityTitle}>15:00 말벗/여가활동 - 아들 이준호</div>
            </div>
          </div>
        </div>

        {/* Warning Card */}
        <div style={styles.warningCard}>
          <div style={styles.warningTitle}>⚠️ 확인 필요</div>
          <div style={styles.warningContent}>
            혈압이 평소보다 약간 높습니다<br />
            (정상: 120/80, 현재: 135/82)
          </div>
          <div style={styles.actionButtons}>
            <button style={{...styles.actionBtn, ...styles.btnWarning}} onClick={() => router.push('/mypage-care-report')}>
              상세 보기
            </button>
            <button style={{...styles.actionBtn, ...styles.btnOutline}} onClick={() => router.push('/mypage')}>
              간병인에게 문의
            </button>
          </div>
        </div>

        {/* Feed Card */}
        <div style={styles.feedCard}>
          <h4 style={styles.feedTitle}>📝 케어 리포트</h4>
          <div style={styles.feedItem}>
            <div style={styles.feedTime}>오늘 14:30</div>
            <div style={styles.feedContent}>
              오후 약 복용을 완료했습니다. 혈압 측정 결과 135/82로 정상보다 약간 높은 상태입니다.
            </div>
          </div>
          <div style={styles.feedItem}>
            <div style={styles.feedTime}>오늘 12:00</div>
            <div style={styles.feedContent}>
              점심은 흰죽 1 공기, 계란말이, 시금치 나물을 섭취했습니다. 식욕이 양호합니다.
            </div>
          </div>
          <div style={styles.feedItem}>
            <div style={styles.feedTime}>어제 18:30</div>
            <div style={styles.feedContent}>
              아들과 30분간 영상통화했습니다. 기분이 좋아 보였습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
