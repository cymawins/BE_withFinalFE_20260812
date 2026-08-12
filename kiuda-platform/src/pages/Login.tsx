import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/** 로그인 화면 (원본 screens/login.dc.html 1:1 대응) */
export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loginButtonLabel = isLoading ? '로그인 중...' : '로그인'

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: '로그인 실패' }))
        throw new Error(err.message || '로그인 실패')
      }

      const data = await response.json()
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('userId', data.userId)
      // 랜딩 페이지 인증 게이팅(kiuda_auth)과 연동해 SPA 내 이동을 허용한다
      login()
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-screen" style={{ background: 'linear-gradient(135deg, #F9F6EE 0%, #E8F3E3 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ animation: 'slideIn 0.6s ease-out', width: '100%', maxWidth: 420 }}>
          {/* Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#56B968',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 900,
                  color: 'white',
                }}
              >
                키
              </div>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#3D5A3D', marginBottom: 8 }}>로그인</h1>
            <p style={{ fontSize: 14, color: '#888' }}>함께 하는 초록빛 일상을 시작하세요</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#3D5A3D', marginBottom: 8 }}>이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="kiuda-input"
                style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #D9CFC1', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', transition: 'border-color 0.2s, box-shadow 0.2s' }}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#3D5A3D', marginBottom: 8 }}>비밀번호</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상의 비밀번호"
                required
                className="kiuda-input"
                style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #D9CFC1', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', transition: 'border-color 0.2s, box-shadow 0.2s' }}
              />
            </div>

            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                id="showPasswordCheckbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
              <label htmlFor="showPasswordCheckbox" style={{ fontSize: 13, color: '#666', cursor: 'pointer' }}>
                비밀번호 표시
              </label>
            </div>

            {error && (
              <div style={{ background: '#FFE8E8', border: '1px solid #FFB3B3', borderRadius: 8, padding: '12px 14px', marginBottom: 20, fontSize: 13, color: '#C00', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="kiuda-btn-primary"
              style={{
                width: '100%',
                padding: 16,
                background: '#56B968',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(86, 185, 104, 0.2)',
              }}
            >
              {loginButtonLabel}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: '#D9CFC1' }} />
            <span style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>또는</span>
            <div style={{ flex: 1, height: 1, background: '#D9CFC1' }} />
          </div>

          {/* Social Logins */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <button className="kiuda-social-btn" style={{ padding: 12, border: '1.5px solid #D9CFC1', background: 'white', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}>
              🍎 Apple
            </button>
            <button className="kiuda-social-btn" style={{ padding: 12, border: '1.5px solid #D9CFC1', background: 'white', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}>
              🔵 Google
            </button>
          </div>

          {/* Sign Up Link */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <p style={{ fontSize: 14, color: '#666' }}>
              아직 계정이 없으신가요?{' '}
              <Link to="/signup" className="kiuda-link-hover" style={{ color: '#56B968', fontWeight: 700, textDecoration: 'none' }}>
                회원가입
              </Link>
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', textAlign: 'center', paddingTop: 20, borderTop: '1px solid #D9CFC1' }}>
            <a href="#forgot" className="kiuda-muted-link" style={{ fontSize: 12, color: '#888', textDecoration: 'none' }}>비밀번호 찾기</a>
            <span style={{ color: '#D9CFC1' }}>|</span>
            <a href="#help" className="kiuda-muted-link" style={{ fontSize: 12, color: '#888', textDecoration: 'none' }}>도움말</a>
            <span style={{ color: '#D9CFC1' }}>|</span>
            <a href="#privacy" className="kiuda-muted-link" style={{ fontSize: 12, color: '#888', textDecoration: 'none' }}>개인정보</a>
          </div>
        </div>
      </div>
    </div>
  )
}
