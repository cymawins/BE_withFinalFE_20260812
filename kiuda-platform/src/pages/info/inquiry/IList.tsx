import { type ReactNode } from "react"
import { AUTH_KEY, INQUIRY, PAGING } from "../../../config/constants";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "rc-pagination";
import { locale } from '../../../config/locale'
import { useUserContext } from "../../../hooks/useUserContext";
import { useInquiryContext } from "../../../hooks/useInquiryContext";

/** 문의 목록 — API 없이 컨텍스트 초기값(빈 배열)만 사용 */
export default function IList() {
    const navigate = useNavigate();
    const { users } = useUserContext();
    const { inquiries, total, current, dispatch } = useInquiryContext();
    const list = inquiries ?? [];
    const safeTotal = total ?? 0;
    const safeCurrent = current ?? 1;

    const startPage = Math.floor((safeCurrent - 1) / PAGING.BLOCK_PAGE) * PAGING.BLOCK_PAGE + 1;
    const endPage = startPage + PAGING.BLOCK_PAGE - 1;
    const itemRender = (currentPage: number, type: string, element: ReactNode) => {
        if (safeTotal === 0) return null;
        if (type === 'page') {
            if (currentPage >= startPage && endPage >= currentPage) {
                if (currentPage === safeCurrent)
                    return <span className="rc-pagination-item-link rc-pagination-item-active" style={{ color: 'white' }}>{currentPage}</span>;
                return element;
            }
            return null;
        }
        if (type === 'next' || type === 'prev') return element;
        return null;
    };

    const lastPage = Math.max(1, Math.ceil(safeTotal / PAGING.PAGE_SIZE));

    return <>
        <div className="text-end my-2">
            {sessionStorage.getItem(AUTH_KEY.USERNAME) === 'admin' && (
                <button className="btn btn-danger" onClick={() => navigate('/inquiry/form')}>
                    글 등록
                </button>
            )}
        </div>
        <table className="table table-hover text-center">
            <thead className="table-dark">
                <tr>
                    <th className="col-1">번호</th>
                    <th>제목</th>
                    <th className="col-2">글쓴이</th>
                    <th className="col-2">작성일</th>
                    <th className="col-1">조회수</th>
                </tr>
            </thead>
            <tbody>
                {list.map((inquiry: any) => (
                    <tr key={inquiry.id}>
                        <td className="col-1">{inquiry.id}</td>
                        <td><Link to={`/inquiry/${inquiry.id}`} state={inquiry}>{inquiry.title}</Link></td>
                        <td className="col-2">{(users ?? []).find((user: any) => user.username === inquiry.username)?.name ?? inquiry.username}</td>
                        <td className="col-2">{inquiry.postDate ? String(inquiry.postDate).substring(0, 20) : '-'}</td>
                        <td className="col-1">{inquiry.views ?? 0}</td>
                    </tr>
                ))}
                {list.length === 0 && (
                    <tr>
                        <td colSpan={5}>등록된 글이 없습니다</td>
                    </tr>
                )}
            </tbody>
        </table>

        <div className="d-flex justify-content-center">
            <ul className="rc-pagination">
                <li className="rc-pagination-prev">
                    <span className="rc-pagination-item-link" onClick={() => safeCurrent !== 1 ? dispatch({ type: INQUIRY.CURRENT, current: 1 }) : null}>&laquo;</span>
                </li>
            </ul>
            <Pagination
                total={safeTotal}
                current={safeCurrent}
                pageSize={PAGING.PAGE_SIZE}
                onChange={(page: number) => dispatch({ type: INQUIRY.CURRENT, current: page })}
                locale={locale}
                itemRender={itemRender}
            />
            <ul className="rc-pagination ms-2">
                <li className="rc-pagination-next">
                    <span className="rc-pagination-item-link" onClick={() => safeCurrent !== lastPage ? dispatch({ type: INQUIRY.CURRENT, current: lastPage }) : null}>&raquo;</span>
                </li>
            </ul>
        </div>
    </>
}
