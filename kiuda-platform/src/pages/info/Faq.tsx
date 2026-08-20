import { SubPageLayout } from '@/components/layout/SubPageLayout'

export default function Faq() {
  return (
    <SubPageLayout>
      <section className="neo-page-hero">
        <p className="neo-eyebrow dark">HELP</p>
        <h1>
          자주 묻는 <span>질문</span>
        </h1>
      </section>
      <section className="neo-content">
        <div className="neo-panel">
          <h2>서비스 이용</h2>
          <p style={{ lineHeight: 1.85, color: 'var(--neo-muted)', marginTop: 12 }}>
            <b>Q. 회원가입은 필수인가요?</b>
            <br />
            주요 기능(키움터, 일지 등)을 사용하려면 회원가입이 필요합니다. 둘러보기는 가능합니다.
          </p>
          <p style={{ lineHeight: 1.85, color: 'var(--neo-muted)', marginTop: 16 }}>
            <b>Q. AI 온새미는 어떤 도움을 주나요?</b>
            <br />
            식물 키움, 병해충, 물주기 주기 등 초보 질문에 맞춰 답변합니다. 전문 상담을 대체하지는
            않습니다.
          </p>
          <p style={{ lineHeight: 1.85, color: 'var(--neo-muted)', marginTop: 16 }}>
            <b>Q. 문의는 어디로 하면 되나요?</b>
            <br />
            support@kiuda.kr 로 메일을 보내 주시거나, Footer의 「문의하기」를 이용해 주세요.
          </p>
        </div>
      </section>
    </SubPageLayout>
  )
}
