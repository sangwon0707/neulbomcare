"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { background, firstPrimary, secondPrimary } from '../colors'

export default function Screen7Matching() {
  const router = useRouter()
  const [flippedCards, setFlippedCards] = useState<{[key: string]: boolean}>({})

  const caregivers = [
    {
      name: '김미숙',
      age: 52,
      rating: 4.9,
      reviews: 127,
      certification: '요양보호사 1급',
      experience: '경력 8년',
      specialties: ['치매 케어', '당뇨 관리', '고혈압 관리'],
      intro: '따뜻한 마음으로 어르신을 돌봅니다. 치매 어르신 케어 경험이 많습니다.',
      matchScore: 92,
      rate: 25000,
      avatar: '👩‍⚕️',
      detailedProfile: {
        residence: '경기도 부천시 원미구',
        certifications: [
          '요양보호사 1급 (2015년 취득)',
          '치매전문교육 이수 (2018년)',
          '응급처치 교육 수료 (2020년)',
          '장애인활동지원사 자격 (2019년)'
        ],
        career: {
          total: '9년 (2015년 ~ 현재)',
          current: '사랑채 재가요양센터 (2018년 ~ 현재)'
        },
        responsibilities: [
          '일상생활 지원: 식사, 배설, 위생관리',
          '거동 불편 어르신 이동 보조',
          '치매 어르신 돌봄 및 인지활동 지원',
          '건강상태 체크 및 약물 복용 관리',
          '간단한 재활운동 보조',
          '특기: 치매 어르신과의 소통, 노인 심리 이해도 높음'
        ],
        strengths: [
          '풍부한 실무 경험과 치매 전문 지식',
          '어르신 가족들과의 원활한 소통 능력',
          '위기 상황 대처 능력 우수',
          '성실하고 책임감 강함',
          '장기 근속 의지가 높음'
        ],
        quote: '"어르신 한 분 한 분이 저의 부모님이라는 마음으로 정성을 다합니다"'
      }
    },
    {
      name: '이정호',
      age: 45,
      rating: 4.8,
      reviews: 89,
      certification: '요양보호사 1급',
      experience: '경력 6년',
      specialties: ['치매 케어', '재활 운동'],
      intro: '성실하고 꼼꼼하게 케어합니다. 인지 활동 프로그램 진행 가능합니다.',
      matchScore: 88,
      rate: 23000,
      avatar: '👨‍⚕️',
      detailedProfile: {
        residence: '경기도 부천시 소사구',
        certifications: [
          '요양보호사 1급 (2017년 취득)',
          '재활운동지도사 자격 (2019년)',
          '인지활동지도사 자격 (2020년)',
          '응급처치 교육 수료 (2021년)'
        ],
        career: {
          total: '7년 (2017년 ~ 현재)',
          current: '희망재가요양센터 (2020년 ~ 현재)'
        },
        responsibilities: [
          '일상생활 지원: 식사, 배설, 위생관리',
          '거동 불편 어르신 이동 보조',
          '치매 어르신 인지활동 프로그램 진행',
          '재활운동 보조 및 지도',
          '건강상태 체크 및 기록',
          '특기: 인지활동 프로그램 개발, 재활운동 전문'
        ],
        strengths: [
          '인지활동 프로그램 진행 능력',
          '체계적이고 꼼꼼한 업무 처리',
          '재활운동 전문 지식 보유',
          '성실하고 책임감 있는 태도',
          '어르신과의 라포 형성 능력'
        ],
        quote: '"어르신들의 남은 기능을 최대한 유지하고 향상시킬 수 있도록 최선을 다하겠습니다"'
      }
    },
    {
      name: '박은영',
      age: 58,
      rating: 4.7,
      reviews: 156,
      certification: '요양보호사 1급',
      experience: '경력 12년',
      specialties: ['당뇨 관리', '식사 케어', '투약 관리'],
      intro: '어르신들과 대화를 잘합니다. 오랜 경험으로 다양한 상황에 대처 가능합니다.',
      matchScore: 85,
      rate: 27000,
      avatar: '👩‍⚕️',
      detailedProfile: {
        residence: '경기도 부천시 중동',
        certifications: [
          '요양보호사 1급 (2012년 취득)',
          '당뇨병 교육사 자격 (2014년)',
          '영양사 자격 (2010년)',
          '투약관리 전문교육 이수 (2016년)'
        ],
        career: {
          total: '13년 (2012년 ~ 현재)',
          current: '사랑돌봄 재가요양센터 (2015년 ~ 현재)'
        },
        responsibilities: [
          '일상생활 지원: 식사, 배설, 위생관리',
          '당뇨병 환자 혈당 관리 및 식단 조절',
          '정확한 투약 관리 및 기록',
          '영양 상태 체크 및 식사 케어',
          '건강상태 모니터링 및 보고',
          '특기: 당뇨 및 만성질환 관리, 영양 식단 관리'
        ],
        strengths: [
          '12년 이상의 풍부한 현장 경험',
          '당뇨병 관리 전문 지식',
          '영양사 자격 보유로 식단 관리 우수',
          '어르신과의 소통 능력 탁월',
          '위기 상황 판단 및 대처 능력'
        ],
        quote: '"오랜 경험을 바탕으로 어르신들의 건강을 세심하게 돌보겠습니다"'
      }
    }
  ]

  const styles = {
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
    filterBtn: {
      fontSize: '20px',
      cursor: 'pointer',
      color: firstPrimary,
      background: 'none',
      border: 'none'
    },
    header: {
      padding: '20px',
      background: background,
      borderBottom: '1px solid #f0f0f0'
    },
    h2: {
      fontSize: '22px',
      color: '#333',
      marginBottom: '5px'
    },
    p: {
      fontSize: '14px',
      color: '#666'
    },
    content: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '15px',
      background: background,
      minHeight: 0
    },
    caregiverCard: {
      background: 'white',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '15px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    caregiverHeader: {
      display: 'flex',
      gap: '15px',
      marginBottom: '15px',
      paddingBottom: '15px',
      borderBottom: '1px solid #f0f0f0'
    },
    caregiverAvatar: {
      width: '70px',
      height: '70px',
      borderRadius: '35px',
      background: background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '36px',
      flexShrink: 0
    },
    caregiverInfo: {
      flex: 1
    },
    nameRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '5px'
    },
    caregiverName: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#333'
    },
    caregiverAge: {
      fontSize: '14px',
      color: '#999'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '14px'
    },
    star: {
      color: secondPrimary
    },
    ratingCount: {
      color: '#999'
    },
    certificationBadge: {
      display: 'inline-block',
      padding: '4px 10px',
      background: '#dbeafe',
      color: '#1e40af',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 600,
      marginRight: '6px'
    },
    experience: {
      fontSize: '13px',
      color: '#666',
      marginTop: '5px'
    },
    caregiverBody: {
      marginBottom: '15px'
    },
    specialtyTags: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '6px',
      marginBottom: '12px'
    },
    specialtyTag: {
      padding: '6px 12px',
      background: '#f0f4ff',
      color: firstPrimary,
      borderRadius: '12px',
      fontSize: '12px'
    },
    intro: {
      fontSize: '14px',
      color: '#555',
      lineHeight: 1.5,
      marginBottom: '12px'
    },
    matchInfo: {
      background: '#fce7f3',
      border: `1px solid ${secondPrimary}`,
      padding: '12px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    matchIcon: {
      fontSize: '24px'
    },
    matchText: {
      flex: 1
    },
    matchScore: {
      fontSize: '18px',
      fontWeight: 700,
      color: secondPrimary
    },
    matchDetail: {
      fontSize: '11px',
      color: secondPrimary,
      cursor: 'pointer'
    },
    caregiverFooter: {
      display: 'flex',
      gap: '10px'
    },
    rate: {
      fontSize: '16px',
      fontWeight: 700,
      color: firstPrimary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 10px'
    },
    actionBtn: {
      flex: 1,
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #e0e0e0',
      background: 'white',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      color: '#333'
    },
    actionBtnPrimary: {
      background: firstPrimary,
      color: 'white',
      borderColor: firstPrimary
    },
    bottomSection: {
      padding: '15px 20px',
      background: background,
      borderTop: '1px solid #f0f0f0'
    },
    showMoreBtn: {
      width: '100%',
      padding: '12px',
      background: '#f9fafb',
      color: firstPrimary,
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      marginBottom: '10px'
    },
    skipBtn: {
      width: '100%',
      padding: '12px',
      background: 'white',
      color: '#999',
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer'
    },
    flipCardContainer: (isFlipped: boolean) => ({
      perspective: '1000px',
      marginBottom: '15px',
      position: 'relative' as const,
      zIndex: isFlipped ? 10 : 1
    }),
    flipCardInner: (isFlipped: boolean) => ({
      position: 'relative' as const,
      width: '100%',
      transition: 'transform 0.6s',
      transformStyle: 'preserve-3d' as const,
      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale'
    }),
    flipCardFront: {
      position: 'relative' as const,
      backfaceVisibility: 'hidden' as const,
      WebkitBackfaceVisibility: 'hidden' as const,
      background: 'white',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      cursor: 'pointer',
      zIndex: 1,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      transform: 'translateZ(0)'
    },
    flipCardBack: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      backfaceVisibility: 'hidden' as const,
      WebkitBackfaceVisibility: 'hidden' as const,
      transform: 'rotateY(180deg)',
      background: 'white',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      cursor: 'pointer',
      minHeight: '100%',
      zIndex: 2,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      transformOrigin: 'center center'
    },
    detailedProfile: {
      fontSize: '14px',
      color: '#333',
      lineHeight: 1.6
    },
    profileSection: {
      marginBottom: '20px'
    },
    profileTitle: {
      fontSize: '18px',
      fontWeight: 700,
      color: firstPrimary,
      marginBottom: '15px',
      paddingBottom: '8px',
      borderBottom: `2px solid ${firstPrimary}`
    },
    profileSubtitle: {
      fontSize: '15px',
      fontWeight: 600,
      color: '#444',
      marginBottom: '8px',
      marginTop: '12px'
    },
    profileList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    profileListItem: {
      padding: '6px 0',
      paddingLeft: '15px',
      position: 'relative' as const,
      color: '#555'
    },
    profileBullet: {
      position: 'absolute' as const,
      left: 0,
      color: secondPrimary
    },
    profileQuote: {
      background: '#f0f4ff',
      padding: '15px',
      borderRadius: '10px',
      fontStyle: 'italic',
      color: firstPrimary,
      textAlign: 'center' as const,
      marginTop: '15px',
      fontWeight: 600
    },
    closeBtn: {
      position: 'absolute' as const,
      top: '15px',
      right: '15px',
      background: '#f0f0f0',
      border: 'none',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      fontSize: '18px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#666'
    }
  }

  const handleCardClick = (name: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: background }}>
      <div style={styles.header}>
        <h2 style={styles.h2}>김영희님에게 적합한 간병인</h2>
        <p style={styles.p}>3명의 전문가를 찾았습니다</p>
      </div>

      <div style={styles.content}>
        {caregivers
          .filter(caregiver => {
            // If any caregiver is flipped, show only that caregiver
            const flippedCaregiver = Object.keys(flippedCards).find(name => flippedCards[name])
            if (flippedCaregiver) {
              return caregiver.name === flippedCaregiver
            }
            return true
          })
          .map((caregiver, index) => {
          const isFlipped = flippedCards[caregiver.name] || false
          return (
          <div key={index} style={styles.flipCardContainer(isFlipped)}>
            <div style={styles.flipCardInner(isFlipped)}>
              {/* Front of card */}
              <div style={styles.flipCardFront} onClick={() => handleCardClick(caregiver.name)}>
                <div style={styles.caregiverHeader}>
                  <div style={styles.caregiverAvatar}>{caregiver.avatar}</div>
                  <div style={styles.caregiverInfo}>
                    <div style={styles.nameRating}>
                      <span style={styles.caregiverName}>{caregiver.name}</span>
                      <span style={styles.caregiverAge}>({caregiver.age}세)</span>
                    </div>
                    <div style={styles.rating}>
                      <span style={styles.star}>⭐</span>
                      <span>{caregiver.rating}</span>
                      <span style={styles.ratingCount}>({caregiver.reviews}건)</span>
                    </div>
                    <div style={{marginTop: '8px'}}>
                      <span style={styles.certificationBadge}>{caregiver.certification}</span>
                    </div>
                    <div style={styles.experience}>{caregiver.experience}</div>
                  </div>
                </div>

                <div style={styles.caregiverBody}>
                  <div style={styles.specialtyTags}>
                    {caregiver.specialties.map((specialty, i) => (
                      <span key={i} style={styles.specialtyTag}>{specialty}</span>
                    ))}
                  </div>
                  <div style={styles.intro}>&ldquo;{caregiver.intro}&rdquo;</div>
                  <div style={styles.matchInfo}>
                    <div style={styles.matchIcon}>✨</div>
                    <div style={styles.matchText}>
                      <div style={styles.matchScore}>{caregiver.matchScore}% 매칭</div>
                      <div style={styles.matchDetail}>▼ 매칭 근거 보기</div>
                    </div>
                  </div>
                </div>

                <div style={styles.caregiverFooter}>
                  <div style={styles.rate}>{caregiver.rate.toLocaleString()}원/시간</div>
                  <button style={styles.actionBtn} onClick={(e) => e.stopPropagation()}>프로필 보기</button>
                  <button style={{...styles.actionBtn, ...styles.actionBtnPrimary}} onClick={(e) => e.stopPropagation()}>선택</button>
                </div>
              </div>

              {/* Back of card - for all caregivers with detailedProfile */}
              {caregiver.detailedProfile && (
                <div style={styles.flipCardBack} onClick={() => handleCardClick(caregiver.name)}>
                  <button
                    style={styles.closeBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick(caregiver.name)
                    }}
                  >
                    ×
                  </button>

                  <div style={styles.detailedProfile}>
                    <div style={styles.profileTitle}>{caregiver.name} 요양보호사 프로필</div>

                    <div style={styles.profileSection}>
                      <div style={styles.profileSubtitle}>기본 정보</div>
                      <div style={styles.profileListItem}>
                        <span style={styles.profileBullet}>•</span>
                        이름: {caregiver.name}
                      </div>
                      <div style={styles.profileListItem}>
                        <span style={styles.profileBullet}>•</span>
                        나이: {caregiver.age}세
                      </div>
                      <div style={styles.profileListItem}>
                        <span style={styles.profileBullet}>•</span>
                        거주지: {caregiver.detailedProfile.residence}
                      </div>
                    </div>

                    <div style={styles.profileSection}>
                      <div style={styles.profileSubtitle}>자격증</div>
                      <ul style={styles.profileList}>
                        {caregiver.detailedProfile.certifications.map((cert, i) => (
                          <li key={i} style={styles.profileListItem}>
                            <span style={styles.profileBullet}>•</span>
                            {cert}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={styles.profileSection}>
                      <div style={styles.profileSubtitle}>경력사항</div>
                      <div style={styles.profileListItem}>
                        <span style={styles.profileBullet}>•</span>
                        총 경력: {caregiver.detailedProfile.career.total}
                      </div>
                      <div style={styles.profileListItem}>
                        <span style={styles.profileBullet}>•</span>
                        현재 근무처: {caregiver.detailedProfile.career.current}
                      </div>
                    </div>

                    <div style={styles.profileSection}>
                      <div style={styles.profileSubtitle}>담당 업무 및 전문 분야</div>
                      <ul style={styles.profileList}>
                        {caregiver.detailedProfile.responsibilities.map((resp, i) => (
                          <li key={i} style={styles.profileListItem}>
                            <span style={styles.profileBullet}>•</span>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={styles.profileSection}>
                      <div style={styles.profileSubtitle}>강점</div>
                      <ul style={styles.profileList}>
                        {caregiver.detailedProfile.strengths.map((strength, i) => (
                          <li key={i} style={styles.profileListItem}>
                            <span style={styles.profileBullet}>•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={styles.profileQuote}>
                      {caregiver.detailedProfile.quote}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}
        )}
      </div>

      <div style={styles.bottomSection}>
        <button style={styles.showMoreBtn}>더 많은 간병인 보기</button>
        <button style={styles.skipBtn} onClick={() => router.push('/loading')}>간병인 없이 진행하기</button>
      </div>
    </div>
  )
}
