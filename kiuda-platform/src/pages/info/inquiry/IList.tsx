import { useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "rc-pagination";
import { locale } from "../../../config/locale";
import { INQUIRY, PAGING } from "../../../config/constants";
import { getMyInquiries } from "../../../services/inquiryService";
import { useInquiryContext } from "@/hooks/useInquiryContext";

export default function IList() {
  const { inquiries, total, current, dispatch } = useInquiryContext();

  useEffect(() => {
    const fetchList = async () => {
      try {
        const result = await getMyInquiries({
          page: current,
          limit: PAGING.PAGE_SIZE,
        });

        dispatch({ type: INQUIRY.ALL, inquiries: result.data });
        dispatch({ type: INQUIRY.TOTAL, total: result.pagination.total });
      } catch (err) {
        console.error(err);
      }
    };

    fetchList();
  }, [current, dispatch]);

 return (
  <div className="board-wrap" style={{ width: "100%" }}>
    <div className="table-responsive">
      <table
        className="table table-hover align-middle mb-0"
        style={{ width: "100%", tableLayout: "fixed" }}
      >
        <thead>
          <tr>
            <th className="text-center" style={{ width: "80px" }}>
              번호
            </th>
            <th>제목</th>
            <th className="text-center" style={{ width: "100px" }}>
              상태
            </th>
            <th className="text-center" style={{ width: "120px" }}>
              작성일
            </th>
          </tr>
        </thead>
        <tbody>
          {inquiries.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="text-center text-muted"
                style={{ padding: "48px 0" }}
              >
                등록된 문의가 없습니다
              </td>
            </tr>
          ) : (
            inquiries.map((inquiry: any) => (
              <tr key={inquiry.inquiry_id}>
                <td className="text-center">{inquiry.inquiry_id}</td>
                <td>
                  <Link
                    to={`/inquiry/${inquiry.inquiry_id}`}
                    className="text-decoration-none text-dark"
                  >
                    {inquiry.title}
                  </Link>
                </td>
                <td className="text-center">
                  <span
                    className={
                      inquiry.status === "ANSWERED"
                        ? "badge bg-success"
                        : "badge bg-secondary"
                    }
                  >
                    {inquiry.status === "ANSWERED" ? "답변완료" : "대기중"}
                  </span>
                </td>
                <td className="text-center">
                  {inquiry.created_at?.substring(0, 10)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <div
      className="d-flex justify-content-center"
      style={{ marginTop: "24px" }}
    >
      <Pagination
        total={total}
        current={current}
        pageSize={PAGING.PAGE_SIZE}
        onChange={(page) => {
          dispatch({ type: INQUIRY.CURRENT, current: page });
        }}
        locale={locale}
      />
    </div>
  </div>
);
}