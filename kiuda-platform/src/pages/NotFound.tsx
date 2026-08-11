import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        fontFamily: 'Pretendard, sans-serif',
        background: 'oklch(0.985 0.008 95)',
        color: 'oklch(0.24 0.02 145)',
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 900 }}>페이지를 찾을 수 없습니다</h1>
      <Link to="/" style={{ color: 'oklch(0.56 0.09 152)', fontWeight: 700 }}>
        홈으로 돌아가기
      </Link>
    </div>
  )
}
