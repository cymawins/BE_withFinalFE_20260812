import http from "../utils/http";
import { ENDPOINTS } from "../config/apiConfig";

/** 문의 등록 요청 타입 */
export interface CreateInquiryPayload {
  title: string;
  content: string;
}

/** 문의 데이터 타입 (백엔드 응답 기준) */
export interface Inquiry {
  inquiry_id: number;
  user_id: number;
  title: string;
  content: string;
  status: "PENDING" | "ANSWERED";
  admin_reply: string | null;
  created_at: string;
  answered_at: string | null;
}

/** 페이지네이션 타입 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** 목록 응답 타입 */
export interface InquiryListResponse {
  data: Inquiry[];
  pagination: Pagination;
}

/** 문의 등록 */
export const createInquiry = async (
  payload: CreateInquiryPayload
): Promise<{ inquiryId: number; message: string }> => {
  const res = await http.post(ENDPOINTS.INQUIRIES, payload);
  return res.data;
};

/** 내 문의 목록 */
export const getMyInquiries = async (params?: {
  page?: number;
  limit?: number;
}): Promise<InquiryListResponse> => {
  const res = await http.get(ENDPOINTS.INQUIRIES, {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 5,
    },
  });
  return res.data;
};

/** 문의 상세 */
export const getInquiryById = async (id: number | string): Promise<Inquiry> => {
  const res = await http.get(`${ENDPOINTS.INQUIRIES}/${id}`);
  return res.data;
};

/** 관리자 답변 등록 */
export const replyInquiry = async (
  id: number | string,
  payload: { admin_reply: string }
): Promise<Inquiry> => {
  const res = await http.patch(`${ENDPOINTS.INQUIRIES}/${id}`, payload);
  return res.data;
};