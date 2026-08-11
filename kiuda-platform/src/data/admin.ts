/** 관리자 대시보드 목업 데이터 (원본 screens/admin.dc.html) */

export type AdminTab = 'users' | 'withdrawn' | 'messages' | 'stats' | 'logs'

export const tabTitles: Record<AdminTab, string> = {
  users: '사용자 관리',
  withdrawn: '탈퇴 관리',
  messages: '메시지 삭제',
  stats: '통계',
  logs: '로그',
}

export interface AdminUser {
  userId: number
  email: string
  name: string
  region: string
  createdAt: string
}

export const adminUsers: AdminUser[] = [
  { userId: 1, email: 'user1@example.com', name: '김연주', region: '서울시 강남구', createdAt: '2026-08-01' },
  { userId: 2, email: 'user2@example.com', name: '이승현', region: '서울시 마포구', createdAt: '2026-08-02' },
  { userId: 3, email: 'user3@example.com', name: '박지은', region: '경기도 성남시', createdAt: '2026-08-03' },
]

export interface WithdrawnUser {
  userId: number
  email: string
  withdrawnAt: string
  reason: string
  plantCount: number
}

export const withdrawnUsers: WithdrawnUser[] = [
  { userId: 10, email: 'withdrawn1@example.com', withdrawnAt: '2026-07-28', reason: '서비스 미사용', plantCount: 2 },
  { userId: 11, email: 'withdrawn2@example.com', withdrawnAt: '2026-07-25', reason: '개인정보 우려', plantCount: 1 },
]

export interface DeletedMessage {
  messageId: string
  senderEmail: string
  receiverEmail: string
  requestedAt: string
  deletedBySender: boolean
  deletedByReceiver: boolean
}

export const deletedMessages: DeletedMessage[] = [
  { messageId: '2025-0124', senderEmail: 'sender@example.com', receiverEmail: 'receiver@example.com', requestedAt: '2026-08-05 14:22', deletedBySender: true, deletedByReceiver: true },
  { messageId: '2025-0125', senderEmail: 'user2@example.com', receiverEmail: 'user3@example.com', requestedAt: '2026-08-04 09:15', deletedBySender: true, deletedByReceiver: false },
]

export const userStats = { activeCount: 3, withdrawnCount: 2 }

export const stats = {
  totalUsers: 12000,
  newUsersThisMonth: 450,
  activeUsers: 9800,
  activeUserPercent: 82,
  withdrawnUsers: 28,
  totalPlants: 34000,
  avgPlantsPerUser: 2.8,
}

/** 일별 가입 추이(최근 30일) — 원본은 Math.random()으로 매 렌더 값이 바뀌지만
 * SPA에서는 렌더마다 그래프가 흔들리지 않도록 고정 시드 값으로 한 번만 생성한다. */
export const dailySignups: { count: number }[] = [
  18, 12, 25, 9, 21, 14, 7, 29, 16, 11, 23, 6, 19, 27, 13, 8, 22, 15, 10, 26, 17, 20, 5, 24, 12, 28, 9, 18, 21, 14,
].map((count) => ({ count }))

export interface AdminLog {
  timestamp: string
  adminEmail: string
  action: string
  target: string
  success: boolean
}

export const adminLogs: AdminLog[] = [
  { timestamp: '2026-08-05 15:42', adminEmail: 'admin@kiuda.io', action: '사용자 일시정지', target: 'user_id: 5', success: true },
  { timestamp: '2026-08-05 14:15', adminEmail: 'admin@kiuda.io', action: '메시지 삭제 처리', target: 'message_id: 2025-0124', success: true },
  { timestamp: '2026-08-04 11:30', adminEmail: 'admin@kiuda.io', action: '탈퇴 사용자 복구', target: 'user_id: 10', success: false },
]
