import axios from "axios";
import { useEffect, useState } from "react"
import { AUTH_KEY, FAQ, PAGING, URL } from "../../../config/constants";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../../components/loading/Loading";
import Pagination from "rc-pagination";

//<<<중국어->한국어로 변경>>>
import {locale} from '../../../config/locale'
import { useUserContext } from "../../../hooks/useUserContext";
import { useFaqContext } from "../../../hooks/useFaqContext";
import faq from "./Faq";

export default function FList() {

    //<<<글 등록 페이지 이동용 훅 함수>>>
    const navigate = useNavigate();
   
    //<<<커스텀 훅 함수 호출>>>
    const {users} = useUserContext();
    const {faqs,total,current,dispatch}=useFaqContext();
    
    //<<<백엔드 서버에서 전체 글 가져오기>>>
    useEffect(()=>{
        const fetch=async ()=>{
            try{
                
                const res = await axios.get(`${URL.FAQ}?_sort=-postDate&_page=${current}&_per_page=${PAGING.PAGE_SIZE}`);//-는 내림 차순
                console.log('=========List.jsx============')
                console.log(res.data.data);
                //dispatch호출
                dispatch({type:FAQ.ALL,faqs:res.data.data});
                //<선택 사항>:로딩 화면 숨기기
                setLoading(false);
            }
            catch(e){
                //<선택 사항>:에러나도 로딩 화면 숨기기
                setLoading(false);
                console.log(e);
            }
        };
        //함수 호출
        fetch();
    },[current]);//<<< 마운트 될때(1페이지) 및 current(사용자가 페이지 번호 클릭)가 바뀔때마다 게시글 페치>>>


    //총 게시글 수 변경
    useEffect(()=>{
        axios.get(URL.FAQ).then(res=>dispatch({type:FAQ.TOTAL,total:res.data.length}));
    },[]);

    //<<<선택 사항 : 로딩 화면 보이기>>>
    //  - 데이타가 많거나 비동기 요청이 여러개 인 경우 주로 사용
    const [loading,setLoading] = useState(true);

    //<<<선택사항:데이타 뿌려주기전에 로딩화면 보이기>>>
    if(loading) return <Loading/>;

    const startPage = Math.floor((current-1)/PAGING.BLOCK_PAGE) * PAGING.BLOCK_PAGE+1;// 페이지 블락의 시작 페이지 번호
    const endPage = startPage+PAGING.BLOCK_PAGE-1;// 페이지 블락의 끝 페이지 번호
    const itemRender=(currentPage,type,element)=>{
        
        //※ rc-pagination은 등록된 글이 없어도 1 페이지 아이콘이 표시된다
        // 1.게시글이 없는 경우 페이징 UI게 안보이게 수정
        if(total===0) return null;
        // 2.BLOCKPAGE수 만큼 페이지 번호 보여주기
        if(type==='page'){
            //현재 페이지 번호가 속한 페이지 블락의 번호들만 보여준다 
            if(currentPage >= startPage && endPage >= currentPage){
                //현재 페이지 강조표시
                if(currentPage===current)
                    return <span className="rc-pagination-item-link rc-pagination-item-active" style={{color:'white'}}>{currentPage}</span>;;
                return element;

            }
            //현재 페이지 번호가 속한 페이지 블락이 아닌 나머지 페이지 번호들은 안보이게
            return null;
        }
        //...버튼(페이지 번호가 많을때 나타나는 버튼),'jump-prev',jump-next'버튼은 안보이게
        if(type==='next' || type==='prev') return element;
    }

    //<<<마지막 페이지 가기 기능 구현용 변수>>>
    const lastPage=Math.ceil(total/PAGING.PAGE_SIZE);
    return <>
        <div className="text-end my-2">
            {sessionStorage.getItem(AUTH_KEY.USERNAME) === 'admin' && (
                <button className="btn btn-danger" onClick={() => navigate('/faq/form')}>
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
                {
                    faqs.map(faq => (
                        <tr key={faq.id}>
                            <td className="col-1">{faq.id}</td>
                            {/* Link의 state속성으로 faq를 넘기고 받는 쪽에서는 useLocation()훅으로 받는다*/}
                            {/* 상세보기에서 아이디로 조회하는 네트웍 요청 불필요 */}
                            <td><Link to={faq.id} state={faq}>{faq.title}</Link></td>
                            {/* ?.  연산자로 계속 새로고침 아이콘 클릭시 오류 방지 */}                            
                           
                            <td className="col-2">{users.find(user => user.username === faq.username)?.name}</td>
                            <td className="col-2">{faq.postDate.substring(0, 20)}</td>
                            <td className="col-1">{faq.views}</td>
                        </tr>
                    ))
                }
                {/* 배열이 비어있을 때  */}
                {
                    (faqs.length === 0) && (
                        <tr>
                            <td colSpan="5">등록된 글이 없습니다</td>
                        </tr>
                    )
                }
                
            </tbody>
        </table>
      
        <div className="d-flex justify-content-center">
            {/* 3.rc-pagination이 제공하지 않는 첫 페이지 가기 기능 구현*/}
            <ul className="rc-pagination">
                <li className="rc-pagination-prev" ><span className="rc-pagination-item-link" onMouseOver={
                    (e)=>{
                        current ===1 ? 
                            e.target.parentElement.classList.add('rc-pagination-disabled'):                          
                            e.target.parentElement.classList.remove('rc-pagination-disabled');
                    }

                } onClick={(e)=>current !==1 ? dispatch({type:FAQ.CURRENT,current:1}):null } >&laquo;</span>
                </li>        
            </ul>
            {/* rc-pagination의 Pagination 컴포넌트 */}
            <Pagination 
                total={total}
                current={current}
                pageSize={PAGING.PAGE_SIZE}
                onChange={(current,pageSize)=>{
                    console.log(`클릭한 페이지 번호:${current},페이지 사이즈:${pageSize}`);
                    dispatch({type:FAQ.CURRENT,current});
                }}
                locale={locale}
                itemRender={itemRender}           
            />
            {/* 4.rc-pagination이 제공하지 않는 마지막 페이지 가기 기능 구현*/}
            <ul className="rc-pagination ms-2">
                <li className="rc-pagination-next">
                    <span className="rc-pagination-item-link" onMouseOver={
                    (e)=>{

                        current ===lastPage ? 
                            e.target.parentElement.classList.add('rc-pagination-disabled'):                          
                            e.target.parentElement.classList.remove('rc-pagination-disabled');
                    }

                } onClick={(e)=>current !==lastPage ? dispatch({type:FAQ.CURRENT,current:lastPage}):null } >&raquo;</span>
                </li>
            </ul>
        </div>
    </>
}
