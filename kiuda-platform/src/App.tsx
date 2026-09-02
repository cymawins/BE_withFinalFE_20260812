import { Route, Routes } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Dashboard from '@/pages/Dashboard'
import Ask from '@/pages/Ask'
import Connect from '@/pages/Connect'
import Share from '@/pages/Share'
import Profile from '@/pages/Profile'
import SettingsAccount from '@/pages/SettingsAccount'
import Admin from '@/pages/Admin'
import NotFound from '@/pages/NotFound'
import About from '@/pages/info/About'
import Guide from '@/pages/info/Guide'
import Faq from '@/pages/info/Faq'
import Terms from '@/pages/info/Terms'
import Privacy from '@/pages/info/Privacy'
import Notices from '@/pages/info/notices/Notices'
import NoticeDetail from '@/pages/info/notices/NoticeDetail'
// 1:1 문의 (비회원 · 프론트 전용) — 2026-09-02 추가
import Inquiry from '@/pages/info/inquiry/Inquiry'
import IList from '@/pages/info/inquiry/IList'
import IInputForm from '@/pages/info/inquiry/IInputForm'
import IDetail from '@/pages/info/inquiry/IDetail'
import AdminRoute from '@/components/AdminRoutes'
import IfLoginRoute from './components/IfLoginRoutes'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<IfLoginRoute><Login /></IfLoginRoute>} />
      <Route path="/signup" element={<IfLoginRoute><Signup /></IfLoginRoute>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ask" element={<Ask />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="/share" element={<Share />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings/account" element={<SettingsAccount />} />
      <Route path="/admin" element={
        <AdminRoute>
          <Admin />
        </AdminRoute>
      } />
      <Route path="/about" element={<About />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/notices" element={<Notices />} />
      <Route path="/notices/:id" element={<NoticeDetail />} />

      {/* 1:1 문의 — 비회원이 작성하므로 인증 가드를 두지 않는다.
          목록/작성/상세는 Inquiry 안의 Outlet 으로 렌더된다. (질문 수정 라우트 없음) */}
      <Route path="/inquiry" element={<Inquiry />}>
        <Route index element={<IList />} />
        <Route path="form" element={<IInputForm />} />
        <Route path=":id" element={<IDetail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
