import { SubPageLayout } from '@/components/layout/SubPageLayout'

const faqData = [
  {
    category: '서비스 이용',
    items: [
      {
        q: '회원가입은 필수인가요?',
        a: '주요 기능(키움터, 일지 등)을 사용하려면 회원가입이 필요합니다. 둘러보기는 가능합니다.',
      },
      {
        q: 'AI 온새미는 어떤 도움을 주나요?',
        a: '식물 키움, 병해충, 물주기 주기 등 초보 질문에 맞춰 답변합니다. 전문 상담을 대체하지는 않습니다.',
      },
      {
        q: '문의는 어디로 하면 되나요?',
        a: 'support@kiuda.kr 로 메일을 보내 주시거나, Footer의 「문의하기」를 이용해 주세요.',
      },
    ],
  },
]

export default function Faq() {
  return (
    <SubPageLayout hideBackground>
      <section className="neo-page-hero">
        <p className="neo-eyebrow dark">HELP</p>
        <h1>
          자주 묻는 <span>질문</span>
        </h1>
      </section>

      <section className="neo-content">
        <div className="neo-panel">
          {faqData.map((section) => (
            <div key={section.category} className="faq-section">
              <h2 className="faq-section-title">{section.category}</h2>

              <div className="faq-list">
                {section.items.map((item) => (
                  <div key={item.q} className="faq-item">
                    <p className="faq-q">{item.q}</p>
                    <p className="faq-a">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SubPageLayout>
  )
}