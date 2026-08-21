/** 나누다(기록 공유) 화면 목업 데이터 (원본 screens/share.dc.html) */

export interface NeighborMaster {
  key: 'yj' | 'sh' | 'mk' | 'jw'
  avatarId: string
  name: string
  plantNickname: string
  isFollower: boolean
}

export const NEIGHBOR_MASTER: NeighborMaster[] = [
  { key: 'yj', avatarId: 'story-av-1', name: '연주', plantNickname: '베란다 상추', isFollower: true },
  { key: 'sh', avatarId: 'story-av-2', name: '승현', plantNickname: '망원 도시농장', isFollower: true },
  { key: 'mk', avatarId: 'story-av-3', name: '미경', plantNickname: '블루베리 화분', isFollower: true },
  { key: 'jw', avatarId: 'story-av-4', name: '재원', plantNickname: '옥수수 밭', isFollower: false },
]

export type Visibility = 'PRIVATE' | 'FOLLOWERS' | 'PUBLIC'
export const visibilityMeta: Record<Visibility, string> = {
  PRIVATE: '나만 보기',
  FOLLOWERS: '이웃 공개',
  PUBLIC: '전체 공개',
}

export interface StoryRecord {
  id: string
  key: string
  avatarId: string
  photoId: string
  photoPlaceholder: string
  author: string
  plantNickname: string
  createdAt: string
  sortKey: number
  visibility: Visibility
  content: string
  tags: string[]
  commentCount: number
}

export const storyData: StoryRecord[] = [
  { id: 's1', key: 'yj', avatarId: 'story-av-1', photoId: 'story-ph-1', photoPlaceholder: '상추 새싹 사진', author: '연주', plantNickname: '베란다 상추', createdAt: '5시간 전', sortKey: 100, visibility: 'FOLLOWERS', content: '씨앗 뿌린 지 열흘, 새싹이 이렇게 올라왔어요. 매일 보는 재미가 쏠쏠합니다.', tags: ['상추', '새싹일지'], commentCount: 2 },
  { id: 's2', key: 'sh', avatarId: 'story-av-2', photoId: 'story-ph-2', photoPlaceholder: '도시농장 사진', author: '승현', plantNickname: '망원 도시농장', createdAt: '어제', sortKey: 90, visibility: 'PUBLIC', content: '진딧물 방제하고 나니 잎이 훨씬 건강해졌어요. 다들 이번 주 방제 한번 해보세요!', tags: ['병해충관리'], commentCount: 4 },
  { id: 's3', key: 'yj', avatarId: 'story-av-1', photoId: 'story-ph-3', photoPlaceholder: '허브 화단 사진', author: '연주', plantNickname: '허브 화단', createdAt: '2일 전', sortKey: 80, visibility: 'FOLLOWERS', content: '바질 새순이 올라왔어요. 향이 벌써 좋네요.', tags: ['바질'], commentCount: 1 },
  { id: 's4', key: 'mk', avatarId: 'story-av-3', photoId: 'story-ph-4', photoPlaceholder: '블루베리 화분 사진', author: '미경', plantNickname: '블루베리 화분', createdAt: '3일 전', sortKey: 70, visibility: 'PUBLIC', content: '첫 열매가 파랗게 익어가고 있어요!', tags: ['블루베리'], commentCount: 3 },
  { id: 's5', key: 'sh', avatarId: 'story-av-2', photoId: 'story-ph-5', photoPlaceholder: '도시농장 흙 사진', author: '승현', plantNickname: '망원 도시농장', createdAt: '4일 전', sortKey: 60, visibility: 'PUBLIC', content: '주말에 퇴비를 좀 더 섞어줬습니다. 흙이 훨씬 부드러워졌어요.', tags: ['토양관리'], commentCount: 0 },
  { id: 's6', key: 'yj', avatarId: 'story-av-1', photoId: 'story-ph-6', photoPlaceholder: '상추 밭 사진', author: '연주', plantNickname: '베란다 상추', createdAt: '6일 전', sortKey: 50, visibility: 'FOLLOWERS', content: '상추 씨앗을 추가로 더 뿌려봤어요.', tags: ['상추'], commentCount: 0 },
]

export interface StoryComment {
  author: string
  text: string
}

export const baseComments: Record<string, StoryComment[]> = {
  s1: [{ author: '민준', text: '와 벌써 새싹이 이렇게 컸어요!' }],
  s2: [{ author: '미경', text: '저도 님오일 한번 써봐야겠어요.' }],
  s3: [],
  s4: [],
  s5: [],
  s6: [],
}

export interface ConversationMeta {
  key: string
  avatarId: string
  name: string
  lastMessage: string
  lastTime: string
}

export const conversationMeta: ConversationMeta[] = [
  { key: 'yj', avatarId: 'story-av-1', name: '연주', lastMessage: '감사합니다!', lastTime: '1시간 전' },
  { key: 'sh', avatarId: 'story-av-2', name: '승현', lastMessage: '님오일 스프레이 쓰고 있어요...', lastTime: '어제' },
  { key: 'jw', avatarId: 'story-av-4', name: '재원', lastMessage: '옥수수 관련해서 여쭤볼게 있어요.', lastTime: '3일 전' },
]

/** 2026년 8월 민준(me)의 GrowthStory 작성 기록 — 캘린더 초록 날짜 클릭 시 이 날 작성한 글만 표시 */
export const myPostsByDay: Record<number, { plantNickname: string; content: string }[]> = {
  1: [{ plantNickname: '우리집 방울이', content: '방울토마토 첫 순지르기를 했어요. 곁순 정리가 생각보다 손이 많이 가네요.' }],
  3: [{ plantNickname: '베란다 상추', content: '상추에 물을 주고 잎 상태를 확인했어요. 벌레는 아직 없네요.' }],
  6: [{ plantNickname: '고구마 밭', content: '고구마 순이 많이 뻗었길래 순 정리를 했습니다.' }],
  12: [{ plantNickname: '블루베리 화분', content: '블루베리에 첫 열매가 열렸어요! 색이 조금씩 올라오고 있어요.' }],
  19: [{ plantNickname: '허브 화단', content: '바질을 수확해서 페스토를 만들어봤어요.' }],
  27: [{ plantNickname: '옥수수 밭', content: '장마 끝나고 옥수수 상태 점검, 다행히 큰 피해는 없었어요.' }],
}

/** 2026년 8월 팔로잉 이웃들의 GrowthStory 작성일(mock) */
export const NEIGHBOR_POSTED_BY_MONTH: Record<string, Record<string, number[]>> = {
  yj: { '2026-8': [2, 5, 8, 20, 25] },
  sh: { '2026-8': [4, 15, 22] },
  mk: { '2026-8': [10, 17] },
}

export const POSTED_BY_MONTH: Record<string, number[]> = { '2026-8': [1, 3, 6, 12, 19, 27] }

export const TODAY = { year: 2026, month: 8, day: 3 }

export const calendarWeekdays = ['일', '월', '화', '수', '목', '금', '토']
