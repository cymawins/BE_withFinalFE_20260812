import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { districtsByProvince } from '../data/regions'

/**
 * 계정 설정 화면 (원본 screens/settings-account.dc.html)
 * 기본 정보 수정 / 비밀번호 변경 / 프라이버시 토글 / 계정 삭제
 */
export default function SettingsAccount() {
  const navigate = useNavigate()

  const user = { name: '김연주', email: 'yeonju.kim@example.com' }

  const [name, setName] = useState(user.name)
  const [province, setProvince] = useState('서울특별시')
  const [district, setDistrict] = useState('강남구')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('')
  const [profilePublic, setProfilePublic] = useState(true)
  const [growthPublic, setGrowthPublic] = useState(true)
  const [locationShared, setLocationShared] = useState(true)

  const districtSelectDisabled = !province
  const districtSelectBg = province ? 'white' : 'oklch(0.94 0.02 130)'
  const districtsForProvince = districtsByProvince[province] || []

  const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setProvince(e.target.value)
    setDistrict('')
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmEmail !== user.email) {
      alert('이메일이 일치하지 않습니다')
      return
    }

    try {
      const response = await fetch('/api/users/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ reason: '사용자 요청' }),
      })

      if (!response.ok) throw new Error('탈퇴 처리 실패')

      localStorage.removeItem('authToken')
      localStorage.removeItem('userId')
      alert('계정이 삭제되었습니다. 감사합니다.')
      navigate('/')
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'oklch(0.985 0.008 95)' }}>
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid oklch(0.9 0.015 120)',
          padding: 24,
          background: 'oklch(0.985 0.008 95 / 0.9)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <button
              onClick={() => navigate(-1)}
              style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer' }}
            >
              ←
            </button>
            <h1 style={{ fontSize: 28, fontWeight: 900 }}>계정 설정</h1>
          </div>
          <p style={{ fontSize: 14, color: '#888' }}>내 정보 · 비밀번호 · 프라이버시 · 계정 삭제</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '32px auto', padding: '0 20px' }}>
        {/* Section: 기본 정보 */}
        <section
          style={{
            background: 'oklch(1 0 0)',
            borderRadius: 16,
            border: '1px solid oklch(0.9 0.015 120)',
            padding: 28,
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>기본 정보</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'oklch(0.24 0.02 145)', marginBottom: 8 }}>
                이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="kiuda-input"
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid oklch(0.88 0.015 120)', borderRadius: 8, fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'oklch(0.24 0.02 145)', marginBottom: 8 }}>
                이메일
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid oklch(0.9 0.015 120)',
                  borderRadius: 8,
                  fontSize: 14,
                  background: 'oklch(0.94 0.02 130)',
                  color: '#888',
                }}
              />
              <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>이메일은 변경할 수 없습니다</p>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'oklch(0.24 0.02 145)', marginBottom: 8 }}>
              지역
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <select
                value={province}
                onChange={handleProvinceChange}
                className="kiuda-input"
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid oklch(0.88 0.015 120)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit' }}
              >
                <option value="">시/도 선택</option>
                {Object.keys(districtsByProvince).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={districtSelectDisabled}
                className="kiuda-input"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid oklch(0.88 0.015 120)',
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  background: districtSelectBg,
                }}
              >
                <option value="">시/군/구 선택</option>
                {districtsForProvince.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="kiuda-settings-save"
            style={{
              width: '100%',
              padding: 14,
              background: 'oklch(0.56 0.09 152)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            저장하기
          </button>
        </section>

        {/* Section: 비밀번호 변경 */}
        <section
          style={{
            background: 'oklch(1 0 0)',
            borderRadius: 16,
            border: '1px solid oklch(0.9 0.015 120)',
            padding: 28,
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>비밀번호 변경</h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'oklch(0.24 0.02 145)', marginBottom: 8 }}>
              현재 비밀번호
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="kiuda-input"
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid oklch(0.88 0.015 120)', borderRadius: 8, fontSize: 14 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'oklch(0.24 0.02 145)', marginBottom: 8 }}>
              새 비밀번호
            </label>
            <input
              type="password"
              placeholder="8자 이상의 비밀번호"
              className="kiuda-input"
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid oklch(0.88 0.015 120)', borderRadius: 8, fontSize: 14 }}
            />
            <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>대문자, 소문자, 숫자, 특수문자를 포함해 주세요</p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'oklch(0.24 0.02 145)', marginBottom: 8 }}>
              새 비밀번호 확인
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="kiuda-input"
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid oklch(0.88 0.015 120)', borderRadius: 8, fontSize: 14 }}
            />
          </div>

          <button
            className="kiuda-settings-save"
            style={{
              width: '100%',
              padding: 14,
              background: 'oklch(0.56 0.09 152)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            비밀번호 변경
          </button>
        </section>

        {/* Section: 프라이버시 */}
        <section
          style={{
            background: 'oklch(1 0 0)',
            borderRadius: 16,
            border: '1px solid oklch(0.9 0.015 120)',
            padding: 28,
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>프라이버시</h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 16,
              borderBottom: '1px solid oklch(0.9 0.015 120)',
            }}
          >
            <div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>프로필 공개</p>
              <p style={{ fontSize: 13, color: '#888' }}>다른 사용자가 내 프로필을 볼 수 있습니다</p>
            </div>
            <input
              type="checkbox"
              checked={profilePublic}
              onChange={(e) => setProfilePublic(e.target.checked)}
              style={{ width: 24, height: 24, cursor: 'pointer' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 0',
              borderBottom: '1px solid oklch(0.9 0.015 120)',
            }}
          >
            <div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>성장 기록 공개</p>
              <p style={{ fontSize: 13, color: '#888' }}>커뮤니티에서 내 성장 이야기를 공유합니다</p>
            </div>
            <input
              type="checkbox"
              checked={growthPublic}
              onChange={(e) => setGrowthPublic(e.target.checked)}
              style={{ width: 24, height: 24, cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>위치 정보 공유</p>
              <p style={{ fontSize: 13, color: '#888' }}>이웃 찾기 기능에서 내 위치를 사용합니다</p>
            </div>
            <input
              type="checkbox"
              checked={locationShared}
              onChange={(e) => setLocationShared(e.target.checked)}
              style={{ width: 24, height: 24, cursor: 'pointer' }}
            />
          </div>
        </section>

        {/* Section: 계정 삭제 */}
        <section style={{ background: '#FFE8E8', borderRadius: 16, border: '1.5px solid #FFB3B3', padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#C00', marginBottom: 12 }}>⚠️ 계정 삭제</h2>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
            계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
          </p>

          <div style={{ background: 'white', borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: '#333', fontWeight: 600, marginBottom: 8 }}>삭제될 데이터:</p>
            <ul style={{ fontSize: 13, color: '#666', marginLeft: 20, lineHeight: 1.8 }}>
              <li>내 프로필 및 기본 정보</li>
              <li>등록된 모든 키움이</li>
              <li>성장 기록 및 사진</li>
              <li>직접 메시지 (내 쪽 기록)</li>
              <li>좋아요, 댓글, 북마크</li>
            </ul>
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="kiuda-danger-btn"
            style={{
              width: '100%',
              padding: 14,
              background: '#C00',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            계정 삭제하기
          </button>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div
              style={{
                animation: 'slideDown 0.3s ease-out',
                marginTop: 20,
                background: 'white',
                borderRadius: 12,
                padding: 20,
                border: '1.5px solid #FFB3B3',
              }}
            >
              <p style={{ fontWeight: 700, marginBottom: 12 }}>정말 삭제하시겠습니까?</p>
              <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
                이 작업은 취소할 수 없습니다. 계속하려면 이메일을 입력해 주세요.
              </p>
              <input
                type="email"
                placeholder={user.email}
                value={deleteConfirmEmail}
                onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                className="kiuda-input"
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid oklch(0.88 0.015 120)', borderRadius: 8, fontSize: 14, marginBottom: 16 }}
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ flex: 1, padding: 12, background: 'oklch(0.94 0.02 130)', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmEmail !== user.email}
                  style={{
                    flex: 1,
                    padding: 12,
                    background: deleteConfirmEmail === user.email ? '#C00' : '#E8C8C8',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'background 0.2s',
                  }}
                >
                  삭제 확인
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
