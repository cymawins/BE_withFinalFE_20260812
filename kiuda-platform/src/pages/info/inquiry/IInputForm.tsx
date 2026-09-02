import { useRef, useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createInquiry } from "../../../services/inquiryService";

export default function IInputForm() {
  const navigate = useNavigate();

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [titleMsg, setTitleMsg] = useState("");
  const [contentMsg, setContentMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    const titleNode = titleRef.current;
    const contentNode = contentRef.current;
    if (!titleNode || !contentNode) return;

    const title = titleNode.value.trim();
    const content = contentNode.value.trim();

    if (!title) {
      setTitleMsg("제목을 입력하세요");
      titleNode.focus();
      return;
    }
    setTitleMsg("");

    if (!content) {
      setContentMsg("내용을 입력하세요");
      contentNode.focus();
      return;
    }
    setContentMsg("");

    try {
      setLoading(true);
      await createInquiry({ title, content });
      navigate("/inquiry");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

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
            {loading ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}