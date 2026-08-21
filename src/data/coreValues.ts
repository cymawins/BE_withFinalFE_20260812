/** Core Values 3원 다이어그램 데이터 (원본 index.html #values) */
export interface CoreValue {
  title: string
  description: string
  shadowColor: string
  position: 'top' | 'bottom-left' | 'bottom-right'
}

export const coreValues: CoreValue[] = [
  {
    title: '성장',
    description: '사람과 작물이 함께 성장',
    shadowColor: 'rgba(79,122,62,.25)',
    position: 'top',
  },
  {
    title: '연결',
    description: '관계·일상·지식의 연결',
    shadowColor: 'rgba(111,155,90,.25)',
    position: 'bottom-left',
  },
  {
    title: '지속',
    description: '성장·연결의 선순환',
    shadowColor: 'rgba(111,155,90,.25)',
    position: 'bottom-right',
  },
]
