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

// info static pages (optional - may not all exist)
// Board: 공지 / FAQ / 1:1 문의
import Notices from '@/pages/info/notices/Notices'
import NoticeDetail from '@/pages/info/notices/NoticeDetail'

<<<<<<< Updated upstream
import Inquiry from '@/pages/info/inquiry/Inquiry'
import IList from '@/pages/info/inquiry/IList'
import IDetail from '@/pages/info/inquiry/IDetail'
import IInputForm from './pages/info/inquiry/IInputForm'

=======
import Inquiry from './pages/info/inquiry/Inquiry'
import IList from './pages/info/inquiry/IList'
import IInputForm from './pages/info/inquiry/IInputForm'
import IDetail from './pages/info/inquiry/IDetail'

import IfLoginRoute from './components/IfLoginRoutes'
>>>>>>> Stashed changes
import About from './pages/info/About'
import Guide from './pages/info/Guide'
import Privacy from './pages/info/Privacy'
import Terms from './pages/info/Terms'
import Faq from './pages/info/Faq'
<<<<<<< Updated upstream
=======
import AdminRoute from './components/AdminRoutes'

>>>>>>> Stashed changes



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
<<<<<<< Updated upstream
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
=======
      <Route path="/login"  element={<IfLoginRoute><Login /></IfLoginRoute>} />
      <Route path="/signup" element={<IfLoginRoute><Signup /></IfLoginRoute>} />
>>>>>>> Stashed changes
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ask" element={<Ask />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="/share" element={<Share />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings/account" element={<SettingsAccount />} />
<<<<<<< Updated upstream
      <Route path="/admin" element={<Admin />} />
=======
      <Route path="/admin" element={
        <AdminRoute>
          <Admin />
        </AdminRoute>
      } />
>>>>>>> Stashed changes

      <Route path="/about" element={<About />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/faq" element={<Faq />} />

<<<<<<< Updated upstream
      {/* 공지사항 */}
      <Route path="/notices" element={<Notices />}>
        <Route path=":id" element={<NoticeDetail />} />
      </Route>
=======
      {/* 공지사항 — NoticeDetail이 SubPageLayout을 자체적으로 렌더하므로
          중첩(Outlet) 대신 형제 라우트로 둔다. 중첩일 때 Notices에 Outlet이
          없어 상세가 전혀 표시되지 않던 문제 수정 (2026-09-02) */}
      <Route path="/notices" element={<Notices />} />
      <Route path="/notices/:id" element={<NoticeDetail />} />
>>>>>>> Stashed changes

      {/* 1:1 문의 (질문 수정 라우트 없음) */}
      <Route path="/inquiry" element={<Inquiry />}>
        <Route index element={<IList />} />
        <Route path="form" element={<IInputForm />} />
        <Route path=":id" element={<IDetail />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
