/** 대시보드(보다) 화면 — 사용자 키움터(UserPlant) 목업 데이터 (원본 dashboard.dc.html) */
export type PlantStatus = 'GROWING' | 'HARVESTED' | 'DEAD' | 'ARCHIVED'
export type PlantEnvironment = 'INDOOR' | 'OUTDOOR'

export interface PlotRecord {
  imgId: string
  placeholder: string
  speciesName: string
  nickname: string
  status: PlantStatus
  watered: string
  plantedAt: string
  environment: PlantEnvironment
  plantedLocation: string
}

export const STATUS_LABELS: Record<PlantStatus, string> = {
  GROWING: '생육중',
  HARVESTED: '수확완료',
  DEAD: '고사',
  ARCHIVED: '보관',
}

export const STATUS_COLORS: Record<PlantStatus, { bg: string; color: string }> = {
  GROWING: { bg: 'oklch(0.94 0.03 140)', color: 'oklch(0.4 0.09 150)' },
  HARVESTED: { bg: 'oklch(0.93 0.05 90)', color: 'oklch(0.5 0.11 90)' },
  DEAD: { bg: 'oklch(0.94 0.02 30)', color: 'oklch(0.5 0.05 30)' },
  ARCHIVED: { bg: 'oklch(0.94 0.01 145)', color: 'oklch(0.5 0.01 145)' },
}

export const ENV_LABELS: Record<PlantEnvironment, string> = { INDOOR: '실내', OUTDOOR: '실외' }

export const plotRecords: PlotRecord[] = [
  { imgId: 'plot-1', placeholder: '방울토마토', speciesName: '방울토마토', nickname: '우리집 방울이', status: 'GROWING', watered: '오늘 완료', plantedAt: '2026.04.02', environment: 'INDOOR', plantedLocation: '서울 마포구' },
  { imgId: 'plot-2', placeholder: '상추', speciesName: '상추', nickname: '베란다 상추', status: 'GROWING', watered: '1일 전', plantedAt: '2026.05.10', environment: 'INDOOR', plantedLocation: '서울 마포구' },
  { imgId: 'plot-3', placeholder: '고구마', speciesName: '고구마', nickname: '고구마 밭', status: 'GROWING', watered: '2일 전', plantedAt: '2026.05.20', environment: 'OUTDOOR', plantedLocation: '경기 파주시' },
  { imgId: 'plot-4', placeholder: '블루베리', speciesName: '블루베리', nickname: '블루베리 화분', status: 'HARVESTED', watered: '오늘 완료', plantedAt: '2025.09.14', environment: 'INDOOR', plantedLocation: '서울 마포구' },
  { imgId: 'plot-5', placeholder: '바질', speciesName: '바질', nickname: '허브 화단', status: 'GROWING', watered: '3일 전', plantedAt: '2026.06.01', environment: 'OUTDOOR', plantedLocation: '서울 마포구' },
  { imgId: 'plot-6', placeholder: '옥수수', speciesName: '옥수수', nickname: '옥수수 밭', status: 'ARCHIVED', watered: '2일 전', plantedAt: '2025.06.03', environment: 'OUTDOOR', plantedLocation: '경기 파주시' },
]

/**
 * 프로필 화면(profile.dc.html) 전용 상태 라벨/컬러.
 * 원본에서 대시보드와 미묘하게 다른 값(ARCHIVED 배지 색 등)을 사용하므로
 * 별도 상수로 분리해 화면별 원본 값을 그대로 보존한다.
 */
export const PROFILE_STATUS_LABELS: Partial<Record<PlantStatus, string>> = {
  GROWING: '생육중',
  HARVESTED: '수확완료',
  ARCHIVED: '보관',
}

export const PROFILE_STATUS_COLORS: Partial<Record<PlantStatus, { bg: string; color: string }>> = {
  GROWING: { bg: 'oklch(0.94 0.03 140)', color: 'oklch(0.4 0.09 150)' },
  HARVESTED: { bg: 'oklch(0.93 0.05 90)', color: 'oklch(0.5 0.11 90)' },
  ARCHIVED: { bg: 'oklch(0.92 0.01 130)', color: 'oklch(0.5 0.02 145)' },
}

export const dashboardChecklist = [
  { done: true, label: '방울토마토 물주기' },
  { done: true, label: '상추 잎 상태 확인' },
  { done: false, label: '잡초 제거' },
  { done: false, label: '블루베리 가지치기' },
]
