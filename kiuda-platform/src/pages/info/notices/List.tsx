import { type ReactNode } from "react"
import { AUTH_KEY, NOTICE, PAGING } from "../../../config/constants";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "rc-pagination";
import { locale } from '../../../config/locale'
import { useUserContext } from "../../../hooks/useUserContext";
import { useNoticeContext } from "../../../hooks/useNoticeContext";

/** 공지 목록 — API 없이 컨텍스트 초기값(빈 배열)만 사용 */
export default function List() {
    const navigate = useNavigate();
    const { users } = useUserContext();
    const { notices, total, current, dispatch } = useNoticeContext();
    const list = notices ?? [];
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
                <button className="btn btn-danger" onClick={() => navigate('/notices/form')}>
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
                {list.map((notice: any) => (
                    <tr key={notice.id}>
                        <td className="col-1">{notice.id}</td>
                        <td><Link to={`/notices/${notice.id}`} state={notice}>{notice.title}</Link></td>
                        <td className="col-2">{(users ?? []).find((user: any) => user.username === notice.username)?.name ?? notice.username}</td>
                        <td className="col-2">{notice.postDate ? String(notice.postDate).substring(0, 20) : '-'}</td>
                        <td className="col-1">{notice.views ?? 0}</td>
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
                    <span className="rc-pagination-item-link" onClick={() => safeCurrent !== 1 ? dispatch({ type: NOTICE.CURRENT, current: 1 }) : null}>&laquo;</span>
                </li>
            </ul>
            <Pagination
                total={safeTotal}
                current={safeCurrent}
                pageSize={PAGING.PAGE_SIZE}
                onChange={(page: number) => dispatch({ type: NOTICE.CURRENT, current: page })}
                locale={locale}
                itemRender={itemRender}
            />
            <ul className="rc-pagination ms-2">
                <li className="rc-pagination-next">
                    <span className="rc-pagination-item-link" onClick={() => safeCurrent !== lastPage ? dispatch({ type: NOTICE.CURRENT, current: lastPage }) : null}>&raquo;</span>
                </li>
            </ul>
        </div>
    </>
}
