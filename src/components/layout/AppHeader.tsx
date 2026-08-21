import { Link } from 'react-router-dom'
import logo from '@/assets/logo.png'

export type AppNavKey = 'dashboard' | 'ask' | 'connect' | 'share'

const NAV_ITEMS: { key: AppNavKey; label: string; path: string }[] = [
  { key: 'dashboard', label: '보다', path: '/dashboard' },
  { key: 'ask', label: '묻다', path: '/ask' },
  { key: 'connect', label: '잇다', path: '/connect' },
  { key: 'share', label: '나누다', path: '/share' },
]

interface AppHeaderProps {
  /** 현재 활성 내비 항목 (프로필 화면에서는 undefined) */
  active?: AppNavKey
  /** 프로필 아바타에 강조 테두리를 줄지 여부 (프로필 화면 자체일 때 true) */
  isProfileActive?: boolean
  /** 로그인한 사용자 아바타 이니셜 (원본 목업 기준 "민") */
  avatarInitial?: string
}

/**
 * 앱 화면(보다/묻다/잇다/나누다/프로필) 공용 상단 헤더.
 * 원본 screens/*.dc.html 각 파일의 <header> 블록이 완전히 동일하여
 * (활성 탭 스타일과 아바타 테두리만 다름) 하나의 컴포넌트로 통합했다.
 */
export function AppHeader({ active, isProfileActive = false, avatarInitial = '민' }: AppHeaderProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        background: 'oklch(0.985 0.008 95 / 0.75)',
        borderBottom: '1px solid oklch(0.9 0.015 120)',
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '0 clamp(20px,4vw,40px)',
          height: 76,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link to="/dashboard" aria-label="키우다 홈" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logo} alt="키우다 로고" style={{ width: 'auto', height: 210, objectFit: 'contain' }} />
        </Link>
        <nav aria-label="주요 서비스" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              style={{
                fontSize: 15,
                fontWeight: active === item.key ? 700 : 600,
                color: active === item.key ? 'oklch(0.5 0.1 152)' : 'oklch(0.5 0.02 145)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/profile"
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'oklch(0.94 0.03 140)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 14,
            color: 'oklch(0.45 0.09 150)',
            border: isProfileActive ? '2px solid oklch(0.56 0.09 152)' : undefined,
          }}
        >
          {avatarInitial}
        </Link>
      </div>
    </header>
  )
}
