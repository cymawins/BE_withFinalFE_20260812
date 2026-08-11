import { useState } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { ImageSlot } from '@/components/ui/ImageSlot'
import {
  ENV_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  dashboardChecklist,
  plotRecords,
  type PlantEnvironment,
  type PlantStatus,
} from '@/data/plots'

const GREEN = 'oklch(0.56 0.09 152)'

const plots = plotRecords.map((p) => ({
  ...p,
  statusLabel: STATUS_LABELS[p.status],
  badgeBg: STATUS_COLORS[p.status].bg,
  badgeColor: STATUS_COLORS[p.status].color,
  environmentLabel: ENV_LABELS[p.environment],
}))

const filterDefs: { key: PlantStatus | null; label: string }[] = [
  { key: null, label: '전체' },
  { key: 'GROWING', label: STATUS_LABELS.GROWING },
  { key: 'HARVESTED', label: STATUS_LABELS.HARVESTED },
  { key: 'ARCHIVED', label: STATUS_LABELS.ARCHIVED },
]

/** 대시보드 "보다" 화면 (원본 screens/dashboard.dc.html 1:1 대응) */
export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<PlantStatus>('GROWING')
  const [selectedEnvironment, setSelectedEnvironment] = useState<PlantEnvironment>('INDOOR')
  const [selectedStatusPlotId, setSelectedStatusPlotId] = useState<string | null>(null)

  const openStatus = (status: PlantStatus) => {
    setStatusModalOpen(true)
    setSelectedStatus(status)
    setSelectedStatusPlotId(null)
  }

  const statusPlots = plots.filter((p) => p.status === selectedStatus)
  const statusDetailPlot = statusPlots.find((p) => p.imgId === selectedStatusPlotId)
  const isStatusDetailOpen = !!selectedStatusPlotId

  const stopClick: React.MouseEventHandler = (e) => e.stopPropagation()

  return (
    <div className="app-screen" style={{ minHeight: '100vh', background: 'oklch(0.985 0.008 95)', color: 'oklch(0.24 0.02 145)' }}>
      <AppHeader active="dashboard" />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(20px,4vw,40px) 100px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'oklch(0.5 0.1 152)' }}>나의 키움터</p>
            <h1 style={{ marginTop: 12, fontSize: 'clamp(28px,3.6vw,38px)', fontWeight: 900, letterSpacing: '-0.03em' }}>오늘도 건강하게 자라고 있어요, 민준님</h1>
            <p style={{ marginTop: 8, fontSize: 15.5, color: 'oklch(0.48 0.02 145)' }}>2026년 8월 3일 월요일 · 서울 마포구</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="kiuda-lift-btn"
            style={{ border: 'none', background: GREEN, color: 'oklch(0.99 0.006 120)', fontSize: 15, fontWeight: 700, padding: '14px 24px', borderRadius: 999, cursor: 'pointer', boxShadow: '0 10px 24px oklch(0.56 0.09 152 / 0.28)', transition: 'transform .2s' }}
          >
            + 새 키움이 등록
          </button>
        </div>

        <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 20 }}>
          <div style={{ borderRadius: 28, background: `linear-gradient(135deg, ${GREEN}, oklch(0.68 0.1 140))`, padding: 28, color: 'oklch(0.99 0.006 120)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, opacity: 0.85 }}>오늘의 날씨</span>
              <span style={{ fontSize: 26 }}>☀️</span>
            </div>
            <p style={{ marginTop: 18, fontSize: 32, fontWeight: 900 }}>27°C</p>
            <p style={{ marginTop: 6, fontSize: 14, opacity: 0.85 }}>맑음 · 습도 58% · 물주기 좋은 날</p>
          </div>

          <div style={{ borderRadius: 28, background: 'oklch(1 0 0)', padding: 28, boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'oklch(0.55 0.02 145)' }}>병해충 주의보</span>
              <span style={{ fontSize: 22 }}>🐛</span>
            </div>
            <p style={{ marginTop: 18, fontSize: 20, fontWeight: 800, color: 'oklch(0.6 0.14 55)' }}>진딧물 · 주의(MEDIUM)</p>
            <p style={{ marginTop: 6, fontSize: 14, color: 'oklch(0.5 0.02 145)' }}>방울토마토 등 지역 내 발생 알림</p>
          </div>

          <div style={{ borderRadius: 28, background: 'oklch(1 0 0)', padding: 28, boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'oklch(0.55 0.02 145)' }}>오늘의 체크리스트</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'oklch(0.5 0.1 152)' }}>
                {dashboardChecklist.filter((c) => c.done).length} / {dashboardChecklist.length}
              </span>
            </div>
            <ul style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none' }}>
              {dashboardChecklist.map((item) => (
                <li key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5, color: item.done ? 'oklch(0.4 0.02 145)' : 'oklch(0.55 0.02 145)' }}>
                  {item.done ? (
                    <span style={{ width: 18, height: 18, borderRadius: 6, background: GREEN, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'oklch(0.99 0.006 120)', fontSize: 12, flexShrink: 0 }}>✓</span>
                  ) : (
                    <span style={{ width: 18, height: 18, borderRadius: 6, border: '1.5px solid oklch(0.85 0.015 120)', flexShrink: 0 }} />
                  )}
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>나의 키움터 ({plots.length})</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {filterDefs.map((filter) => (
              <button
                key={filter.label}
                onClick={() => (filter.key ? openStatus(filter.key) : undefined)}
                style={{
                  border: '1.5px solid oklch(0.88 0.015 120)',
                  background: filter.key === null ? GREEN : 'transparent',
                  color: filter.key === null ? 'oklch(0.99 0.006 120)' : 'oklch(0.4 0.02 145)',
                  fontSize: 13.5,
                  fontWeight: 700,
                  padding: '9px 16px',
                  borderRadius: 999,
                  cursor: 'pointer',
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 20 }}>
          {plots.map((plot) => (
            <article
              key={plot.imgId}
              className="kiuda-plot-card"
              style={{
                borderRadius: 24,
                background: 'oklch(1 0 0)',
                overflow: 'hidden',
                boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)',
                border: '1px solid oklch(0.9 0.012 130 / 0.6)',
                transition: 'transform .3s cubic-bezier(0.16,1,0.3,1), box-shadow .3s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <div style={{ position: 'relative', height: 150 }}>
                <ImageSlot placeholder={plot.placeholder} shape="rect" />
                <span style={{ position: 'absolute', top: 12, left: 12, borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 800, background: plot.badgeBg, color: plot.badgeColor }}>
                  {plot.statusLabel}
                </span>
              </div>
              <div style={{ padding: '18px 20px 20px' }}>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: 'oklch(0.55 0.02 145)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'oklch(0.5 0.1 152)' }}>{plot.environmentLabel}</span>
                  {plot.speciesName}
                </p>
                <h3 style={{ marginTop: 4, fontSize: 17, fontWeight: 800 }}>{plot.nickname}</h3>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'oklch(0.5 0.02 145)' }}>
                  <span>💧 {plot.watered}</span>
                  <span>심은 날 {plot.plantedAt}</span>
                </div>
                <p style={{ marginTop: 4, fontSize: 12.5, color: 'oklch(0.55 0.02 145)', textAlign: 'right' }}>{plot.plantedLocation}</p>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* 상태별 상세 모달 */}
      {statusModalOpen && (
        <div
          onClick={() => setStatusModalOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'oklch(0.2 0.02 145 / 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <div
            onClick={stopClick}
            style={{ width: '100%', maxWidth: 720, maxHeight: '86vh', overflowY: 'auto', borderRadius: 32, background: 'oklch(1 0 0)', boxShadow: '0 40px 90px oklch(0.2 0.03 145 / 0.3)', padding: 'clamp(28px,4vw,40px)' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'oklch(0.5 0.1 152)' }}>상태별 키움터</p>
                <h2 style={{ marginTop: 10, fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em' }}>{STATUS_LABELS[selectedStatus]}</h2>
                <p style={{ marginTop: 6, fontSize: 14.5, color: 'oklch(0.5 0.02 145)' }}>{statusPlots.length}개의 키움이가 있어요</p>
              </div>
              <button
                onClick={() => setStatusModalOpen(false)}
                aria-label="닫기"
                style={{ border: 'none', background: 'oklch(0.96 0.015 130)', width: 36, height: 36, borderRadius: '50%', fontSize: 16, cursor: 'pointer', color: 'oklch(0.4 0.02 145)', flexShrink: 0 }}
              >
                ✕
              </button>
            </div>

            {isStatusDetailOpen && statusDetailPlot ? (
              <div style={{ marginTop: 24, maxWidth: 280 }}>
                <article style={{ borderRadius: 22, background: 'oklch(0.985 0.008 95)', overflow: 'hidden', boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)', border: '1px solid oklch(0.9 0.012 130 / 0.6)' }}>
                  <div style={{ position: 'relative', height: 120 }}>
                    <ImageSlot placeholder={statusDetailPlot.placeholder} shape="rect" />
                    <span style={{ position: 'absolute', top: 10, left: 10, borderRadius: 999, padding: '4px 10px', fontSize: 11.5, fontWeight: 800, background: statusDetailPlot.badgeBg, color: statusDetailPlot.badgeColor }}>
                      {statusDetailPlot.statusLabel}
                    </span>
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: 'oklch(0.55 0.02 145)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ color: 'oklch(0.5 0.1 152)' }}>{statusDetailPlot.environmentLabel}</span>
                      {statusDetailPlot.speciesName}
                    </p>
                    <h3 style={{ marginTop: 4, fontSize: 15.5, fontWeight: 800 }}>{statusDetailPlot.nickname}</h3>
                    <p style={{ marginTop: 8, fontSize: 12.5, color: 'oklch(0.5 0.02 145)' }}>💧 {statusDetailPlot.watered}</p>
                    <p style={{ marginTop: 2, fontSize: 11.5, color: 'oklch(0.55 0.02 145)' }}>{statusDetailPlot.plantedLocation}</p>
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => setSelectedStatusPlotId(null)} style={{ border: 'none', background: 'transparent', color: 'oklch(0.5 0.1 152)', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '4px 0' }}>
                        ← 뒤로
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ) : (
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {statusPlots.map((plot) => (
                  <button
                    key={plot.imgId}
                    onClick={() => setSelectedStatusPlotId(plot.imgId)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid oklch(0.9 0.012 130 / 0.6)', background: 'oklch(0.985 0.008 95)', borderRadius: 16, padding: '12px 16px', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                      <ImageSlot placeholder={plot.placeholder} shape="rect" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 14.5, fontWeight: 800 }}>{plot.nickname}</h3>
                      <p style={{ marginTop: 2, fontSize: 12, color: 'oklch(0.55 0.02 145)' }}>
                        {plot.speciesName} · {plot.plantedLocation}
                      </p>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 800, borderRadius: 999, padding: '4px 10px', background: plot.badgeBg, color: plot.badgeColor, flexShrink: 0 }}>{plot.statusLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 새 키움이 등록 모달 */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'oklch(0.2 0.02 145 / 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <div
            onClick={stopClick}
            style={{ width: '100%', maxWidth: 560, maxHeight: '88vh', overflowY: 'auto', borderRadius: 32, background: 'oklch(1 0 0)', boxShadow: '0 40px 90px oklch(0.2 0.03 145 / 0.3)', padding: 'clamp(28px,4vw,44px)' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'oklch(0.5 0.1 152)' }}>NEW 키움이</p>
                <h2 style={{ marginTop: 10, fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em' }}>새 키움이 등록</h2>
                <p style={{ marginTop: 6, fontSize: 14.5, color: 'oklch(0.5 0.02 145)' }}>사진 한 장이면 충분해요. 나머지는 천천히 채워가도 괜찮아요.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="닫기"
                style={{ border: 'none', background: 'oklch(0.96 0.015 130)', width: 36, height: 36, borderRadius: '50%', fontSize: 16, cursor: 'pointer', color: 'oklch(0.4 0.02 145)', flexShrink: 0 }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: 28, height: 180, borderRadius: 20, overflow: 'hidden' }}>
              <ImageSlot placeholder="키움이 사진을 올려주세요" shape="rect" />
            </div>

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'oklch(0.35 0.02 145)' }}>별명 (nickname)</span>
                <input type="text" placeholder="예: 우리집 방울이" className="kiuda-oklch-input" style={{ border: '1.5px solid oklch(0.9 0.015 120)', borderRadius: 14, padding: '13px 16px', fontSize: 15, fontFamily: 'inherit', outline: 'none', color: 'oklch(0.24 0.02 145)' }} />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'oklch(0.35 0.02 145)' }}>작물 종류</span>
                <input type="text" placeholder="예: 방울토마토" className="kiuda-oklch-input" style={{ border: '1.5px solid oklch(0.9 0.015 120)', borderRadius: 14, padding: '13px 16px', fontSize: 15, fontFamily: 'inherit', outline: 'none', color: 'oklch(0.24 0.02 145)' }} />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'oklch(0.35 0.02 145)' }}>심은 날짜 (planted_at)</span>
                <input type="date" className="kiuda-oklch-input" style={{ border: '1.5px solid oklch(0.9 0.015 120)', borderRadius: 14, padding: '13px 16px', fontSize: 15, fontFamily: 'inherit', outline: 'none', color: 'oklch(0.24 0.02 145)' }} />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'oklch(0.35 0.02 145)' }}>심은 장소 (planted_location)</span>
                <input type="text" placeholder="예: 서울 마포구" className="kiuda-oklch-input" style={{ border: '1.5px solid oklch(0.9 0.015 120)', borderRadius: 14, padding: '13px 16px', fontSize: 15, fontFamily: 'inherit', outline: 'none', color: 'oklch(0.24 0.02 145)' }} />
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'oklch(0.35 0.02 145)' }}>생육 환경 (planted_environment)</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(Object.keys(ENV_LABELS) as PlantEnvironment[]).map((key) => {
                    const active = selectedEnvironment === key
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedEnvironment(key)}
                        style={{
                          border: `1.5px solid ${active ? GREEN : 'oklch(0.88 0.015 120)'}`,
                          background: active ? GREEN : 'transparent',
                          color: active ? 'oklch(0.99 0.006 120)' : 'oklch(0.4 0.02 145)',
                          fontSize: 14,
                          fontWeight: 700,
                          padding: '10px 18px',
                          borderRadius: 999,
                          cursor: 'pointer',
                        }}
                      >
                        {ENV_LABELS[key]}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 32, display: 'flex', gap: 10 }}>
              <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, border: '1.5px solid oklch(0.88 0.015 120)', background: 'transparent', color: 'oklch(0.4 0.02 145)', fontSize: 15, fontWeight: 700, padding: 14, borderRadius: 999, cursor: 'pointer' }}>
                취소
              </button>
              <button onClick={() => setIsModalOpen(false)} style={{ flex: 1.4, border: 'none', background: GREEN, color: 'oklch(0.99 0.006 120)', fontSize: 15, fontWeight: 800, padding: 14, borderRadius: 999, cursor: 'pointer', boxShadow: '0 10px 24px oklch(0.56 0.09 152 / 0.28)' }}>
                키움이 등록하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
