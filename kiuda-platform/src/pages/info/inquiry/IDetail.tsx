<<<<<<< Updated upstream
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getInquiryById,
  replyInquiry,
  Inquiry,
} from "../../../services/inquiryService";

export default function IDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [isEditingReply, setIsEditingReply] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // 관리자 여부는 AuthContext에서 가져오는 걸 추천
  const isAdmin = !!localStorage.getItem("isAdmin"); // 실제 프로젝트에 맞게 수정

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getInquiryById(id);
        setInquiry(data);
        setReplyText(data.admin_reply || "");
      } catch (err) {
        console.error(err);
        alert("문의를 불러오지 못했습니다.");
        navigate("/inquiry");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, navigate]);

  const handleSaveReply = async () => {
    if (!inquiry || !replyText.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    try {
      const updated = await replyInquiry(inquiry.inquiry_id, {
        admin_reply: replyText.trim(),
      });
      setInquiry(updated);
      setIsEditingReply(false);
      alert("답변이 등록되었습니다.");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "답변 등록에 실패했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!inquiry) return <div>문의가 존재하지 않습니다.</div>;
=======
/**
 * 1:1 문의 상세 (비회원)
 *
 * [2026-09-02 변경]
 *  - 관리자 답변 입력/수정 UI를 제거했다. 프론트 전용 구현이라 답변을 저장할
 *    서버가 없고, 동작하지 않는 입력창을 남겨두면 오작동으로 오인된다.
 *    대신 '접수 완료 + 이메일로 답변' 안내 블록으로 대체했다.
 *  - 그에 따라 replyInquiry / isEditingReply / replyText / isAdmin 상태가 전부 사라졌다.
 *    (관리자 여부를 localStorage.adminId 로 판단하던 코드도 함께 제거 — 인증 로직에 의존하지 않는다)
 *  - 이메일은 maskEmail() 로 가려서 표시한다. 목록이 브라우저 저장이라
 *    같은 PC를 쓰는 다른 사람에게 그대로 노출될 수 있기 때문.
 */
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getInquiryById, type Inquiry } from '../../../services/inquiryService'

function fmtDateTime(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('ko-KR')
}

/** 이메일 일부를 가려서 보여준다. (예: cyma@kiuda.kr → cy**@kiuda.kr) */
function maskEmail(email: string) {
  const at = email.indexOf('@')
  if (at <= 0) return email
  const local = email.slice(0, at)
  const domain = email.slice(at)
  const visible = local.slice(0, Math.min(2, local.length))
  return `${visible}${'*'.repeat(Math.max(local.length - visible.length, 1))}${domain}`
}

export default function IDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return

      try {
        setLoading(true)
        const data = await getInquiryById(id)
        setInquiry(data)
      } catch (err) {
        console.error(err)
        alert('문의를 불러오지 못했습니다.')
        navigate('/inquiry')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id, navigate])

  if (loading) return <div>로딩 중...</div>
  if (!inquiry) return <div>문의가 존재하지 않습니다.</div>
>>>>>>> Stashed changes

  return (
    <div>
      <table className="table table-bordered mt-3">
        <tbody>
          <tr>
            <th className="w-25 text-center">번호</th>
<<<<<<< Updated upstream
            <td>{inquiry.inquiry_id}</td>
=======
            <td>{inquiry.id}</td>
          </tr>
          <tr>
            <th className="text-center">작성자</th>
            <td>{inquiry.name}</td>
          </tr>
          <tr>
            <th className="text-center">이메일</th>
            <td>{maskEmail(inquiry.email)}</td>
>>>>>>> Stashed changes
          </tr>
          <tr>
            <th className="text-center">제목</th>
            <td>{inquiry.title}</td>
          </tr>
          <tr>
            <th className="text-center">내용</th>
<<<<<<< Updated upstream
            <td style={{ whiteSpace: "pre-wrap" }}>{inquiry.content}</td>
          </tr>
          <tr>
            <th className="text-center">상태</th>
            <td>{inquiry.status === "ANSWERED" ? "답변완료" : "대기중"}</td>
          </tr>
          <tr>
            <th className="text-center">작성일</th>
            <td>{inquiry.created_at}</td>
=======
            <td style={{ whiteSpace: 'pre-wrap' }}>{inquiry.content}</td>
          </tr>
          <tr>
            <th className="text-center">상태</th>
            <td>{inquiry.status === 'ANSWERED' ? '답변완료' : '접수됨'}</td>
          </tr>
          <tr>
            <th className="text-center">작성일</th>
            <td>{fmtDateTime(inquiry.createdAt)}</td>
>>>>>>> Stashed changes
          </tr>
        </tbody>
      </table>

<<<<<<< Updated upstream
      {/* 관리자 답변 영역 */}
      <div className="mt-4">
        <h5>관리자 답변</h5>

        {inquiry.admin_reply && !isEditingReply ? (
          <div>
            <p style={{ whiteSpace: "pre-wrap" }}>{inquiry.admin_reply}</p>
            <small>{inquiry.answered_at}</small>
            {isAdmin && (
              <button
                className="btn btn-sm btn-outline-primary ms-2"
                onClick={() => setIsEditingReply(true)}
              >
                답변 수정
              </button>
            )}
          </div>
        ) : isAdmin ? (
          <div>
            <textarea
              className="form-control"
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="답변을 입력하세요"
            />
            <button className="btn btn-primary mt-2" onClick={handleSaveReply}>
              답변 등록
            </button>
          </div>
        ) : (
          <p>아직 답변이 등록되지 않았습니다.</p>
        )}
      </div>
    </div>
  );
}
=======
      {/*
        답변 영역 — 비회원·프론트 전용 구현이라 관리자 답변 기능이 없다.
        동작하지 않는 입력 UI를 남기지 않고 안내문으로 대체한다. (2026-09-02)
      */}
      <div
        style={{
          marginTop: 24,
          padding: '18px 20px',
          borderRadius: 14,
          background: 'var(--neo-bg, #eef3ea)',
          border: '1.5px solid #dce4d6',
        }}
      >
        <p style={{ margin: 0, fontWeight: 700, color: '#2d4a28' }}>문의가 접수되었습니다.</p>
        <p style={{ margin: '6px 0 0', fontSize: '0.92rem', color: '#5c6b57' }}>
          입력하신 이메일 <strong>{maskEmail(inquiry.email)}</strong> 로 답변드립니다.
          영업일 기준 1~2일이 소요될 수 있습니다.
        </p>
      </div>

      <div style={{ marginTop: 20 }}>
        <Link to="/inquiry" className="board-back-btn">
          ← 목록으로
        </Link>
      </div>
    </div>
  )
}
>>>>>>> Stashed changes
