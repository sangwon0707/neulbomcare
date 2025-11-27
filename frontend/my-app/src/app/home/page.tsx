'use client'

import Link from "next/link"
import { background, firstPrimary } from "@/app/colors"

export default function HomePage() {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: 'calc(100vh - 64px - 80px)',
      background: background,
      padding: '20px',
      paddingBottom: '100px',
      gap: '15px',
      color: 'black'
    },
    header: {
      fontSize: '28px',
      fontWeight: 700,
      marginBottom: '30px',
      marginTop: '20px',
      textAlign: 'center' as const
    },
    menuCard: {
      background: 'white',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.3s ease',
      border: '1px solid #f0f0f0',
      color: 'black',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)'
      }
    },
    menuCardContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flex: 1
    },
    menuIcon: {
      fontSize: '32px'
    },
    menuText: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px'
    },
    menuTitle: {
      fontSize: '16px',
      fontWeight: 600,
      color: 'black'
    },
    menuDesc: {
      fontSize: '13px',
      color: '#666',
      opacity: 0.8
    },
    arrow: {
      fontSize: '20px',
      color: firstPrimary
    }
  }

  const menuItems = [
    {
      icon: '⭐',
      title: '주요기능',
      desc: '앱의 주요 기능 보기',
      href: '/onboarding'
    },
    {
      icon: '👤',
      title: '간병인 찾기',
      desc: 'AI 맞춤 간병인 찾기',
      href: '/guardians'
    },
    {
      icon: '💬',
      title: '내의 간병인',
      desc: '나의 간병인 관리',
      href: '/mypage'
    },
    {
      icon: '📋',
      title: '환자 정보',
      desc: '환자 상세 정보 관리',
      href: '/patient-condition'
    }
  ]

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>홈</h1>

      {menuItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          style={styles.menuCard}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
            el.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'
            el.style.transform = 'translateY(0)'
          }}
        >
          <div style={styles.menuCardContent}>
            <div style={styles.menuIcon}>{item.icon}</div>
            <div style={styles.menuText}>
              <div style={styles.menuTitle}>{item.title}</div>
              <div style={styles.menuDesc}>{item.desc}</div>
            </div>
          </div>
          <div style={styles.arrow}>›</div>
        </Link>
      ))}
    </div>
  )
}
