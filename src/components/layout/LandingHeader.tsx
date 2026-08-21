import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '@/assets/logo.png'
import { navItems } from '@/data/navigation'
import { AuthActionLink, AuthGatedLink } from '@/components/ui/AuthLinks'

/** 원본 index.html <header class="neo-header"> + 모바일 메뉴 (js/common.js 토글 로직 포함) */
export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="neo-header">
        <Link to="/" className="neo-logo">
          <img src={logo} alt="키:우다" />
        </Link>
        <nav className="neo-nav">
          {navItems.map((item) => (
            <AuthGatedLink key={item.path} to={item.path}>
              {item.label}
            </AuthGatedLink>
          ))}
        </nav>
        <div className="neo-auth">
          <AuthActionLink to="/signup" className="neo-btn neo-btn-ghost">
            회원가입
          </AuthActionLink>
          <AuthActionLink to="/login" className="neo-btn neo-btn-primary">
            로그인
          </AuthActionLink>
        </div>
        <button
          className="hamburger neo-ham"
          aria-label="메뉴"
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <button className="close" aria-label="메뉴 닫기" onClick={() => setMenuOpen(false)}>
          ×
        </button>
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <AuthGatedLink to={item.path} onClick={() => setMenuOpen(false)}>
                {item.label}
              </AuthGatedLink>
            </li>
          ))}
          <li className="auth-mobile">
            <AuthActionLink to="/signup" className="btn-signup" onClick={() => setMenuOpen(false)}>
              회원가입
            </AuthActionLink>
            <AuthActionLink to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>
              로그인
            </AuthActionLink>
          </li>
        </ul>
      </div>
    </>
  )
}
