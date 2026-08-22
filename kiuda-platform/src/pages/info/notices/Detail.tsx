import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { AUTH_KEY, NOTICE, URL } from "../../../config/constants";
import axios from "axios";
import { useUserContext } from "../../../hooks/useUserContext";
import { useNoticeContext } from "../../../hooks/useNoticeContext";

export default function Detail() {

    //<<<페이지 전환 훅 함수>>>
    const navigate = useNavigate();    
    const {state} = useLocation() as { state: any };
    console.log('(Detail.tsx)state:',state);

    //<<<notice의 username대신 users에 있는 name으로 표시하기>>> 
    const {users} = useUserContext();
    const {dispatch,total} = useNoticeContext();
   
    const name =users.find(user=>user.username===state.username)?.name;
    


    //<<<글 조회수 증가시키기>>>
    useEffect(()=>{
        axios
            .put(`${URL.NOTICE}/${state.id}`,{...state,views:state.views+1})
            .then(res=>{
                //data.json(DB)만 수정하면 된다
                console.log('조회수 수정한 결과 데이타:',res.data);
            })
            .catch(e=>console.log(e));

    },[]);

    //<<<게시글 삭제하기>>>
    const handleDelete=()=>{
        if(window.confirm('정말로 삭제 할래?')){
            //백엔드 서버(JSON-SERVER) 삭제 요청
            axios
                .delete(`${URL.NOTICE}/${state.id}`)
                .then(res=>{
                    console.log('게시글 삭제 성공:',res.data);
                    //페이징 적용시:총 게시글수 변경                   
                    dispatch({type:NOTICE.DELETE,total})
                    navigate('/notices',{replace:true});
                })
                .catch(e=>console.log(e));
        }
    };

    //<<< 본인 글이 아닌 경우 수정/삭제 버튼 숨기자>>>
    const updateAndDeleteButton =
    sessionStorage.getItem(AUTH_KEY.USERNAME) === 'admin'
        ? <>
            <button
                className="btn btn-success"
                onClick={() => navigate(`/notices/form/${state.id}`, { state })}
            >
                수정
            </button>

            <button
                className="btn btn-success mx-2"
                onClick={handleDelete}
            >
                삭제
            </button>
        </>
        : null;


    return <>
        <table className="table table-bordered mt-3">
            <tbody>
                <tr>
                    <th className="w-25 text-center bg-dark text-white">번호</th>
                    <td>{state.id}</td>
                </tr>
                <tr>
                    <th className="w-25 text-center bg-dark text-white">글쓴이</th>
                    <td>{name}</td>
                </tr>
                <tr>
                    <th className="w-25 text-center bg-dark text-white">작성일</th>
                    <td>{state.postDate.substring(0,10)}</td>
                </tr>
                <tr>
                    <th className="w-25 text-center bg-dark text-white">제목</th>
                    <td>{state.title}</td>
                </tr>
                <tr>
                    <th className="w-25 text-center bg-dark text-white">조회수</th>
                    <td>{state.views+1}</td>
                </tr>
                <tr>
                    <th className="text-center bg-dark text-white" colSpan="2">내용</th>
                </tr>
                <tr>
                    {/*
                        ※https://reactjs.org/docs/dom-elements.html
                        XSS공격을 막기 위해 자바스트립트 코드로 '\n'을 '<br/>'문자열로
                        변경시 태그가 아닌 문자열("<br/>")로 렌더링

                    */}
                    {/*<td colSpan="2">{state.content.replace('\n','<br/>')}</td>*/}
                    {/* \n으로 split한 배열에 map을 적용해서 콜백함수에서 내용들을 JSX로 리턴*/}
                    <td colSpan="2">{state.content.split('\n').map((element,index)=><React.Fragment key={index}>{element}<br/></React.Fragment>)}</td>
                </tr>
            </tbody>
        </table>
        <div className="text-center">
            {/*수정 및 삭제 버튼 표시 */}           
            {updateAndDeleteButton}
            {/* naviget()함수로 페이지 전환 */}
            <button className="btn btn-success" onClick={()=>navigate('/notices')}>목록(button)</button>
            {/* Link컴포넌트로 페이지 전환 */}
            <Link to="/notices" className="btn btn-warning ms-2">목록(Link)</Link>
        </div>
    </>
}