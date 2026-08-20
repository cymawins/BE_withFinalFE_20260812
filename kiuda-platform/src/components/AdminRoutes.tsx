import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

// 프론트엔드에서 관리자 식별 (로그인했는지, 관리자가 맞는지)
export default function AdminRoute({ children }: { children: ReactNode }) {
  if (!localStorage.getItem('authToken')) {
    return <Navigate to="/login" replace />
  }
  if (!localStorage.getItem('adminId')) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}