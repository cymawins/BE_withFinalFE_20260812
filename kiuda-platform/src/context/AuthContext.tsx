import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

/**
 * 원본 프로토타입의 인증 게이팅 로직을 그대로 이식한 Context.
 *
 * 원본 동작(js 인라인 스크립트, index.html 하단 참고):
 *  - [data-auth-action] 요소(회원가입/로그인/초대 수락하기) 클릭 시
 *    localStorage.setItem('kiuda_auth', '1')
 *  - [data-auth-link] 요소(헤더 내비, 서비스 카드) 클릭 시
 *    localStorage.getItem('kiuda_auth') !== '1' 이면 이동을 막음(preventDefault)
 *
 * SPA 전환 후에도 동일한 "비로그인 시 앱 화면 진입 불가" 동작을 재현한다.
 */

const AUTH_KEY = 'kiuda_auth'

interface AuthContextValue {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => typeof window !== 'undefined' && window.localStorage.getItem(AUTH_KEY) === '1',
  )

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === AUTH_KEY) {
        setIsAuthenticated(e.newValue === '1')
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = useCallback(() => {
    window.localStorage.setItem(AUTH_KEY, '1')
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
  }, [])

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
