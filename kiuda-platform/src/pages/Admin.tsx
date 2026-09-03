import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  type AdminTab,
  tabTitles,
  adminUsers,
  withdrawnUsers,
  deletedMessages,
  userStats,
  stats,
  dailySignups,
  adminLogs,
} from '../data/admin'
import { useAuth } from '@/context/AuthContext'

/** 관리자 대시보드 화면 (원본 screens/admin.dc.html) */
export default function Admin() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AdminTab>('users')

  const { logout } = useAuth()
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  const suspendUser = (userId: number) => {
    alert(`사용자 ${userId} 일시정지 처리됨`)
  }

  const restoreUser = (userId: number) => {
    alert(`사용자 ${userId} 복구됨`)
  }

  const viewDeletedMessage = (msg: (typeof deletedMessages)[number]) => {
    alert(`메시지 ${msg.messageId} 상세 조회`)
  }

  const openUserDetail = (user: (typeof adminUsers)[number]) => {
    alert(`${user.name} 상세 정보 조회`)
  }

  const navItems: { key: AdminTab; label: string }[] = [
    { key: 'users', label: '👥 사용자 관리' },
    { key: 'withdrawn', label: '🚪 탈퇴 관리' },
    { key: 'messages', label: '💬 메시지 삭제' },
    { key: 'stats', label: '📊 통계' },
    { key: 'logs', label: '📋 로그' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 0, background: '#F5F0E8', color: '#3D5A3D' }}>
      {/* Sidebar */}
      <aside
        style={{
          background: 'white',
          borderRight: '1px solid #E8E3D6',
          padding: '24px 16px',
          boxShadow: '2px 0 4px rgba(0,0,0,0.02)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, padding: '0 8px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#56B968',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 900,
              color: 'white',
            }}
          >
            키
          </div>
          <span style={{ fontSize: 16, fontWeight: 900 }}>관리</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className="kiuda-admin-nav-btn"
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px 14px',
                border: 'none',
                background: activeTab === item.key ? '#E8F3E3' : 'transparent',
                color: '#3D5A3D',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: activeTab === item.key ? 700 : 500,
                transition: 'all 0.2s',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <hr style={{ border: 'none', borderTop: '1px solid #E8E3D6', margin: '24px 0' }} />

        <button
          onClick={handleLogout}
          className="kiuda-admin-logout-btn"
          style={{
            width: '100%',
            padding: '12px 14px',
            border: '1.5px solid #FFB3B3',
            background: 'white',
            borderRadius: 8,
            color: '#C00',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 14,
            transition: 'all 0.2s',
          }}
        >
          로그아웃
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ padding: 32 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900 }}>{tabTitles[activeTab]}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'white', borderRadius: 8, border: '1px solid #E8E3D6' }}>
            <span style={{ fontSize: 13, color: '#888' }}>관리자</span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#E8F3E3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
              }}
            >
              👤
            </div>
          </div>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E8E3D6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>활성 사용자 ({userStats.activeCount}명)</h2>
              <input
                type="text"
                placeholder="이메일 또는 이름으로 검색..."
                style={{ padding: '10px 14px', border: '1.5px solid #D9CFC1', borderRadius: 8, fontSize: 13, width: 240 }}
              />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E8E3D6', background: '#F5F0E8' }}>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>ID</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>이메일</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>이름</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>지역</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>가입일</th>
                  <th style={{ textAlign: 'center', padding: 12, fontWeight: 700 }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((user) => (
                  <tr key={user.userId} className="kiuda-admin-row" style={{ borderBottom: '1px solid #E8E3D6' }}>
                    <td style={{ padding: 12 }}>{user.userId}</td>
                    <td style={{ padding: 12 }}>{user.email}</td>
                    <td style={{ padding: 12 }}>{user.name}</td>
                    <td style={{ padding: 12 }}>{user.region}</td>
                    <td style={{ padding: 12 }}>{user.createdAt}</td>
                    <td style={{ padding: 12, textAlign: 'center', display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button
                        onClick={() => openUserDetail(user)}
                        style={{ padding: '6px 10px', background: '#E8F3E3', border: 'none', borderRadius: 6, color: '#56B968', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}
                      >
                        상세
                      </button>
                      <button
                        onClick={() => suspendUser(user.userId)}
                        style={{ padding: '6px 10px', background: '#FFF0E8', border: 'none', borderRadius: 6, color: '#E87C3B', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}
                      >
                        일시정지
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Withdrawn Tab */}
        {activeTab === 'withdrawn' && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E8E3D6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>탈퇴한 사용자 ({userStats.withdrawnCount}명)</h2>
              <div style={{ fontSize: 12, color: '#888' }}>최근 30일</div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E8E3D6', background: '#F5F0E8' }}>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>이메일</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>탈퇴일</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>이유</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>기록된 키움이</th>
                  <th style={{ textAlign: 'center', padding: 12, fontWeight: 700 }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {withdrawnUsers.map((wu) => (
                  <tr key={wu.userId} style={{ borderBottom: '1px solid #E8E3D6' }}>
                    <td style={{ padding: 12 }}>{wu.email}</td>
                    <td style={{ padding: 12 }}>{wu.withdrawnAt}</td>
                    <td style={{ padding: 12, color: '#888' }}>{wu.reason || '미입력'}</td>
                    <td style={{ padding: 12 }}>{wu.plantCount}개</td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      <button
                        onClick={() => restoreUser(wu.userId)}
                        style={{ padding: '6px 10px', background: '#E8F3E3', border: 'none', borderRadius: 6, color: '#56B968', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}
                      >
                        복구
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E8E3D6' }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>메시지 삭제 요청</h2>
              <p style={{ fontSize: 13, color: '#888' }}>사용자가 요청한 특정 메시지 삭제 이력 관리</p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E8E3D6', background: '#F5F0E8' }}>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>메시지 ID</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>발신자</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>수신자</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>삭제 요청일</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>상태</th>
                  <th style={{ textAlign: 'center', padding: 12, fontWeight: 700 }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {deletedMessages.map((msg) => {
                  const fullyDeleted = msg.deletedBySender && msg.deletedByReceiver
                  return (
                    <tr key={msg.messageId} style={{ borderBottom: '1px solid #E8E3D6' }}>
                      <td style={{ padding: 12, fontFamily: 'monospace', color: '#666' }}>{msg.messageId}</td>
                      <td style={{ padding: 12 }}>{msg.senderEmail}</td>
                      <td style={{ padding: 12 }}>{msg.receiverEmail}</td>
                      <td style={{ padding: 12 }}>{msg.requestedAt}</td>
                      <td style={{ padding: 12 }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            background: fullyDeleted ? '#E8F3E3' : '#FFF0E8',
                            color: fullyDeleted ? '#4A7C4E' : '#E87C3B',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {fullyDeleted ? '완전삭제' : '부분삭제'}
                        </span>
                      </td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <button
                          onClick={() => viewDeletedMessage(msg)}
                          style={{ padding: '6px 10px', background: '#E8F3E3', border: 'none', borderRadius: 6, color: '#56B968', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}
                        >
                          상세
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
              <div style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid #E8E3D6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>전체 사용자</p>
                <p style={{ fontSize: 32, fontWeight: 900, color: '#56B968' }}>{stats.totalUsers}</p>
                <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>↑ {stats.newUsersThisMonth} 이달 신규</p>
              </div>
              <div style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid #E8E3D6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>활성 사용자</p>
                <p style={{ fontSize: 32, fontWeight: 900, color: '#56B968' }}>{stats.activeUsers}</p>
                <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>{stats.activeUserPercent}% of 전체</p>
              </div>
              <div style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid #E8E3D6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>탈퇴한 사용자</p>
                <p style={{ fontSize: 32, fontWeight: 900, color: '#E87C3B' }}>{stats.withdrawnUsers}</p>
                <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>최근 30일</p>
              </div>
              <div style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid #E8E3D6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>등록된 키움이</p>
                <p style={{ fontSize: 32, fontWeight: 900, color: '#56B968' }}>{stats.totalPlants}</p>
                <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>사용자당 평균 {stats.avgPlantsPerUser}</p>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E8E3D6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>일별 가입 추이 (최근 30일)</h3>
              <div style={{ height: 240, background: '#F5F0E8', borderRadius: 8, display: 'flex', alignItems: 'flex-end', gap: 2, padding: 12 }}>
                {dailySignups.map((day, i) => (
                  <div
                    key={i}
                    className="kiuda-admin-bar"
                    style={{ flex: 1, height: day.count * 4, background: '#56B968', borderRadius: 2, opacity: 0.7, transition: 'opacity 0.2s' }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E8E3D6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>관리자 활동 로그</h2>
              <button style={{ padding: '8px 14px', background: '#E8F3E3', border: 'none', borderRadius: 8, color: '#56B968', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                내보내기
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E8E3D6', background: '#F5F0E8' }}>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>시간</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>관리자</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>액션</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>대상</th>
                  <th style={{ textAlign: 'left', padding: 12, fontWeight: 700 }}>결과</th>
                </tr>
              </thead>
              <tbody>
                {adminLogs.map((log, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E8E3D6' }}>
                    <td style={{ padding: 12, color: '#888' }}>{log.timestamp}</td>
                    <td style={{ padding: 12 }}>{log.adminEmail}</td>
                    <td style={{ padding: 12, fontWeight: 600 }}>{log.action}</td>
                    <td style={{ padding: 12, color: '#666' }}>{log.target}</td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          background: log.success ? '#E8F3E3' : '#FFE8E8',
                          color: log.success ? '#4A7C4E' : '#C00',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {log.success ? '성공' : '실패'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
