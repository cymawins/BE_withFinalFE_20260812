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

import Inquiry from '@/pages/info/inquiry/Inquiry'
import IList from '@/pages/info/inquiry/IList'
import IDetail from '@/pages/info/inquiry/IDetail'
import IInputForm from './pages/info/inquiry/IInputForm'

import About from './pages/info/About'
import Guide from './pages/info/Guide'
import Privacy from './pages/info/Privacy'
import Terms from './pages/info/Terms'
import Faq from './pages/info/Faq'



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ask" element={<Ask />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="/share" element={<Share />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings/account" element={<SettingsAccount />} />
      <Route path="/admin" element={<Admin />} />

      <Route path="/about" element={<About />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/faq" element={<Faq />} />

      {/* 공지사항 */}
      <Route path="/notices" element={<Notices />}>
        <Route path=":id" element={<NoticeDetail />} />
      </Route>

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
