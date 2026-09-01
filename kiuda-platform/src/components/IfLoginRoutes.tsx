import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'

// 로그인 이후 로그인페이지로 이동이 가능한 현상 수정

export default function IfLoginRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    if (localStorage.getItem('adminId')) {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}