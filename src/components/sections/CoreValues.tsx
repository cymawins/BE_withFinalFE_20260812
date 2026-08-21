import { coreValues } from '@/data/coreValues'

const positionStyle: Record<string, React.CSSProperties> = {
  top: { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', width: 220 },
  'bottom-left': { position: 'absolute', bottom: 0, left: 0, textAlign: 'center', width: 220 },
  'bottom-right': { position: 'absolute', bottom: 0, right: 0, textAlign: 'center', width: 220 },
}

const delayClass: Record<string, string> = {
  top: '',
  'bottom-left': ' delay-1',
  'bottom-right': ' delay-2',
}

/** 4. Core Values — 3원 순환 다이어그램 (원본 index.html #values) */
export function CoreValues() {
  return (
    <section className="neo-section neo-section-anim" id="values">
      <div className="neo-container">
        <h2 className="neo-h2 neo-reveal" style={{ color: '#4f7a3e' }}>
          키:우다가 추구하는 가치
        </h2>
        <div style={{ position: 'relative', width: 'min(95vw,640px)', aspectRatio: '1', margin: '64px auto 0' }}>
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
            <circle cx="50" cy="14" r="34" fill="none" stroke="#4f7a3e" strokeWidth="7" style={{ mixBlendMode: 'multiply', opacity: 0.65 }} />
            <circle cx="17" cy="80" r="34" fill="none" stroke="#4f7a3e" strokeWidth="7" style={{ mixBlendMode: 'multiply', opacity: 0.65 }} />
            <circle cx="83" cy="80" r="34" fill="none" stroke="#4f7a3e" strokeWidth="7" style={{ mixBlendMode: 'multiply', opacity: 0.65 }} />
          </svg>
          {coreValues.map((value) => (
            <div key={value.title} className={`neo-reveal${delayClass[value.position]}`} style={positionStyle[value.position]}>
              <div
                style={{
                  width: 180,
                  height: 180,
                  margin: '0 auto',
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: '#4f7a3e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 12px 30px ${value.shadowColor}`,
                }}
              >
                <h3 style={{ margin: 0, fontSize: '1.7rem', fontWeight: 900, color: '#4f7a3e' }}>{value.title}</h3>
              </div>
              <p style={{ marginTop: 16, fontSize: '1.3rem', lineHeight: 1.5 }}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
