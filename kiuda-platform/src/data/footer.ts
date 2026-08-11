/** 접이식 Footer 링크 데이터 (원본 index.html <footer class="neo-footer">) */
export interface FooterColumn {
  title: string
  links: string[]
}

export const footerColumns: FooterColumn[] = [
  { title: '키:우다', links: ['소개', '이용약관', '개인정보처리방침', '공지사항'] },
  { title: '고객지원', links: ['자주 묻는 질문', '1:1 문의', '제휴 문의'] },
]

export const footerCopyright = '@2026 키:우다(Ki:uda)'
