import { useNavigate } from "react-router-dom";

interface BoardBackButtonProps {
  to?: string;
  fallback?: string;
  label?: string;
}

/**
 * 게시판 공통 뒤로가기
 * - to 가 있으면 해당 경로로 이동
 * - 없으면 history.back(), 히스토리 없으면 fallback
 */
export default function BoardBackButton({ to, fallback = "/", label = "뒤로가기" }: BoardBackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button type="button" className="board-back-btn" onClick={handleClick} aria-label={label}>
      <svg
        className="board-back-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {label}
    </button>
  );
}
