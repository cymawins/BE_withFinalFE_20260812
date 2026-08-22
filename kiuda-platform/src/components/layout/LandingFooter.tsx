/**
 * LandingFooter — 리치 푸터
 * 로고 크기는 CSS 우선순위 문제를 피하기 위해 img 에 인라인 style 로 강제합니다.
 */
import { Link } from 'react-router-dom'
import logoUrl from '@/assets/logo.png'

type FooterLink = {
  label: string
  href: string
  external?: boolean
}

type FooterColumn = {
  title: string
  links: FooterLink[]
}

const FOOTER = {
  brandName: '키:우다',
  tagline: '같이 키우는 스마트 키움 커뮤니티',
  copyright: '© 2026 키:우다 (Kiuda). All rights reserved.',
  logoHref: '/',
  /** 푸터 로고 표시 높이(px). 작으면 이 숫자만 키우면 됩니다. */
  logoHeight: 100,
  columns: [
    {
      title: '서비스 정보',
      links: [
        { label: '서비스 소개', href: '/about' },
        { label: '공지사항', href: '/notices' },
      ],
    },
    {
      title: '도움',
      links: [
        { label: '이용방법', href: '/guide' },
        { label: 'FAQ', href: '/faq' },
        { label: '1:1 문의', href: '/inquiry' },
      ],
    },
    {
      title: '정책',
      links: [
        { label: '이용약관', href: '/terms' },
        { label: '개인정보처리방침', href: '/privacy' },
      ],
    },
  ] as FooterColumn[],
}

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
  return (
    <footer className="neo-footer neo-footer-rich" aria-label="사이트 푸터">
      <div className="neo-footer-inner">
        <div className="neo-footer-brand">
          {/* 옆 타이핑 글자 없음. 크기는 인라인 style 로 강제 (CSS 덮어쓰기 방지) */}
          <Link
            to={FOOTER.logoHref}
            className="neo-footer-logo"
            aria-label={FOOTER.brandName}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginBottom: 12,
              textDecoration: 'none',
            }}
          >
            <img
              src={logoUrl}
              alt={FOOTER.brandName}
              className="neo-footer-logo-img"
              style={{
                height: FOOTER.logoHeight,
                width: 'auto',
                maxHeight: 'none',
                maxWidth: 'min(90vw, 360px)',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </Link>
          <p className="neo-footer-tagline">{FOOTER.tagline}</p>
          <p className="neo-footer-copy">{FOOTER.copyright}</p>
        </div>

        <div className="neo-footer-cols">
          {FOOTER.columns.map((col) => (
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
