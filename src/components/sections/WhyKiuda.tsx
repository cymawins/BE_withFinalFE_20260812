import heroPhoto from '@/assets/hero-photo.png'
import whyCard from '@/assets/why-card.jpg'
import { whyKiudaChecklist } from '@/data/whyKiuda'

/** 6. Why Kiuda — 좌측 텍스트+체크리스트, 우측 사진 2장 (원본 index.html #why) */
export function WhyKiuda() {
  return (
    <section className="neo-section neo-section-anim" id="why">
      <div className="neo-container neo-why-inner">
        <div className="neo-why-text neo-reveal">
          <h2 className="neo-h2" style={{ color: '#4f7a3e' }}>
            왜 키:우다일까요?
          </h2>
          <p className="neo-lead" style={{ marginBottom: 24 }}>
            궁금증을 바로 해결하고, 가까운 이웃과 이어 주며,
            <br />
            도움과 노하우를 나누는 모든 기능을
            <br />
            <strong>한 번에</strong> 이용할 수 있는 곳은 키:우다가 유일합니다.
          </p>
          <ul className="neo-list">
            {whyKiudaChecklist.map((item) => (
              <li key={item}>
                <span className="neo-badge">✓</span>
                <div>{item}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="neo-why-media neo-reveal delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="neo-inset neo-why-photo-a" style={{ overflow: 'hidden', padding: 4, width: '100%' }}>
            <img src={heroPhoto} alt="취미 텃밭" style={{ height: 260 }} />
          </div>
          <div
            className="neo-inset neo-why-photo-b"
            style={{
              overflow: 'hidden',
              padding: 4,
              width: '100%',
              boxShadow:
                '0 16px 36px rgba(30,40,20,0.28), inset 8px 8px 18px var(--neo-shadow-dark), inset -8px -8px 18px var(--neo-shadow-light)',
            }}
          >
            <img src={whyCard} alt="키움 일지" style={{ height: 260 }} />
          </div>
        </div>
      </div>
    </section>
  )
}
