import { Link, useParams } from 'react-router-dom'
import { SubPageLayout } from '@/components/layout/SubPageLayout'
import { getStaticNotice } from '@/data/notices'

function fmtDate(iso?: string) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString('ko-KR')
  } catch {
    return iso
  }
}

export default function NoticeDetail() {
  const { id } = useParams()
  const item = id ? getStaticNotice(id) : undefined

  return (
    <SubPageLayout>
      <section className="neo-page-hero">
        <p className="neo-eyebrow dark">NEWS</p>
        <h1>
          공지<span>상세</span>
        </h1>
      </section>
      <section className="neo-content">
        <div className="neo-panel">
          {!item ? (
            <p style={{ color: '#c62828' }}>공지를 찾을 수 없습니다.</p>
          ) : (
            <>
              <h2 style={{ fontSize: '1.35rem', color: '#1e3320', marginBottom: 4 }}>{item.title}</h2>
              <div
                style={{
                  color: '#7a8a74',
                  fontSize: '0.9rem',
                  margin: '8px 0 20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <span>작성자 {item.author}</span>
                <span>조회 {item.viewCount}</span>
                <span>{fmtDate(item.createdAt)}</span>
              </div>
              <div
                style={{
                  lineHeight: 1.85,
                  color: '#2d4a28',
                  whiteSpace: 'pre-wrap',
                  marginBottom: 24,
                }}
              >
                {item.content}
              </div>
            </>
          )}
          <Link
            to="/notices"
            style={{
              display: 'inline-block',
              padding: '10px 16px',
              borderRadius: 12,
              border: '1.5px solid #dce4d6',
              background: '#fff',
              fontWeight: 700,
              textDecoration: 'none',
              color: '#2d4a28',
              fontSize: '0.9rem',
            }}
          >
            목록으로
          </Link>
        </div>
      </section>
    </SubPageLayout>
  )
}
