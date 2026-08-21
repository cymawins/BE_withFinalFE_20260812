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
import NoticeList from '@/pages/info/notices/List'
import NoticeDetail from '@/pages/info/notices/Detail'
import NoticeInputForm from '@/pages/info/notices/InputForm'
import NoticeUpdateForm from '@/pages/info/notices/UpdateForm'

import Faq from '@/pages/info/faq/Faq'
import FList from '@/pages/info/faq/FList'
import FDetail from '@/pages/info/faq/FDetail'
import FInputForm from '@/pages/info/faq/FInputForm'
import FUpdateForm from '@/pages/info/faq/FUpdateForm'

import Inquiry from '@/pages/info/inquiry/Inquiry'
import IList from '@/pages/info/inquiry/IList'
import IDetail from '@/pages/info/inquiry/IDetail'
import IInputForm from '@/pages/info/inquiry/IInputForm'

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

      {/* 공지사항 */}
      <Route path="/notices" element={<Notices />}>
        <Route index element={<NoticeList />} />
        <Route path="form" element={<NoticeInputForm />} />
        <Route path=":id" element={<NoticeDetail />} />
        <Route path="form/:id" element={<NoticeUpdateForm />} />
      </Route>

      {/* FAQ */}
      <Route path="/faq" element={<Faq />}>
        <Route index element={<FList />} />
        <Route path="form" element={<FInputForm />} />
        <Route path=":id" element={<FDetail />} />
        <Route path="form/:id" element={<FUpdateForm />} />
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
