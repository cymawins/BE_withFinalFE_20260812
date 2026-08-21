/** 묻다(AI 채팅) 화면 목업 데이터 (원본 screens/ask.dc.html) */
export interface SymptomChip {
  icon: string
  label: string
}

export const symptomChips: SymptomChip[] = [
  { icon: '🍃', label: '잎이 노래져요' },
  { icon: '🐛', label: '벌레가 보여요' },
  { icon: '💧', label: '물주기 주기' },
  { icon: '🪴', label: '분갈이 시기' },
  { icon: '🔴', label: '반점이 생겼어요' },
  { icon: '🌱', label: '성장이 더뎌요' },
  { icon: '🛡️', label: '병해충 예방' },
  { icon: '✂️', label: '가지치기 방법' },
  { icon: '🌾', label: '비료 추천' },
  { icon: '☀️', label: '일조량' },
  { icon: '🧪', label: '토양 산도' },
  { icon: '🌡️', label: '온도 관리' },
  { icon: '🌬️', label: '통풍' },
  { icon: '🍅', label: '수확 시기' },
  { icon: '🌰', label: '씨앗 발아' },
  { icon: '🌿', label: '잡초 제거' },
]

export interface Diagnosis {
  id: string
  name: string
  confidence: string
  reason: string
  steps: string[]
}

export const diagnosisList: Diagnosis[] = [
  {
    id: 'aphid',
    name: '진딧물로 인한 초기 스트레스',
    confidence: '82%',
    reason: '잎 끝 황화와 함께 최근 지역 내 진딧물 주의보가 발효 중이에요. 잎 뒷면에 작은 벌레나 끈끈한 분비물이 있는지 확인해 보세요.',
    steps: ['잎 뒷면을 물로 씻어내거나 마른 천으로 닦아내기', '친환경 님오일 스프레이를 3일 간격으로 도포', '증상이 심한 잎은 조기에 제거해 확산 방지'],
  },
  {
    id: 'water',
    name: '수분 스트레스(과습 또는 건조)',
    confidence: '61%',
    reason: '최근 강수량 변화와 화분 배수 상태에 따라 뿌리가 수분을 제대로 흡수하지 못했을 가능성이 있어요.',
    steps: ['화분 배수구가 막히지 않았는지 확인', '겉흙이 마른 뒤에만 물주기로 조절', '2~3일간 잎 색 변화 관찰 후 재진단'],
  },
]

export const askDefaultQuestion = '방울토마토 잎 끝이 노랗게 마르고 있어요. 원인이 뭘까요?'
