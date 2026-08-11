/** 헤더/모바일 메뉴 공용 내비게이션 데이터 (원본 index.html <nav class="neo-nav">) */
export interface NavItem {
  label: string
  path: string
}

export const navItems: NavItem[] = [
  { label: '보다', path: '/dashboard' },
  { label: '묻다', path: '/ask' },
  { label: '잇다', path: '/connect' },
  { label: '나누다', path: '/share' },
]
