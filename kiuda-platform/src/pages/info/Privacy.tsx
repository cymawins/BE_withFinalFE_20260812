import { SubPageLayout } from '@/components/layout/SubPageLayout'

export default function Privacy() {
  return (
    <SubPageLayout>
      <section className="neo-page-hero">
        <p className="neo-eyebrow dark">PRIVACY</p>
        <h1>개인정보 보호정책</h1>
      </section>
      <section className="neo-content">
        <div
          className="neo-panel"
          style={{ lineHeight: 1.75, color: 'var(--neo-muted)', fontSize: '0.95rem' }}
        >
          <p>
            <strong>수집</strong> — 가입 시 이름·이메일·지역, 이용 중 키움터·일지·문의 내용
          </p>
          <p style={{ marginTop: 14 }}>
            <strong>목적</strong> — 계정 확인, 키움 관리, AI 품질, 동네 연결, 고객 지원
          </p>
          <p style={{ marginTop: 14 }}>
            <strong>보관</strong> — 탈퇴 시까지. 법령상 보관이 필요하면 해당 기간만 보관
          </p>
          <p style={{ marginTop: 14 }}>
            <strong>제공</strong> — 법령 또는 동의 없이 제3자 제공 없음
          </p>
          <p style={{ marginTop: 14 }}>
            <strong>권리</strong> — 열람·수정·삭제·탈퇴는 프로필 또는 고객센터로 요청
          </p>
          <p style={{ marginTop: 14, fontSize: '0.85rem' }}>
            시행일: 2026-01-01 · 시안용 요약본 (법무 검수 전)
          </p>
        </div>
      </section>
    </SubPageLayout>
  )
}
