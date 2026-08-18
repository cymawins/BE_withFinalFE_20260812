import { SubPageLayout } from '@/components/layout/SubPageLayout'

export default function Terms() {
  return (
    <SubPageLayout>
      <section className="neo-page-hero">
        <p className="neo-eyebrow dark">LEGAL</p>
        <h1>이용약관</h1>
      </section>
      <section className="neo-content">
        <div
          className="neo-panel"
          style={{ lineHeight: 1.75, color: 'var(--neo-muted)', fontSize: '0.95rem' }}
        >
          <p>
            <strong>제1조 (목적)</strong>
            <br />
            본 약관은 키:우다 서비스 이용 조건과 권리·의무를 정합니다.
          </p>
          <p style={{ marginTop: 14 }}>
            <strong>제2조 (계정)</strong>
            <br />
            회원은 정확한 정보로 가입하며, 계정 보안은 회원 책임입니다.
          </p>
          <p style={{ marginTop: 14 }}>
            <strong>제3조 (커뮤니티)</strong>
            <br />
            허위 정보, 혐오·광고성 게시, 타인 사칭을 금지합니다. 운영 정책에 따라 게시물이 제한될 수
            있습니다.
          </p>
          <p style={{ marginTop: 14 }}>
            <strong>제4조 (AI 조언)</strong>
            <br />
            온새미 답변은 참고용이며, 재배 결과·안전에 대한 최종 판단은 회원에게 있습니다.
          </p>
          <p style={{ marginTop: 14 }}>
            <strong>제5조 (서비스 변경)</strong>
            <br />
            기능은 개선을 위해 변경될 수 있으며, 중요한 변경은 공지합니다.
          </p>
          <p style={{ marginTop: 14, fontSize: '0.85rem' }}>
            시행일: 2026-01-01 · 시안용 요약본 (법무 검수 전)
          </p>
        </div>
      </section>
    </SubPageLayout>
  )
}
