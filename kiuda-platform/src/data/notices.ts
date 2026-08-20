/** 공지 정적 시드 (프론트 전용) */

export interface NoticeItem {
  id: number
  title: string
  content: string
  author: string
  viewCount: number
  createdAt: string
}

export const staticNotices: NoticeItem[] = [
  {
    id: 1,
    title: '키:우다 베타 오픈 안내',
    content:
      '안녕하세요, 키:우다 팀입니다.\n\n베타 서비스를 오픈했습니다.\n보다 · 묻다 · 잇다 · 나누다 흐름으로 키움을 시작해 보세요.\n\n문의: support@kiuda.kr',
    author: '운영팀',
    viewCount: 12,
    createdAt: '2026-08-01T09:00:00.000Z',
  },
  {
    id: 2,
    title: '커뮤니티 이용 가이드',
    content:
      '이웃과 품앗이·나눔을 이용할 때 서로 존중해 주세요.\n허위 정보·광고성 게시물은 제한될 수 있습니다.\n\n자세한 내용은 이용약관을 참고해 주세요.',
    author: '운영팀',
    viewCount: 8,
    createdAt: '2026-08-05T10:30:00.000Z',
  },
  {
    id: 3,
    title: '여름철 물주기 팁 공유',
    content:
      '한낮 직사광선 아래 물주기는 잎 화상을 유발할 수 있습니다.\n아침·저녁 시간대에 맞춰 주시고, 화분 배수 상태를 함께 확인해 주세요.',
    author: '운영팀',
    viewCount: 25,
    createdAt: '2026-08-10T14:00:00.000Z',
  },
]

export function getStaticNotice(id: string | number): NoticeItem | undefined {
  const n = typeof id === 'string' ? parseInt(id, 10) : id
  if (Number.isNaN(n)) return undefined
  return staticNotices.find((x) => x.id === n)
}
