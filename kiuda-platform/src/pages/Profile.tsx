import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { useAuth } from '@/context/AuthContext'
import { PROFILE_STATUS_COLORS, PROFILE_STATUS_LABELS, plotRecords, ENV_LABELS, type PlantStatus } from '@/data/plots'
import { followerList, followingList } from '@/data/profile'
import { districtsByProvince, provinceOptions } from '@/data/regions'

const GREEN = 'oklch(0.56 0.09 152)'
const STATUS_ORDER: PlantStatus[] = ['GROWING', 'HARVESTED', 'ARCHIVED']

type ActiveModal = 'plants' | 'following' | 'followers' | null

/** 프로필(개인정보 관리) 화면 (원본 screens/profile.dc.html 1:1 대응) */
export default function Profile() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [formName] = useState('민준')
  const [formEmail] = useState('minjun@kiuda.app')
  const [province, setProvince] = useState('서울특별시')
  const [district, setDistrict] = useState('마포구')
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null)

  const myPlants = plotRecords.map((p) => ({
    ...p,
    statusLabel: PROFILE_STATUS_LABELS[p.status] ?? p.status,
    badgeBg: PROFILE_STATUS_COLORS[p.status]?.bg ?? 'oklch(0.92 0.01 130)',
    badgeColor: PROFILE_STATUS_COLORS[p.status]?.color ?? 'oklch(0.5 0.02 145)',
    environmentLabel: ENV_LABELS[p.environment],
  }))

  const plantGroups = STATUS_ORDER.map((status) => ({
    label: PROFILE_STATUS_LABELS[status] ?? status,
    plants: myPlants.filter((p) => p.status === status),
  })).filter((g) => g.plants.length > 0)

  const plantDetailPlot = myPlants.find((p) => p.imgId === selectedPlantId) || null
  const isPlantDetailOpen = !!selectedPlantId

  const region = `${province} ${district}`.trim()
  const user = { name: formName, email: formEmail, region, joinedAt: '2026.03.14' }

  const stats: { label: string; value: string; onClick: () => void }[] = [
    { label: '등록된 키움이', value: '6', onClick: () => setActiveModal('plants') },
    { label: '팔로잉', value: '4', onClick: () => setActiveModal('following') },
    { label: '팔로워', value: '3', onClick: () => setActiveModal('followers') },
  ]

  const districtsForProvince = districtsByProvince[province] || []

  const closeModal = () => {
    setActiveModal(null)
    setSelectedPlantId(null)
  }
  const stopPropagation: React.MouseEventHandler = (e) => e.stopPropagation()

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')
    logout()
    navigate('/')
  }

  const disabledInputStyle: React.CSSProperties = {
    border: '1.5px solid oklch(0.9 0.015 120)',
    borderRadius: 14,
    padding: '13px 16px',
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    color: 'oklch(0.5 0.02 145)',
    background: 'oklch(0.96 0.01 100)',
    width: '100%',
  }

  return (
    <div className="app-screen" style={{ minHeight: '100vh', background: 'oklch(0.985 0.008 95)', color: 'oklch(0.24 0.02 145)' }}>
      <AppHeader isProfileActive avatarInitial="민" />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(20px,4vw,40px) 100px' }}>
        <p style={{ fontSize: 13.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'oklch(0.5 0.1 152)' }}>내 정보</p>
        <h1 style={{ marginTop: 12, fontSize: 'clamp(26px,3.4vw,34px)', fontWeight: 900, letterSpacing: '-0.03em' }}>개인정보 관리</h1>

        <div style={{ marginTop: 28, borderRadius: 24, background: 'oklch(1 0 0)', padding: 28, boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <ImageSlot placeholder="프로필 사진" shape="circle" />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900 }}>{user.name}</h2>
            <p style={{ marginTop: 4, fontSize: 14, color: 'oklch(0.5 0.02 145)' }}>{user.email}</p>
            <p style={{ marginTop: 4, fontSize: 13, color: 'oklch(0.55 0.02 145)' }}>
              {user.region} · {user.joinedAt} 가입
            </p>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: 16 }}>
          {stats.map((stat) => (
            <div key={stat.label} onClick={stat.onClick} style={{ borderRadius: 20, background: 'oklch(1 0 0)', padding: 20, textAlign: 'center', boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)', cursor: 'pointer' }}>
              <p style={{ fontSize: 24, fontWeight: 900, color: 'oklch(0.5 0.1 152)' }}>{stat.value}</p>
              <p style={{ marginTop: 4, fontSize: 13, color: 'oklch(0.55 0.02 145)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, borderRadius: 24, background: 'oklch(1 0 0)', padding: 28, boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800 }}>기본 정보</h2>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'oklch(0.35 0.02 145)' }}>이름 (name)</span>
              <input type="text" value={formName} disabled style={disabledInputStyle} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'oklch(0.35 0.02 145)' }}>이메일 (email)</span>
              <input type="email" value={formEmail} disabled style={disabledInputStyle} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'oklch(0.35 0.02 145)' }}>지역 (region)</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <select value={province} disabled style={disabledInputStyle} onChange={(e) => setProvince(e.target.value)}>
                  <option value="">시/도 선택</option>
                  {provinceOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <select value={district} disabled style={disabledInputStyle} onChange={(e) => setDistrict(e.target.value)}>
                  <option value="">시/군/구 선택</option>
                  {districtsForProvince.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Link
              to="/settings/account"
              style={{ border: 'none', background: GREEN, color: 'oklch(0.99 0.006 120)', fontSize: 14.5, fontWeight: 800, padding: '12px 28px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 24px oklch(0.56 0.09 152 / 0.28)' }}
            >
              계정 설정 변경
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleLogout} style={{ border: '1.5px solid oklch(0.88 0.015 120)', background: 'transparent', color: 'oklch(0.55 0.02 145)', fontSize: 14, fontWeight: 700, padding: '11px 22px', borderRadius: 999, cursor: 'pointer' }}>
            로그아웃
          </button>
        </div>
      </main>

      {/* 나의 키움터 모달 */}
      {activeModal === 'plants' && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'oklch(0.2 0.02 145 / 0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={stopPropagation} style={{ background: 'oklch(1 0 0)', borderRadius: 24, padding: 28, maxWidth: 720, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900 }}>나의 키움터</h2>
              <button onClick={closeModal} style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: 'oklch(0.5 0.02 145)' }}>
                ×
              </button>
            </div>

            {isPlantDetailOpen && plantDetailPlot ? (
              <div style={{ maxWidth: 280 }}>
                <article style={{ borderRadius: 22, background: 'oklch(0.985 0.008 95)', overflow: 'hidden', boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)', border: '1px solid oklch(0.9 0.012 130 / 0.6)' }}>
                  <div style={{ position: 'relative', height: 120 }}>
                    <ImageSlot placeholder={plantDetailPlot.placeholder} shape="rect" />
                    <span style={{ position: 'absolute', top: 10, left: 10, borderRadius: 999, padding: '4px 10px', fontSize: 11.5, fontWeight: 800, background: plantDetailPlot.badgeBg, color: plantDetailPlot.badgeColor }}>
                      {plantDetailPlot.statusLabel}
                    </span>
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: 'oklch(0.55 0.02 145)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ color: 'oklch(0.5 0.1 152)' }}>{plantDetailPlot.environmentLabel}</span>
                      {plantDetailPlot.speciesName}
                    </p>
                    <h3 style={{ marginTop: 4, fontSize: 15.5, fontWeight: 800 }}>{plantDetailPlot.nickname}</h3>
                    <p style={{ marginTop: 8, fontSize: 12.5, color: 'oklch(0.5 0.02 145)' }}>💧 {plantDetailPlot.watered}</p>
                    <p style={{ marginTop: 2, fontSize: 11.5, color: 'oklch(0.55 0.02 145)' }}>{plantDetailPlot.plantedLocation}</p>
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => setSelectedPlantId(null)} style={{ border: 'none', background: 'transparent', color: 'oklch(0.5 0.1 152)', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '4px 0' }}>
                        ← 뒤로
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {plantGroups.map((group) => (
                  <div key={group.label}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: 'oklch(0.35 0.02 145)', marginBottom: 10 }}>
                      {group.label} ({group.plants.length})
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {group.plants.map((plot) => (
                        <button
                          key={plot.imgId}
                          onClick={() => setSelectedPlantId(plot.imgId)}
                          style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid oklch(0.9 0.012 130 / 0.6)', background: 'oklch(0.985 0.008 95)', borderRadius: 16, padding: '12px 16px', cursor: 'pointer', textAlign: 'left', width: '100%' }}
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
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 팔로워 모달 */}
      {activeModal === 'followers' && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'oklch(0.2 0.02 145 / 0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={stopPropagation} style={{ background: 'oklch(1 0 0)', borderRadius: 24, padding: 28, maxWidth: 420, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900 }}>팔로워</h2>
              <button onClick={closeModal} style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: 'oklch(0.5 0.02 145)' }}>
                ×
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {followerList.map((person) => (
                <div key={person.key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, borderRadius: 14, background: 'oklch(0.98 0.01 100)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    <ImageSlot placeholder={person.initial} shape="circle" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14.5, fontWeight: 700 }}>{person.name}</p>
                    <p style={{ fontSize: 12.5, color: 'oklch(0.55 0.02 145)', marginTop: 2 }}>{person.region}</p>
                  </div>
                  <Link to="/connect" style={{ border: '1.5px solid oklch(0.56 0.09 152)', background: 'transparent', color: 'oklch(0.56 0.09 152)', fontSize: 12.5, fontWeight: 700, padding: '7px 14px', borderRadius: 999, textDecoration: 'none', flexShrink: 0 }}>
                    방문하기
                  </Link>
                  <button style={{ border: '1.5px solid oklch(0.88 0.015 120)', background: 'transparent', color: 'oklch(0.4 0.02 145)', fontSize: 12.5, fontWeight: 700, padding: '7px 14px', borderRadius: 999, cursor: 'pointer', flexShrink: 0 }}>팔로잉</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 팔로잉 모달 */}
      {activeModal === 'following' && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'oklch(0.2 0.02 145 / 0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={stopPropagation} style={{ background: 'oklch(1 0 0)', borderRadius: 24, padding: 28, maxWidth: 420, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900 }}>팔로잉</h2>
              <button onClick={closeModal} style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: 'oklch(0.5 0.02 145)' }}>
                ×
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {followingList.map((person) => (
                <div key={person.key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, borderRadius: 14, background: 'oklch(0.98 0.01 100)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    <ImageSlot placeholder={person.initial} shape="circle" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14.5, fontWeight: 700 }}>{person.name}</p>
                    <p style={{ fontSize: 12.5, color: 'oklch(0.55 0.02 145)', marginTop: 2 }}>{person.region}</p>
                  </div>
                  <Link to="/share" style={{ border: '1.5px solid oklch(0.56 0.09 152)', background: 'transparent', color: 'oklch(0.56 0.09 152)', fontSize: 12.5, fontWeight: 700, padding: '7px 14px', borderRadius: 999, textDecoration: 'none', flexShrink: 0 }}>
                    방문하기
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
