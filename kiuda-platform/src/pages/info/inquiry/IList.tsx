/**
 * 1:1 문의 목록 (비회원)
 *
 * [2026-09-02 변경]
 *  - 'rc-pagination/assets/index.css' 를 직접 import 한다. 이게 없으면
 *    페이지네이션이 세로로 흐트러진 목록으로 나온다. 색/모양은 board.css 가 덮어쓴다.
 *  - 작성자(name) 열을 추가하고 최신순 정렬을 서비스 계층에서 보장한다.
 *  - 필드명이 서버 스네이크케이스(inquiry_id, created_at)에서
 *    로컬 카멜케이스(id, createdAt)로 바뀌었다.
 *  - 저장 범위가 '이 브라우저'로 한정되므로 목록 상단에 안내 문구를 넣었다.
 *    (사용자가 다른 PC에서 자기 문의가 안 보인다고 오해하지 않도록)
 */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Pagination from 'rc-pagination'
// rc-pagination 기본 레이아웃(li 정렬 등). 색상·모양은 board.css가 덮어쓴다.
import 'rc-pagination/assets/index.css'
import { locale } from '../../../config/locale'
import { INQUIRY, PAGING } from '../../../config/constants'
import { getMyInquiries, type Inquiry } from '../../../services/inquiryService'
import { useInquiryContext } from '@/hooks/useInquiryContext'

function fmtDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.substring(0, 10)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

export default function IList() {
  const { inquiries, total, current, dispatch } = useInquiryContext()

  useEffect(() => {
    const fetchList = async () => {
      try {
        const result = await getMyInquiries({
          page: current,
          limit: PAGING.PAGE_SIZE,
        })

        dispatch({ type: INQUIRY.ALL, inquiries: result.data })
        dispatch({ type: INQUIRY.TOTAL, total: result.pagination.total })
      } catch (err) {
        console.error(err)
      }
    }

    fetchList()
  }, [current, dispatch])

  return (
    <div className="board-wrap" style={{ width: '100%' }}>
      {/* 저장 범위 안내 — 비회원·브라우저 저장 방식이라 반드시 알려야 한다 */}
      <p
        style={{
          margin: '0 0 16px',
          fontSize: '0.88rem',
          color: 'var(--neo-muted, #7a8a74)',
        }}
      >
        비회원 문의는 <strong>이 브라우저에만</strong> 저장됩니다. 답변은 작성 시 입력하신
        이메일로 보내드립니다.
      </p>

      <div className="table-responsive">
        <table
          className="table table-hover align-middle mb-0"
          style={{ width: '100%', tableLayout: 'fixed' }}
        >
          <thead>
            <tr>
              <th className="text-center" style={{ width: '80px' }}>
                번호
              </th>
              <th>제목</th>
              <th className="text-center" style={{ width: '100px' }}>
                작성자
              </th>
              <th className="text-center" style={{ width: '100px' }}>
                상태
              </th>
              <th className="text-center" style={{ width: '120px' }}>
                작성일
              </th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-muted"
                  style={{ padding: '48px 0' }}
                >
                  등록된 문의가 없습니다
                </td>
              </tr>
            ) : (
              (inquiries as Inquiry[]).map((inquiry) => (
                <tr key={inquiry.id}>
                  <td className="text-center">{inquiry.id}</td>
                  <td>
                    <Link
                      to={`/inquiry/${inquiry.id}`}
                      className="text-decoration-none text-dark"
                    >
                      {inquiry.title}
                    </Link>
                  </td>
                  <td className="text-center">{inquiry.name}</td>
                  <td className="text-center">
                    <span
                      className={
                        inquiry.status === 'ANSWERED'
                          ? 'badge bg-success'
                          : 'badge bg-secondary'
                      }
                    >
                      {inquiry.status === 'ANSWERED' ? '답변완료' : '접수됨'}
                    </span>
                  </td>
                  <td className="text-center">{fmtDate(inquiry.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        className="d-flex justify-content-center"
        style={{ marginTop: '24px' }}
      >
        <Pagination
          total={total}
          current={current}
          pageSize={PAGING.PAGE_SIZE}
          onChange={(page) => {
            dispatch({ type: INQUIRY.CURRENT, current: page })
          }}
          locale={locale}
        />
      </div>
    </div>
  )
}
