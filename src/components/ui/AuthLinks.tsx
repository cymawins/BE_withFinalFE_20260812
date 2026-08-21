import { Link, type LinkProps } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * 원본 [data-auth-action] 대응 컴포넌트.
 * 회원가입/로그인/초대 수락하기 버튼 — 클릭 시 인증 플래그를 세팅하고 정상적으로 이동한다.
 */
export function AuthActionLink({ children, onClick, ...props }: LinkProps) {
  const { login } = useAuth()
  return (
    <Link
      {...props}
      onClick={(e) => {
        login()
        onClick?.(e)
      }}
    >
      {children}
    </Link>
  )
}

/**
 * 원본 [data-auth-link] 대응 컴포넌트.
 * 헤더 내비 / 서비스 카드 — 비로그인 상태에서는 클릭해도 이동하지 않는다(preventDefault).
 */
export function AuthGatedLink({ children, onClick, ...props }: LinkProps) {
  const { isAuthenticated } = useAuth()
  return (
    <Link
      {...props}
      onClick={(e) => {
        if (!isAuthenticated) {
          e.preventDefault()
          return
        }
        onClick?.(e)
      }}
    >
      {children}
    </Link>
  )
}
