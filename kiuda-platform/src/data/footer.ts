/** 리치 Footer 데이터 (프론트 정적) */

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
  columns: FooterColumn[]
}

export const footerConfig: FooterConfig = {
  brandName: '키:우다',
  tagline: '같이 키우는 스마트 키움 커뮤니티',
  copyright: '© 2026 키:우다 (Kiuda). All rights reserved.',
  logoHref: '/',
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
<<<<<<< Updated upstream
        { label: '1:1 문의', href: '/inquiry' },
=======
        // [2026-09-02] 'mailto:support@kiuda.kr' -> '/inquiry'
        // 사이트 안에 1:1 문의 게시판이 있는데도 푸터의 유일한 진입점이
        // 메일 링크라서, 만들어 둔 화면에 도달할 방법 자체가 없었다.
        { label: '문의하기', href: '/inquiry' },
>>>>>>> Stashed changes
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
