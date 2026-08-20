/** 리치 Footer 데이터 (프론트 정적) — 푸터 문구/로고 크기는 여기만 수정 */

export interface FooterLink {
  label: string
  href: string
  external?: boolean
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface FooterConfig {
  brandName: string
  tagline: string
  copyright: string
  logoHref: string
  /** 푸터 로고 표시 높이(px). CSS 변수 --footer-logo-height 로 전달됩니다. */
  logoHeight: number
  columns: FooterColumn[]
}

export const footerConfig: FooterConfig = {
  brandName: '키:우다',
  tagline: '같이 키우는 스마트 키움 커뮤니티',
  copyright: '© 2026 키:우다 (Kiuda). All rights reserved.',
  logoHref: '/',
  logoHeight: 160,
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
        { label: '문의하기', href: 'mailto:support@kiuda.kr', external: true },
      ],
    },
    {
      title: '정책',
      links: [
        { label: '이용약관', href: '/terms' },
        { label: '개인정보처리방침', href: '/privacy' },
      ],
    },
  ],
}

/** @deprecated 하위 호환 */
export const footerColumns = footerConfig.columns.map((c) => ({
  title: c.title,
  links: c.links.map((l) => l.label),
}))

export const footerCopyright = footerConfig.copyright
