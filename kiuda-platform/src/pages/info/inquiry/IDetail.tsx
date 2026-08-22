import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AUTH_KEY, INQUIRY, URL } from "../../../config/constants";
import axios from "axios";
import { useUserContext } from "../../../hooks/useUserContext";
import { useInquiryContext } from "../../../hooks/useInquiryContext";

/**
 * 1:1 문의 상세
 * - 질문: 등록 후 수정 불가
 * - 답변: 관리자만 작성/수정
 * - 삭제: 관리자만
 */
export default function IDetail() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: any };
  const { id } = useParams();

  const { users } = useUserContext();
  const { dispatch, total } = useInquiryContext();

  const [inquiry, setInquiry] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [isEditingReply, setIsEditingReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const currentUser = sessionStorage.getItem(AUTH_KEY.USERNAME);
  const isAdmin = currentUser === "admin";

  const name = users?.find((user) => user.username === inquiry?.username)?.name;

  useEffect(() => {
    if (!inquiry && id) {
      axios
        .get(`${URL.INQUIRY}/${id}`)
        .then((res) => {
          setInquiry(res.data);
          setReplyText(res.data.reply || "");
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          alert("문의글을 불러올 수 없습니다.");
          navigate("/inquiry");
        });
    } else if (inquiry) {
      setReplyText(inquiry.reply || "");
    }
  }, [id, inquiry, navigate]);

  useEffect(() => {
    if (!inquiry) return;
    axios
      .put(`${URL.INQUIRY}/${inquiry.id}`, {
        ...inquiry,
        views: (inquiry.views || 0) + 1,
      })
      .then((res) => setInquiry(res.data))
      .catch((e) => console.log(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveReply = () => {
    if (!isAdmin) return;
    const updated = {
      ...inquiry,
      reply: replyText,
      replyDate: new Date().toISOString(),
    };
    axios
      .put(`${URL.INQUIRY}/${inquiry.id}`, updated)
      .then((res) => {
        setInquiry(res.data);
        setIsEditingReply(false);
        alert("답변이 저장되었습니다.");
      })
      .catch((e) => console.log(e));
  };

  const handleDelete = () => {
    if (!isAdmin) return;
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    axios
      .delete(`${URL.INQUIRY}/${inquiry.id}`)
      .then(() => {
        dispatch({ type: INQUIRY.DELETE, total });
        navigate("/inquiry", { replace: true });
      })
      .catch((e) => console.log(e));
  };

  if (loading || !inquiry) {
    return <div className="text-center mt-5">로딩 중...</div>;
  }

  return (
    <>
      <table className="table table-bordered mt-3">
        <tbody>
          <tr>
            <th className="w-25 text-center bg-dark text-white">번호</th>
            <td>{inquiry.id}</td>
          </tr>
          <tr>
            <th className="w-25 text-center bg-dark text-white">글쓴이</th>
            <td>{name || inquiry.username}</td>
          </tr>
          <tr>
            <th className="w-25 text-center bg-dark text-white">작성일</th>
            <td>{inquiry.postDate?.substring(0, 10)}</td>
          </tr>
          <tr>
            <th className="w-25 text-center bg-dark text-white">제목</th>
            <td>{inquiry.title}</td>
          </tr>
          <tr>
            <th className="w-25 text-center bg-dark text-white">조회수</th>
            <td>{inquiry.views}</td>
          </tr>
          <tr>
            <th className="text-center bg-dark text-white" colSpan="2">
              문의 내용
            </th>
          </tr>
          <tr>
            <td colSpan="2">
              {inquiry.content?.split("\\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </td>
          </tr>
          <tr>
            <th className="text-center bg-primary text-white" colSpan="2">
              관리자 답변
            </th>
          </tr>
          <tr>
            <td colSpan="2" className="bg-light">
              {isEditingReply ? (
                <>
                  <textarea
                    className="form-control"
                    rows={6}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="답변을 입력하세요"
                  />
                  <div className="mt-2">
                    <button className="btn btn-primary btn-sm" onClick={handleSaveReply}>
                      답변 저장
                    </button>
                    <button
                      className="btn btn-secondary btn-sm ms-2"
                      onClick={() => {
                        setIsEditingReply(false);
                        setReplyText(inquiry.reply || "");
                      }}
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {inquiry.reply ? (
                    <>
                      {inquiry.reply.split("\\n").map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                      {inquiry.replyDate && (
                        <div className="text-muted mt-2 small">
                          답변일: {String(inquiry.replyDate).substring(0, 10)}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-muted">아직 답변이 등록되지 않았습니다.</span>
                  )}
                  {isAdmin && (
                    <div className="mt-3">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setIsEditingReply(true)}
                      >
                        {inquiry.reply ? "답변 수정" : "답변 등록"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="text-center mt-3">
        {isAdmin && (
          <button className="btn btn-danger me-2" onClick={handleDelete}>
            삭제
          </button>
        )}
        <button className="btn btn-secondary" onClick={() => navigate("/inquiry")}>
          목록
        </button>
        <Link to="/inquiry" className="btn btn-outline-secondary ms-2">
          목록 (Link)
        </Link>
      </div>
    </>
  );
}
