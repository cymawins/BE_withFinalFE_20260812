/** 프로필 화면 팔로워/팔로잉 목록 데이터 (원본 screens/profile.dc.html) */
export interface ConnectionPerson {
  key: string
  name: string
  region: string
  initial: string
  avatarId: string
}

export const followingList: ConnectionPerson[] = [
  { key: 'yj', name: '지수', region: '서울 마포구', initial: '지', avatarId: 'following-1' },
  { key: 'sh', name: '태윤', region: '경기 성남시', initial: '태', avatarId: 'following-2' },
  { key: 'mk', name: '서연', region: '서울 강남구', initial: '서', avatarId: 'following-3' },
  { key: 'jw', name: '도현', region: '인천 연수구', initial: '도', avatarId: 'following-4' },
]

export const followerList: ConnectionPerson[] = [
  { key: 'yj', name: '연주', region: '서울 마포구', initial: '연', avatarId: 'follower-1' },
  { key: 'sh', name: '승현', region: '서울 마포구', initial: '승', avatarId: 'follower-2' },
  { key: 'jw', name: '재원', region: '경기 파주시', initial: '재', avatarId: 'follower-3' },
]
