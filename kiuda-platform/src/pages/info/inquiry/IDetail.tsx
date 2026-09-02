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

  return (
    <div>
      <table className="table table-bordered mt-3">
        <tbody>
          <tr>
            <th className="w-25 text-center">번호</th>
            <td>{inquiry.inquiry_id}</td>
          </tr>
          <tr>
            <th className="text-center">제목</th>
            <td>{inquiry.title}</td>
          </tr>
          <tr>
            <th className="text-center">내용</th>
            <td style={{ whiteSpace: "pre-wrap" }}>{inquiry.content}</td>
          </tr>
          <tr>
            <th className="text-center">상태</th>
            <td>{inquiry.status === "ANSWERED" ? "답변완료" : "대기중"}</td>
          </tr>
          <tr>
            <th className="text-center">작성일</th>
            <td>{inquiry.created_at}</td>
          </tr>
        </tbody>
      </table>

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