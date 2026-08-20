/**
 * LandingFooter — 리치 푸터
 * 문구·컬럼·로고 크기는 data/footer.ts 의 footerConfig 가 단일 소스입니다.
 * 로고 높이는 --footer-logo-height CSS 변수로 전달되어 neo.css 와 값이 어긋나지 않습니다.
 */
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import logoUrl from '@/assets/logo.png'
import { footerConfig, type FooterLink } from '@/data/footer'

function FooterAnchor({ link }: { link: FooterLink }) {
  const isExternal =
    link.external || link.href.startsWith('mailto:') || link.href.startsWith('http')

  if (isExternal) {
    return (
      <a
        href={link.href}
        target={link.href.startsWith('http') ? '_blank' : undefined}
        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {link.label}
      </a>
    )
  }

  return <Link to={link.href}>{link.label}</Link>
}

export function LandingFooter() {
  const logoHeightPx = `${footerConfig.logoHeight}px`

  return (
    <footer
      className="neo-footer neo-footer-rich"
      aria-label="사이트 푸터"
      style={
        {
          ['--footer-logo-height' as string]: logoHeightPx,
        } as CSSProperties
      }
    >
      <div className="neo-footer-inner">
        <div className="neo-footer-brand">
          <Link
            to={footerConfig.logoHref}
            className="neo-footer-logo"
            aria-label={footerConfig.brandName}
          >
            <img
              src={logoUrl}
              alt={footerConfig.brandName}
              className="neo-footer-logo-img"
            />
          </Link>
          <p className="neo-footer-tagline">{footerConfig.tagline}</p>
          <p className="neo-footer-copy">{footerConfig.copyright}</p>
        </div>

        <div className="neo-footer-cols">
          {footerConfig.columns.map((col) => (
            <div key={col.title} className="neo-footer-col">
              <h4>{col.title}</h4>
              {col.links.map((link) => (
                <FooterAnchor key={link.label} link={link} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
