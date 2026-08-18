import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SubPageLayout } from '@/components/layout/SubPageLayout'
import { staticNotices } from '@/data/notices'

function fmtDate(iso?: string) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  } catch {
    return iso
  }
}

export default function Notices() {
  const [keyword, setKeyword] = useState('')
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const sorted = [...staticNotices].sort((a, b) => b.id - a.id)
    if (!q) return sorted
    return sorted.filter(
      (b) =>
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.content && b.content.toLowerCase().includes(q)),
    )
  }, [query])

  return (
    <SubPageLayout>
      <section className="neo-page-hero">
        <p className="neo-eyebrow dark">NEWS</p>
        <h1>
          공지<span>사항</span>
        </h1>
      </section>
      <section className="neo-content">
        <div className="neo-panel">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 16,
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setQuery(keyword.trim())}
              placeholder="제목·내용 검색"
              style={{
                flex: '1 1 180px',
                minWidth: 140,
                padding: '10px 14px',
                borderRadius: 12,
                border: '1.5px solid #dce4d6',
                fontSize: '0.95rem',
              }}
            />
            <button
              type="button"
              onClick={() => setQuery(keyword.trim())}
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                border: 'none',
                background: '#689f38',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              검색
            </button>
          </div>

          {list.length === 0 ? (
            <p style={{ color: 'var(--neo-muted)' }}>등록된 공지가 없습니다.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #dce4d6', textAlign: 'left' }}>
                    <th style={{ width: 64, padding: '10px 8px' }}>번호</th>
                    <th style={{ padding: '10px 8px' }}>제목</th>
                    <th style={{ width: 100, padding: '10px 8px' }}>작성자</th>
                    <th style={{ width: 72, padding: '10px 8px' }}>조회</th>
                    <th style={{ width: 110, padding: '10px 8px' }}>작성일</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #e8eee4' }}>
                      <td style={{ padding: '12px 8px' }}>{b.id}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <Link
                          to={`/notices/${b.id}`}
                          style={{ color: '#2d4a28', fontWeight: 600, textDecoration: 'none' }}
                        >
                          {b.title}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 8px' }}>{b.author}</td>
                      <td style={{ padding: '12px 8px' }}>{b.viewCount}</td>
                      <td style={{ padding: '12px 8px' }}>{fmtDate(b.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </SubPageLayout>
  )
}
