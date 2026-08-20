import { SubPageLayout } from '@/components/layout/SubPageLayout'

export default function Guide() {
  return (
    <SubPageLayout>
      <section className="neo-page-hero">
        <p className="neo-eyebrow dark">GUIDE</p>
        <h1>
          키:우다 <span>이용방법</span>
        </h1>
      </section>
      <section className="neo-content">
        <div className="neo-panel">
          <h2>시작하기</h2>
          <p style={{ lineHeight: 1.85, color: 'var(--neo-muted)', marginTop: 12 }}>
            키:우다는 <strong>보다 · 묻다 · 잇다 · 나누다</strong> 네 가지 흐름으로 구성됩니다.
            회원가입 후 키움터(보다)에서 나의 식물을 등록하고, AI 온새미(묻다)에게 궁금한 점을
            물어보세요. 이웃(잇다)과 품앗이를 나누고, 키움일지(나누다)에 기록을 남기면 됩니다.
          </p>
        </div>
        <div className="neo-cards" style={{ marginTop: 20 }}>
          <div className="neo-mini-card">
            <h3>1. 보다</h3>
            <p>키움터에서 내 식물·공간을 관리합니다.</p>
          </div>
          <div className="neo-mini-card">
            <h3>2. 묻다</h3>
            <p>AI 온새미에게 키움 관련 질문을 합니다.</p>
          </div>
          <div className="neo-mini-card">
            <h3>3. 잇다</h3>
            <p>동네 이웃·품앗이·지도를 활용합니다.</p>
          </div>
          <div className="neo-mini-card">
            <h3>4. 나누다</h3>
            <p>키움일지로 성장 과정을 기록·공유합니다.</p>
          </div>
        </div>
      </section>
    </SubPageLayout>
  )
}
