import { services } from '@/data/services'
import { AuthGatedLink } from '@/components/ui/AuthLinks'

/** 5. Core Services — 2x2 카드 그리드 (원본 index.html #services) */
export function CoreServices() {
  return (
    <section className="neo-section neo-section-anim neo-tint" id="services">
      <div className="neo-container">
        <h2 className="neo-h2 neo-reveal" style={{ color: '#4f7a3e' }}>
          연결, 성장, 지속을 위한
          <br />
          키:우다의 서비스
        </h2>
        <div className="neo-grid neo-grid-2">
          {services.map((service, i) => (
            <AuthGatedLink
              key={service.path}
              to={service.path}
              className={`neo-card neo-card-lg neo-reveal${i > 0 ? ` delay-${i}` : ''}`}
            >
              <div className="neo-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </AuthGatedLink>
          ))}
        </div>
      </div>
    </section>
  )
}
