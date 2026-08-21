/** Core Services 섹션 카드 데이터 (원본 index.html #services) */
export interface ServiceItem {
  icon: string
  title: string
  description: string
  path: string
}

export const services: ServiceItem[] = [
  {
    icon: '🌱',
    title: '보다',
    description: '나의 키움터 현황을 한 눈에 파악합니다',
    path: '/dashboard',
  },
  {
    icon: '🤖',
    title: '묻다',
    description: '지혜의 샘 AI 온새미에게 궁금한 것을 바로 묻습니다',
    path: '/ask',
  },
  {
    icon: '🤝',
    title: '잇다',
    description: '가까운 이웃을 확인하고, 품앗이를 통해 서로 연결됩니다',
    path: '/connect',
  },
  {
    icon: '📔',
    title: '나누다',
    description: '나의 일상과 키움 일지를 친한 이웃과 나눕니다',
    path: '/share',
  },
]
