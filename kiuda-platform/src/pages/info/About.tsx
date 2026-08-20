import { SubPageLayout } from '@/components/layout/SubPageLayout'

export default function About() {
  return (
    <SubPageLayout>
      <section className="neo-page-hero">
        <p className="neo-eyebrow dark">ABOUT</p>
        <h1>
          키:우다는 <span>팀</span>입니다
        </h1>
      </section>
      <section className="neo-content">
        <div className="neo-panel">
          <h2>만드는 사람들</h2>
          <p style={{ lineHeight: 1.85, color: 'var(--neo-muted)', marginTop: 12 }}>
            키:우다는 “혼자 키우기 막막한 초보”와 “경험을 나누고 싶은 이웃”을 잇기 위해 모인 팀
            프로젝트입니다. 재배 전문 사이트의 어려운 문턱을 낮추고, 동네 단위의 작은 연대가
            쌓이도록 제품·디자인·데이터를 함께 설계합니다.
          </p>
        </div>
        <div className="neo-cards" style={{ marginTop: 20 }}>
          <div className="neo-mini-card">
            <h3>🎯 미션</h3>
            <p>누구나 부담 없이 첫 키움을 시작하고, 그 과정이 외롭지 않게 하는 것</p>
          </div>
          <div className="neo-mini-card">
            <h3>🛠 접근</h3>
            <p>AI 조언 + 지역 커뮤니티 + 기록 습관을 한 흐름으로 연결</p>
          </div>
          <div className="neo-mini-card">
            <h3>📍 초점</h3>
            <p>취미·베란다·주말농장 등 “일상 속 작은 농사”</p>
          </div>
          <div className="neo-mini-card">
            <h3>🚀 다음</h3>
            <p>동네 단위 품앗이 활성화, 시즌별 키움 챌린지 확장</p>
          </div>
        </div>
      </section>
    </SubPageLayout>
  )
}
