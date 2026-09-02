/**
 * 1:1 문의 서비스 — 비회원 · 프론트 전용(localStorage) 구현
 *
 * 배경(2026-09-02 결정):
 *   확정 스키마(kiuda_db_schema_v7_confirmed_20260812_v2.sql)에 Inquiry 테이블이
 *   없고, 이번 범위에서 스키마를 추가하지 않기로 했다. 또한 문의 주체는
 *   "비회원"으로 정의되어 로그인/JWT가 필요 없다.
 *   → 서버(/api/inquiries) 호출을 제거하고 브라우저 localStorage에 저장한다.
 *
 * 주의:
 *   - 저장 범위는 "이 브라우저" 뿐이다. 다른 기기·다른 브라우저에서는 보이지 않는다.
 *   - 관리자 답변은 서버가 없으므로 지원하지 않는다(상세 화면은 안내문으로 대체).
 *   - 함수 시그니처는 기존 API 버전과 최대한 동일하게 유지했다. 추후 백엔드
 *     (server/controllers/inquiryController.js 등, 현재 주석 비활성화)를 살릴 때
 *     이 파일의 내부 구현만 axios 호출로 되돌리면 화면 코드는 그대로 쓸 수 있다.
 */

const STORAGE_KEY = 'kiuda_inquiries'

/** 문의 데이터 타입 */
export interface Inquiry {
  id: number
  /** 비회원 작성자 이름 */
  name: string
  /** 답변 받을 이메일 */
  email: string
  title: string
  content: string
  status: 'PENDING' | 'ANSWERED'
  /** ISO 8601 문자열 */
  createdAt: string
}

/** 문의 등록 요청 타입 */
export interface CreateInquiryPayload {
  name: string
  email: string
  title: string
  content: string
}

/** 페이지네이션 타입 */
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

/** 목록 응답 타입 */
export interface InquiryListResponse {
  data: Inquiry[]
  pagination: Pagination
}

/** localStorage 접근은 사파리 프라이빗 모드 등에서 예외가 날 수 있어 전부 감싼다. */
function readAll(): Inquiry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Inquiry[]
  } catch {
    return []
  }
}

function writeAll(list: Inquiry[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // 저장 실패(용량 초과·프라이빗 모드)는 조용히 무시하지 않고 호출부가 알 수 있도록 던진다.
    throw new Error('브라우저에 저장할 수 없습니다. 시크릿 모드거나 저장 공간이 부족할 수 있습니다.')
  }
}

/** 최신순(작성일 내림차순) 정렬본 */
function sortedAll(): Inquiry[] {
  return [...readAll()].sort((a, b) => b.id - a.id)
}

/** 문의 등록 */
export const createInquiry = async (
  payload: CreateInquiryPayload,
): Promise<{ inquiryId: number; message: string }> => {
  const list = readAll()
  const nextId = list.reduce((max, item) => Math.max(max, item.id), 0) + 1

  const created: Inquiry = {
    id: nextId,
    name: payload.name.trim(),
    email: payload.email.trim(),
    title: payload.title.trim(),
    content: payload.content.trim(),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  }

  writeAll([...list, created])

  return { inquiryId: created.id, message: '문의가 등록되었습니다.' }
}

/** 문의 목록 (이 브라우저에 저장된 것) */
export const getMyInquiries = async (params?: {
  page?: number
  limit?: number
}): Promise<InquiryListResponse> => {
  const page = params?.page ?? 1
  const limit = params?.limit ?? 5

  const all = sortedAll()
  const start = (page - 1) * limit

  return {
    data: all.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: all.length,
      totalPages: Math.ceil(all.length / limit) || 0,
    },
  }
}

/** 문의 상세 */
export const getInquiryById = async (id: number | string): Promise<Inquiry> => {
  const numericId = Number(id)
  const found = readAll().find((item) => item.id === numericId)
  if (!found) {
    throw new Error('문의가 존재하지 않습니다.')
  }
  return found
}
