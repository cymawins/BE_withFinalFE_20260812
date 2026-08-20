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
import AdminRoute from '@/components/AdminRoutes'

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
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
