import { painPoints } from '@/data/painPoints'

/** 2. Pain Points — 세로 인용구 4개 (원본 index.html #pain) */
export function PainPoints() {
  return (
    <section className="neo-section neo-section-anim" id="pain">
      <div className="neo-container">
        <h2 className="neo-h2 neo-reveal" style={{ color: '#4f7a3e' }}>
          정보는 넘치는데,
          <br />
          정작 내게 맞는 곳은 없었다
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 40,
            maxWidth: 760,
            margin: '0 auto',
            fontStyle: 'italic',
            textAlign: 'center',
            fontSize: '1.35rem',
            lineHeight: 1.6,
          }}
        >
          {painPoints.map((point, i) => (
            <div key={point.title} className={`neo-reveal${i > 0 ? ` delay-${i}` : ''}`}>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
