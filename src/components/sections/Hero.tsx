import { useSeedlingGrow } from '@/hooks/useSeedlingGrow'

/** 1. Overview — 새싹 성장 애니메이션 히어로 (원본 index.html #overview) */
export function Hero() {
  useSeedlingGrow('grow-title')

  return (
    <section className="neo-hero neo-section-anim neo-hero-soil" id="overview">
      <div className="neo-soil-text" id="grow-message">
        <p
          style={{
            fontSize: 'clamp(0.95rem,1.6vw,1.15rem)',
            fontWeight: 400,
            color: '#eef4e6',
            textShadow: '0 1px 3px rgba(0,0,0,0.55),0 3px 12px rgba(0,0,0,0.4)',
            marginBottom: '10px',
          }}
        >
          초보부터 베테랑까지, 화초부터 농작물까지
        </p>
        <h1 className="neo-hero-title" id="grow-title">
          함께 키:우다
        </h1>
      </div>
    </section>
  )
}
