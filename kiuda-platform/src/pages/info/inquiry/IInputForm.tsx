/**
 * 1:1 문의 작성 폼 (비회원)
 *
 * [2026-09-02 변경]
 *  - 문의 주체를 '비회원'으로 확정하면서 이름 / 이메일 필드를 추가했다.
 *    로그인 사용자가 아니므로 작성자를 식별할 방법이 폼 입력밖에 없고,
 *    답변도 서버가 아니라 여기 입력된 이메일로 담당자가 직접 보낸다.
 *  - 저장 위치가 서버(POST /api/inquiries)에서 브라우저 localStorage 로 바뀌었다.
 *    이유는 services/inquiryService.ts 상단 주석 참고.
 *  - 에러 처리도 axios 응답(err.response.data.message)이 아니라
 *    일반 Error 메시지를 읽도록 맞췄다.
 */
import { useRef, useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createInquiry } from '../../../services/inquiryService'

/** 아주 단순한 이메일 형식 검사 — 서버 검증이 없으므로 오탈자 방지 용도 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function IInputForm() {
  const navigate = useNavigate()

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const [nameMsg, setNameMsg] = useState('')
  const [emailMsg, setEmailMsg] = useState('')
  const [titleMsg, setTitleMsg] = useState('')
  const [contentMsg, setContentMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()

    const nameNode = nameRef.current
    const emailNode = emailRef.current
    const titleNode = titleRef.current
    const contentNode = contentRef.current
    if (!nameNode || !emailNode || !titleNode || !contentNode) return

    const name = nameNode.value.trim()
    const email = emailNode.value.trim()
    const title = titleNode.value.trim()
    const content = contentNode.value.trim()

    if (!name) {
      setNameMsg('이름을 입력하세요')
      nameNode.focus()
      return
    }
    setNameMsg('')

    if (!email) {
      setEmailMsg('답변받을 이메일을 입력하세요')
      emailNode.focus()
      return
    }
    if (!EMAIL_RE.test(email)) {
      setEmailMsg('올바른 이메일 형식이 아닙니다')
      emailNode.focus()
      return
    }
    setEmailMsg('')

    if (!title) {
      setTitleMsg('제목을 입력하세요')
      titleNode.focus()
      return
    }
    setTitleMsg('')

    if (!content) {
      setContentMsg('내용을 입력하세요')
      contentNode.focus()
      return
    }
    setContentMsg('')

    try {
      setLoading(true)
      await createInquiry({ name, email, title, content })
      navigate('/inquiry')
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : '등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="inquiry-form-wrap">
      {/* 상단 헤더 — 녹색 바 제거 */}
      <div className="inquiry-form-header">
        <h3>문의 작성</h3>
        <Link to="/inquiry" className="inquiry-form-back">
          ← 목록으로
        </Link>
      </div>

      <form onSubmit={handleCreate} className="inquiry-form-body">
        <div className="inquiry-field">
          <label htmlFor="name">이름</label>
          <input ref={nameRef} type="text" id="name" placeholder="이름을 입력하세요" />
          {nameMsg && <span className="inquiry-error">{nameMsg}</span>}
        </div>

        <div className="inquiry-field">
          <label htmlFor="email">이메일</label>
          <input
            ref={emailRef}
            type="email"
            id="email"
            placeholder="답변받을 이메일 주소"
          />
          {emailMsg && <span className="inquiry-error">{emailMsg}</span>}
        </div>

        <div className="inquiry-field">
          <label htmlFor="title">제목</label>
          <input
            ref={titleRef}
            type="text"
            id="title"
            placeholder="제목을 입력하세요"
          />
          {titleMsg && <span className="inquiry-error">{titleMsg}</span>}
        </div>

        <div className="inquiry-field">
          <label htmlFor="content">내용</label>
          <textarea
            ref={contentRef}
            id="content"
            rows={10}
            placeholder="문의 내용을 입력하세요"
          />
          {contentMsg && <span className="inquiry-error">{contentMsg}</span>}
        </div>

        <div className="inquiry-form-actions">
          <Link to="/inquiry" className="neo-btn neo-btn-ghost">
            취소
          </Link>
          <button
            type="submit"
            className="neo-btn neo-btn-primary"
            disabled={loading}
          >
            {loading ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  )
}
