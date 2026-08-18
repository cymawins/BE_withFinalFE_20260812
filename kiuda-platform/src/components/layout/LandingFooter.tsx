import { Link } from 'react-router-dom'
import logoUrl from '@/assets/logo.png'
import { footerConfig, type FooterLink } from '@/data/footer'

/**
 * kiwuda neo-footer-rich 이식 Footer (프론트 전용)
 */
export function LandingFooter() {
  const config = footerConfig

  const renderLink = (link: FooterLink) => {
    if (link.external || link.href.startsWith('mailto:') || link.href.startsWith('http')) {
      return (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {link.label}
        </a>
      )
    }
    return (
      <Link key={link.label} to={link.href}>
        {link.label}
      </Link>
    )
  }

  return (
    <footer className="neo-footer neo-footer-rich" aria-label="사이트 푸터">
      <div className="neo-footer-inner">
        <div className="neo-footer-brand">
          <Link to={config.logoHref || '/'} className="neo-footer-logo">
            <img src={logoUrl} alt={config.brandName} />
            <span>{config.brandName}</span>
          </Link>
          {config.tagline ? <p className="neo-footer-tagline">{config.tagline}</p> : null}
          <p className="neo-footer-copy">{config.copyright}</p>
        </div>

        <div className="neo-footer-cols">
          {config.columns.map((col) => (
            <div key={col.title} className="neo-footer-col">
              <h4>{col.title}</h4>
              {col.links.map(renderLink)}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
