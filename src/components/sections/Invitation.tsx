import logo from '@/assets/logo.png'
import { AuthActionLink } from '@/components/ui/AuthLinks'

/** 8. Invitation — 전체화면 초대 CTA (원본 index.html #invite) */
export function Invitation() {
  return (
    <section
      className="neo-section neo-section-anim"
      id="invite"
      style={{
        marginTop: 320,
        minHeight: '90vh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        background: 'none !important',
      }}
    >
      <div style={{ padding: '6px 32px' }}>
        <img src={logo} alt="키:우다" className="neo-reveal" style={{ height: 210, width: 'auto' }} />
      </div>
      <div className="neo-container" style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
        <h2
          className="neo-h2 neo-reveal"
          style={{
            color: '#f5f9ee',
            fontSize: 'clamp(2.4rem,5vw,3.6rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            textShadow: '0 2px 8px rgba(30,20,10,0.55),0 1px 2px rgba(30,20,10,0.4)',
          }}
        >
          여러분을 새 이웃으로 초대합니다
        </h2>
        <div className="neo-hero-actions" style={{ justifyContent: 'center', marginTop: 56 }}>
          <AuthActionLink
            to="/signup"
            className="neo-btn neo-btn-primary neo-btn-lg"
            style={{ fontSize: '1.3rem', padding: '20px 52px', borderRadius: 999 }}
          >
            초대 수락하기
          </AuthActionLink>
        </div>
      </div>
    </section>
  )
}
