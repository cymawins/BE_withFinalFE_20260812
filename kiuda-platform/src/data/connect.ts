/** 잇다(이웃 연결) 화면 목업 데이터 (원본 screens/connect.dc.html) */

export interface NeighborRecord {
  key: 'yj' | 'sh' | 'mk' | 'jw'
  avatarId: string
  name: string
  region: string
  distance: string
  bio: string
  crop: string
  isFollower: boolean
}

export const neighborData: NeighborRecord[] = [
  { key: 'yj', avatarId: 'nb-1', name: '연주', region: '서울 마포구', distance: '350m', bio: '베란다에서 허브·상추를 키워요. 물주기 품앗이 환영!', crop: '상추', isFollower: true },
  { key: 'sh', avatarId: 'nb-2', name: '승현', region: '서울 마포구', distance: '700m', bio: '망원 도시농장 3년차. 병해충 정보 잘 나눠요.', crop: '방울토마토', isFollower: true },
  { key: 'mk', avatarId: 'nb-3', name: '미경', region: '서울 마포구', distance: '1.1km', bio: '방울토마토·블루베리 재배 중. 모종 나눔 자주 해요.', crop: '블루베리', isFollower: false },
  { key: 'jw', avatarId: 'nb-4', name: '재원', region: '서울 마포구', distance: '1.8km', bio: '주말농장 초보, 도구 빌려드릴 수 있어요.', crop: '옥수수', isFollower: false },
]

export interface NeighborStory {
  sortKey: number
  createdAt: string
  plantNickname: string
  content: string
}

export const neighborStories: Record<string, NeighborStory[]> = {
  yj: [
    { sortKey: 1, createdAt: '1일 전', plantNickname: '베란다 상추', content: '상추 잎이 훨씬 넓어졌어요. 이번 주에 첫 수확 해보려고요!' },
    { sortKey: 5, createdAt: '5일 전', plantNickname: '허브 화단', content: '바질 새순이 올라왔어요. 향이 벌써 좋네요.' },
  ],
  sh: [{ sortKey: 3, createdAt: '3일 전', plantNickname: '망원 도시농장 구역', content: '진딧물 방제 후 상태가 훨씬 좋아졌어요. 님오일 스프레이 효과 있네요.' }],
  mk: [{ sortKey: 2, createdAt: '2일 전', plantNickname: '블루베리 화분', content: '첫 열매가 파랗게 익어가고 있어요!' }],
  jw: [{ sortKey: 4, createdAt: '4일 전', plantNickname: '옥수수 밭', content: '장마 끝나고 수염 정리했습니다.' }],
}

export type HelpType = 'OFFER' | 'REQUEST'
export type HelpStatus = 'OPEN' | 'COMPLETED' | 'CANCELLED'

export interface HelpPostRecord {
  type: HelpType
  title: string
  content: string
  status: HelpStatus
  author: string
  distance: string
}

export const helpPostData: HelpPostRecord[] = [
  { type: 'OFFER', title: '방울토마토 모종 3개 나눔', content: '작년 씨앗에서 튼튼하게 키운 모종이에요. 직거래로 나눔합니다.', status: 'OPEN', author: '미경', distance: '1.1km' },
  { type: 'REQUEST', title: '베란다 지지대 좀 빌려주실 분', content: '고추 지지대가 부족해서요. 주말에 반납 가능합니다.', status: 'OPEN', author: '재원', distance: '1.8km' },
  { type: 'OFFER', title: '상추 씨앗 나눔합니다', content: '두 봉지 남았어요, 필요하신 분 댓글 주세요.', status: 'COMPLETED', author: '연주', distance: '350m' },
  { type: 'REQUEST', title: '진딧물 방제 노하우 여쭤봐요', content: '님오일 스프레이 만드는 법 아시는 분 계신가요?', status: 'OPEN', author: '승현', distance: '700m' },
]

export const statusMeta: Record<HelpStatus, { label: string; color: string }> = {
  OPEN: { label: '모집중', color: 'oklch(0.56 0.09 152)' },
  COMPLETED: { label: '완료', color: 'oklch(0.55 0.02 145)' },
  CANCELLED: { label: '취소됨', color: 'oklch(0.55 0.02 145)' },
}

export const typeMeta: Record<HelpType, { label: string; bg: string; color: string }> = {
  OFFER: { label: '나눔', bg: 'oklch(0.94 0.03 140)', color: 'oklch(0.4 0.09 150)' },
  REQUEST: { label: '요청', bg: 'oklch(0.94 0.05 30)', color: 'oklch(0.55 0.13 30)' },
}

export interface RegionEventRecord {
  month: string
  day: string
  title: string
  location: string
  region: string
  time: string
  tag: string
  description: string
  sourceUrl: string
}

export const eventDataAll: RegionEventRecord[] = [
  { month: '8월', day: '09', title: '망원 도시농장 여름 나눔장터', location: '망원 도시농장', region: '서울 마포구', time: '오전 10시', tag: '나눔장터', description: '지역 이웃들과 모종·씨앗을 나누는 여름 나눔장터입니다. 누구나 참여 가능해요.', sourceUrl: 'https://www.mapo.go.kr' },
  { month: '8월', day: '16', title: '초보자를 위한 병해충 예방 강좌', location: '마포구민센터 3층', region: '서울 마포구', time: '오후 2시', tag: '강좌', description: '친환경 방제법부터 계절별 병해충 예방까지, 전문가와 함께하는 무료 강좌입니다.', sourceUrl: 'https://www.mapo.go.kr' },
  { month: '8월', day: '23', title: '주말농장 공동 수확 체험', location: '파주 주말농장', region: '경기 파주시', time: '오전 9시', tag: '체험', description: '가족단위로 참여해 가을 작물을 함께 수확하는 프로그램입니다. 사전 신청 필수.', sourceUrl: 'https://www.paju.go.kr' },
]

export interface MyHelpPost {
  id: string
  type: HelpType
  title: string
  status: HelpStatus
}

export const initialMyPosts: MyHelpPost[] = [
  { id: 'm1', type: 'OFFER', title: '방울토마토 지지대 나눔', status: 'OPEN' },
  { id: 'm2', type: 'REQUEST', title: '물뿌리개 빌려주실 분', status: 'COMPLETED' },
]

export interface DmMessage {
  from: 'me' | 'them'
  text: string
}

export const defaultDmThreads: Record<string, DmMessage[]> = {
  yj: [
    { from: 'them', text: '민준님 안녕하세요! 상추 씨앗 남는 거 있으신가요?' },
    { from: 'me', text: '네 있어요! 내일 오후에 드릴게요 :)' },
    { from: 'them', text: '감사합니다!' },
  ],
  sh: [
    { from: 'me', text: '진딧물 방제 스프레이 어떤 거 쓰세요?' },
    { from: 'them', text: '님오일 스프레이 쓰고 있어요, 효과 좋아요!' },
  ],
}
