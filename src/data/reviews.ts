/** Reviews 섹션 이웃 후기 데이터 (원본 index.html #reviews) */
export interface Review {
  stars: number
  text: string
  avatarLetter: string
  name: string
  meta: string
}

export const reviews: Review[] = [
  {
    stars: 5,
    text: '"잎이 노랗게 변했을 때 온새미에게 물어보니 바로 원인을 알려줘서 정말 편했어요. 초보인데도 작물이 살아났습니다."',
    avatarLetter: '민',
    name: '김민지',
    meta: '베란다 키움 · 3개월차',
  },
  {
    stars: 5,
    text: '"남는 상추를 피드에 올렸더니 이웃이 가져가 주시고, 대신 방울토마토를 나눠 주셨어요. 서로 웃는 맛이 납니다."',
    avatarLetter: '준',
    name: '이준호',
    meta: '옥상 텃밭 · 1년차',
  },
  {
    stars: 5,
    text: '"전문 사이트는 너무 어렵고, 블로그는 정보가 흩어져 있었는데 키우다는 한곳에서 다 해결돼요. 일지도 습관이 됐습니다."',
    avatarLetter: '서',
    name: '박서연',
    meta: '취미 농부 · 6개월차',
  },
]
